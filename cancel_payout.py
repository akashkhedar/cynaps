import os
import sys

# Add the project root to the python path
sys.path.append(r'f:\cynaps-develop')

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cynaps.core.settings')

import django
django.setup()

from cynaps.annotators.models import PayoutRequest

try:
    payout = PayoutRequest.objects.get(transaction_id="CYN-PAY-1D4682C4")
    print(f"Found payout: ID={payout.id}, Status={payout.status}")
    payout.status = "cancelled"
    payout.save(update_fields=["status"])
    print("Payout successfully marked as cancelled!")
except PayoutRequest.DoesNotExist:
    print("Error: Payout not found with transaction ID CYN-PAY-1D4682C4")
except Exception as e:
    print(f"Error: {e}")
