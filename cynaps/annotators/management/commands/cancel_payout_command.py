from django.core.management.base import BaseCommand
from cynaps.annotators.models import PayoutRequest

class Command(BaseCommand):
    help = 'Cancels a specific payout request'

    def handle(self, *args, **options):
        try:
            payout = PayoutRequest.objects.get(transaction_id="CYN-PAY-1D4682C4")
            self.stdout.write(f"Found payout: ID={payout.id}, Status={payout.status}")
            payout.status = "failed"
            payout.failure_reason = "Cancelled by user request"
            payout.save(update_fields=["status", "failure_reason"])
            
            # Verify it saved
            payout.refresh_from_db()
            self.stdout.write(f"VERIFIED DB Status saved as: {payout.status}")
            self.stdout.write("Payout successfully marked as failed/cancelled!")
        except Exception as e:
            self.stderr.write(f"FATAL EXCEPTION: {e}")
