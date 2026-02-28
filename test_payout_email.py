import os
import sys
import django
sys.path.append(r'f:\cynaps-develop\cynaps')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from annotators.models import AnnotatorProfile
from annotators.payment_service import PayoutService

p = AnnotatorProfile.objects.last()
print("Triggering payout...")
try:
    res = PayoutService.create_payout_request(p, 1, 'upi', 'http://localhost')
    print("Result:", res)
except Exception as e:
    print("FATAL ERROR:", e)
