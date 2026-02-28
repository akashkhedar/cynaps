import os
import sys
import django

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.cynaps')

try:
    django.setup()
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

from django.core.mail import send_mail
from django.conf import settings

recipient = 'singhdhruva45@gmail.com'

try:
    print(f"Testing email configuration...")
    print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
    print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"EMAIL_USE_SSL: {settings.EMAIL_USE_SSL}")
    print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
    print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
    
    send_mail(
        subject='Cynaps Local Dev - Test Email',
        message='This is a test email sent from your local Cynaps development environment to verify that the Zoho SMTP configuration is working correctly.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[recipient],
        fail_silently=False,
    )
    print(f"\nSUCCESS! Test email sent to {recipient}")
except Exception as e:
    print(f"\nFAILED to send email: {e}")
