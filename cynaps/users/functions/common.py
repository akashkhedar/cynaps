"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license."""

import io
import logging
import os
import uuid
from time import time

from PIL import Image
from core.utils.common import load_func

logger = logging.getLogger(__name__)
from django import forms
from django.conf import settings
from django.contrib import auth
from django.core.files.images import get_image_dimensions
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.shortcuts import redirect
from django.urls import reverse
from organizations.models import Organization
from users.models_verification import EmailVerificationToken
from users.email_verification import send_verification_email


# Avatar configuration
AVATAR_SIZE = (400, 400)  # Target avatar dimensions
AVATAR_MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB max upload size
AVATAR_QUALITY = 85  # JPEG compression quality (1-100)


def hash_upload(instance, filename):
    filename = str(uuid.uuid4())[0:8] + "-" + filename
    return settings.AVATAR_PATH + "/" + filename


def process_avatar_image(image_file):
    """
    Process avatar image: resize, crop to square, and compress.
    
    Args:
        image_file: Uploaded image file
        
    Returns:
        InMemoryUploadedFile: Processed image ready for storage
    """
    # Open image with PIL
    img = Image.open(image_file)
    
    # Convert to RGB if necessary (handles PNG with transparency, etc.)
    if img.mode in ('RGBA', 'LA', 'P'):
        # Create white background for transparent images
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Get current dimensions
    width, height = img.size
    
    # Crop to square (center crop)
    if width != height:
        min_dim = min(width, height)
        left = (width - min_dim) // 2
        top = (height - min_dim) // 2
        right = left + min_dim
        bottom = top + min_dim
        img = img.crop((left, top, right, bottom))
    
    # Resize to target dimensions using high-quality resampling
    img = img.resize(AVATAR_SIZE, Image.Resampling.LANCZOS)
    
    # Save to buffer with compression
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG', quality=AVATAR_QUALITY, optimize=True)
    buffer.seek(0)
    
    # Generate new filename
    original_name = os.path.splitext(image_file.name)[0]
    new_filename = f"{original_name}_avatar.jpg"
    
    # Create InMemoryUploadedFile
    processed_file = InMemoryUploadedFile(
        file=buffer,
        field_name='avatar',
        name=new_filename,
        content_type='image/jpeg',
        size=buffer.getbuffer().nbytes,
        charset=None
    )
    
    return processed_file


def check_avatar(files):
    images = list(files.items())
    if not images:
        return None

    _, avatar = list(files.items())[0]  # get first file
    
    # Validate file size (before processing)
    if hasattr(avatar, 'size') and avatar.size > AVATAR_MAX_FILE_SIZE:
        raise forms.ValidationError(
            f"Avatar file size may not exceed {AVATAR_MAX_FILE_SIZE // (1024 * 1024)} MB"
        )
    
    # Check if it's a valid image
    w, h = get_image_dimensions(avatar)
    if not w or not h:
        raise forms.ValidationError("Can't read image, try another one")

    valid_extensions = ["jpeg", "jpg", "gif", "png", "webp"]

    filename = avatar.name
    # check file extension
    ext = os.path.splitext(filename)[1].lstrip(".").lower()
    if ext not in valid_extensions:
        raise forms.ValidationError(
            "Please upload a valid image file with extensions: JPEG, JPG, GIF, PNG, or WEBP."
        )

    # validate content type
    content_type = avatar.content_type.lower()
    valid_content_types = ["image/jpeg", "image/jpg", "image/gif", "image/png", "image/webp"]
    if content_type not in valid_content_types:
        raise forms.ValidationError("Please use a JPEG, GIF, PNG, or WEBP image.")

    # Reset file pointer before processing
    avatar.seek(0)
    
    # Process the image (resize, crop, compress)
    try:
        processed_avatar = process_avatar_image(avatar)
        logger.info(f"Avatar processed: original {w}x{h} -> {AVATAR_SIZE[0]}x{AVATAR_SIZE[1]}, "
                   f"size: {processed_avatar.size} bytes")
        return processed_avatar
    except Exception as e:
        logger.error(f"Error processing avatar: {e}")
        raise forms.ValidationError("Failed to process image. Please try another one.")


