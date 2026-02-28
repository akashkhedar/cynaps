"""Password reset views"""
import logging
from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.contrib.auth import update_session_auth_hash

from users.models import User
from users.models_verification import PasswordResetToken
from users.email_verification import send_password_reset_email

logger = logging.getLogger(__name__)

@require_http_methods(["GET", "POST"])
def forgot_password(request):
    """
    Handle forgot password request
    URL: /forgot-password/
    """
    if request.method == "POST":
        email = request.POST.get("email", "").strip().lower()
        
        if not email:
            messages.error(request, "Please provide your email address.")
            return render(request, "users/forgot_password.html")
            
        try:
            user = User.objects.get(email=email)
            
            # Invalidate old tokens
            PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)
            
            # Create new token
            token = PasswordResetToken.create_token(user)
            
            # Send email
            if send_password_reset_email(user, token, request):
                messages.success(request, "Password reset link has been sent to your email.")
            else:
                messages.error(request, "Failed to send password reset email. Please try again later.")
                
        except User.DoesNotExist:
            # Don't reveal if user exists for security
            messages.success(request, "If an account exists with this email, a password reset link will be sent.")
            logger.warning(f"Password reset attempted for non-existent email: {email}")
            
        return render(request, "users/forgot_password.html")

    return render(request, "users/forgot_password.html")

@require_http_methods(["GET", "POST"])
def password_reset_confirm(request, token):
    """
    Confirm password reset and set new password
    URL: /password-reset-confirm/<token>/
    """
    reset_token = get_object_or_404(PasswordResetToken, token=token)
    
    if not reset_token.is_valid():
        messages.error(request, "This password reset link is invalid or has expired.")
        return redirect("user-login")
        
    if request.method == "POST":
        password = request.POST.get("password")
        password_confirm = request.POST.get("password_confirm")
        
        if not password or len(password) < 8:
            messages.error(request, "Password must be at least 8 characters long.")
            return render(request, "users/password_reset_confirm.html", {"token": token})
            
        if password != password_confirm:
            messages.error(request, "Passwords do not match.")
            return render(request, "users/password_reset_confirm.html", {"token": token})
            
        # Set new password
        user = reset_token.user
        user.set_password(password)
        user.save()
        
        # Mark token as used
        reset_token.mark_as_used()
        
        messages.success(request, "Your password has been reset successfully. Please log in with your new password.")
        return redirect("user-login")
        
    return render(request, "users/password_reset_confirm.html", {"token": token})
