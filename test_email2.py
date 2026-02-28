import os, sys, django
sys.path.append(r'f:\cynaps-develop\cynaps')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.mail import EmailMultiAlternatives, get_connection
from django.conf import settings
from cynaps.core.settings.base import EMAIL_SENDERS

support_user = EMAIL_SENDERS.get('support', {}).get('user', '')
support_password = EMAIL_SENDERS.get('support', {}).get('password', '')

print(f"Connecting with User: {support_user}")
print(f"Host: {settings.EMAIL_HOST}:{settings.EMAIL_PORT} (SSL: {settings.EMAIL_USE_SSL}, TLS: {settings.EMAIL_USE_TLS})")

connection = get_connection(
    host=settings.EMAIL_HOST,
    port=settings.EMAIL_PORT,
    username=support_user,
    password=support_password,
    use_ssl=settings.EMAIL_USE_SSL,
    use_tls=settings.EMAIL_USE_TLS,
    fail_silently=False,
)

msg = EmailMultiAlternatives(
    "Direct SMTP Test (SSL Fixed)",
    "Testing if the SSL connection is accepted",
    "support@cynaps.xyz",
    ["akashkhedar262@gmail.com"],
    connection=connection
)

try:
    msg.send(fail_silently=False)
    print("Email sent successfully!")
except Exception as e:
    import traceback
    print(f"SMTP Error: {e}")
    traceback.print_exc()
