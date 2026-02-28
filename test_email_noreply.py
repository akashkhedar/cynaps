import os, sys, django
sys.path.append(r'f:\cynaps-develop\cynaps')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.mail import EmailMultiAlternatives, get_connection
from cynaps.core.settings.base import EMAIL_SENDERS

noreply_user = EMAIL_SENDERS.get('noreply', {}).get('user', '')
noreply_password = EMAIL_SENDERS.get('noreply', {}).get('password', '')

print(f"Connecting with User: {noreply_user}")

connection = get_connection(
    host='smtp.zoho.in',
    port=465,
    username=noreply_user,
    password=noreply_password,
    use_ssl=True,
    use_tls=False,
    fail_silently=False,
)

msg = EmailMultiAlternatives(
    "Test NoReply Auth",
    "Testing if noreply authentication succeeds",
    noreply_user,
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
