from django.core.management.base import BaseCommand
from cynaps.annotators.models import AnnotatorProfile
from cynaps.annotators.payment_service import PayoutService

class Command(BaseCommand):
    help = 'Tests the payout email'

    def handle(self, *args, **options):
        p = AnnotatorProfile.objects.last()
        self.stdout.write("Triggering payout testing for id: " + str(p.id))
        try:
            res = PayoutService.create_payout_request(p, 1, 'upi', 'http://localhost:8080')
            self.stdout.write("Result: " + str(res))
        except Exception as e:
            self.stderr.write("FATAL EXCEPTION: " + str(e))
