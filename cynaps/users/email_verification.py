"""Email verification utilities"""
import logging
from django.conf import settings
from django.core.mail import send_mail, get_connection
from django.template.loader import render_to_string
from django.urls import reverse

logger = logging.getLogger(__name__)


def get_contextual_connection(sender_type='noreply'):
    """
    Get an email connection for a specific sender type (noreply, support, founder)
    """
    sender_config = settings.EMAIL_SENDERS.get(sender_type, settings.EMAIL_SENDERS['noreply'])
    
    return get_connection(
        backend=settings.EMAIL_BACKEND,
        host=settings.EMAIL_HOST,
        port=settings.EMAIL_PORT,
        username=sender_config['user'],
        password=sender_config['password'],
        use_tls=settings.EMAIL_USE_TLS,
        use_ssl=settings.EMAIL_USE_SSL,
        timeout=settings.EMAIL_TIMEOUT,
    )


def send_contextual_mail(subject, message, recipient_list, html_message=None, sender_type='noreply'):
    """
    Send email using a specific sender account
    """
    sender_config = settings.EMAIL_SENDERS.get(sender_type, settings.EMAIL_SENDERS['noreply'])
    from_email = f"Cynaps <{sender_config['from']}>"
    
    connection = get_contextual_connection(sender_type)
    
    return send_mail(
        subject=subject,
        message=message,
        from_email=from_email,
        recipient_list=recipient_list,
        html_message=html_message,
        connection=connection,
        fail_silently=False,
    )


def send_verification_email(user, token, request=None):
    """
    Send email verification link to user
    
    Args:
        user: User instance
        token: EmailVerificationToken instance
        request: HttpRequest instance (optional, for building absolute URL)
    """
    try:
        print(f"\n{'='*80}")
        print(f"SENDING VERIFICATION EMAIL TO: {user.email}")
        print(f"{'='*80}\n")
        
        # Build verification URL
        verification_path = reverse('verify-email', kwargs={'token': token.token})
        
        if request:
            verification_url = request.build_absolute_uri(verification_path)
        else:
            # Fallback to settings.HOSTNAME
            hostname = settings.HOSTNAME.rstrip('/')
            verification_url = f"{hostname}{verification_path}"
        
        # Email context
        context = {
            'user': user,
            'verification_url': verification_url,
            'expiry_hours': 24,
            'site_name': 'Cynaps',
        }
        
        # Render email templates
        subject = 'Verify your email address - Cynaps'
        html_message = render_to_string('users/emails/verify_email.html', context)
        text_message = render_to_string('users/emails/verify_email.txt', context)
        
        # Send email
        print(f"Email Backend: {settings.EMAIL_BACKEND}")
        print(f"From Email: {settings.DEFAULT_FROM_EMAIL}")
        print(f"To Email: {user.email}")
        print(f"Verification URL: {verification_url}\n")
        
        logger.info(f"Attempting to send verification email to {user.email} using noreply")
        
        return send_contextual_mail(
            subject=subject,
            message=text_message,
            recipient_list=[user.email],
            html_message=html_message,
            sender_type='noreply'
        )
        
        print(f"✓ Email sent successfully to {user.email}\n")
        logger.info(f"Verification email sent to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {e}")
        return False


def resend_verification_email(user, request=None):
    """
    Resend verification email to user
    
    Args:
        user: User instance
        request: HttpRequest instance (optional)
    
    Returns:
        bool: True if email was sent successfully
    """
    from users.models_verification import EmailVerificationToken
    
    # Invalidate old tokens
    EmailVerificationToken.objects.filter(
        user=user,
        is_used=False
    ).update(is_used=True)
    
    # Create new token
    token = EmailVerificationToken.create_token(user)
    
    # Send email
    return send_verification_email(user, token, request)


def send_password_reset_email(user, token, request=None):
    """
    Send password reset link to user
    
    Args:
        user: User instance
        token: PasswordResetToken instance
        request: HttpRequest instance (optional)
    """
    try:
        # Build reset URL
        reset_path = reverse('password-reset-confirm', kwargs={'token': token.token})
        
        if request:
            reset_url = request.build_absolute_uri(reset_path)
        else:
            hostname = settings.HOSTNAME.rstrip('/')
            reset_url = f"{hostname}{reset_path}"
        
        # Email context
        context = {
            'user': user,
            'reset_url': reset_url,
            'expiry_hours': 24,
            'site_name': 'Cynaps',
        }
        
        # Render email templates
        subject = 'Reset your password - Cynaps'
        html_message = render_to_string('users/emails/reset_password.html', context)
        text_message = render_to_string('users/emails/reset_password.txt', context)
        
        logger.info(f"Attempting to send password reset email to {user.email} using noreply")
        
        return send_contextual_mail(
            subject=subject,
            message=text_message,
            recipient_list=[user.email],
            html_message=html_message,
            sender_type='noreply'
        )
        
        logger.info(f"Password reset email sent to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send password reset email to {user.email}: {e}")
        return False


def send_welcome_email(user, request=None):
    """
    Send welcome email from the founder
    """
    try:
        context = {
            'user': user,
            'site_name': 'Cynaps',
        }
        
        subject = 'Welcome to Cynaps - A message from the founder'
        html_message = render_to_string('users/emails/welcome_founder.html', context)
        text_message = render_to_string('users/emails/welcome_founder.txt', context)
        
        logger.info(f"Attempting to send welcome email to {user.email} from founder")
        
        return send_contextual_mail(
            subject=subject,
            message=text_message,
            recipient_list=[user.email],
            html_message=html_message,
            sender_type='founder'
        )
    except Exception as e:
        logger.error(f"Failed to send welcome email to {user.email}: {e}")
        return False


def send_support_email(user, subject, message):
    """
    Send support email to user or about user
    """
    try:
        logger.info(f"Attempting to send support email for {user.email} using support")
        
        return send_contextual_mail(
            subject=subject,
            message=message,
            recipient_list=[user.email],
            sender_type='support'
        )
    except Exception as e:
        logger.error(f"Failed to send support email to {user.email}: {e}")
        return False