def save_user(request, next_page, user_form):
    """Save user instance to DB"""
    user = user_form.save()
    user.username = user.email.split("@")[0]

    # Determine role based on user_role field from form
    user_role = user_form.cleaned_data.get("user_role", "client")
    if user_role == "annotator":
        user.is_annotator = True
        user.is_client = False
    else:
        # Default to client
        user.is_client = True
        user.is_annotator = False

    logger.info(f"Creating user {user.email} with role: {user_role}")

    # Ensure user is active (they can login after email verification)
    user.is_active = True

    # Save user first to get the ID
    user.save()

    # Create AnnotatorProfile for annotator users
    if user_role == "annotator":
        from annotators.models import AnnotatorProfile
        profile, created = AnnotatorProfile.objects.get_or_create(
            user=user,
            defaults={
                "status": "pending_verification",
                "experience_level": "beginner",
            }
        )
        if created:
            profile.generate_verification_token()
            logger.info(f"Created AnnotatorProfile for {user.email}")

    # Check if user is signing up via invite token
    invite_token = request.GET.get("token")
    invited_org = None

    if invite_token:
        try:
            # Find the organization by invite token
            invited_org = Organization.objects.get(token=invite_token)
            logger.info(
                f"User {user.email} signing up with invite token for organization {invited_org.title}"
            )
        except Organization.DoesNotExist:
            logger.warning(
                f"Invalid invite token provided during signup: {invite_token}"
            )
            invited_org = None

    # Set initial status for annotators, skip organization for them
    if user.is_annotator:
        user.annotator_status = "pending_verification"
        user.save(update_fields=["annotator_status"])
        logger.info(f"Set annotator_status to pending_verification for {user.email}")
    else:
        # Create a personal organization for clients
        org_title = f"{user.email.split('@')[0]}'s Organization"
        personal_org = Organization.create_organization(
            created_by=user, title=org_title
        )

        # If user was invited to an organization, add them to it and set as active
        if invited_org:
            invited_org.add_user(user)
            user.active_organization = invited_org
            logger.info(
                f"Added user {user.email} to invited organization {invited_org.title}"
            )
        else:
            # Otherwise, set their personal organization as active
            user.active_organization = personal_org

        user.save(update_fields=["active_organization"])

    # Create email verification token and send email
    token = EmailVerificationToken.create_token(user)
    try:
        send_verification_email(user, token, request)
        logger.info(f"Email verification function called for {user.email}")
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
        import traceback

        logger.error(traceback.format_exc())

    request.advanced_json = {
        "email": user.email,
        "allow_newsletters": user.allow_newsletters,
        "update-notifications": 1,
        "new-user": 1,
        "how_find_us": user_form.cleaned_data.get("how_find_us", ""),
    }
    if user_form.cleaned_data.get("how_find_us", "") == "Other":
        request.advanced_json["elaborate"] = user_form.cleaned_data.get("elaborate", "")

    # Store success message in session
    from django.contrib import messages

    messages.success(
        request,
        f"Account created successfully! Please check your email ({user.email}) to verify your account before logging in.",
    )

    # Redirect to verification pending page (shows modal to check email)
    redirect_url = reverse("verification-pending")
    return redirect(redirect_url)


def proceed_registration(request, user_form, organization_form, next_page):
    """Register a new user for POST user_signup"""
    # save user to db
    save_user = load_func(settings.SAVE_USER)
    response = save_user(request, next_page, user_form)

    return response


def login(request, *args, **kwargs):
    request.session["last_login"] = time()
    result = auth.login(request, *args, **kwargs)
    return result

