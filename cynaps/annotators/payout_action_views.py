from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import PayoutRequest
from .payment_service import PayoutService
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def manual_payout_success_view(request, payout_id):
    """
    Publicly accessible view to mark a payout as successful.
    GET: Returns a simple HTML form asking for the Transaction ID.
    POST: Processes the success form, updates DB, sends email, and returns a success page.
    """
    # payout_id could be an integer ID or a string transaction_id
    from django.db.models import Q
    if str(payout_id).isdigit():
        payout = get_object_or_404(PayoutRequest, Q(id=payout_id) | Q(transaction_id=payout_id))
    else:
        payout = get_object_or_404(PayoutRequest, transaction_id=payout_id)
    
    # If already processed
    if payout.status not in ["pending", "processing"]:
        return render(request, "emails/payout_action_result.html", {
            "title": "Already Processed",
            "message": f"This payout is already marked as {payout.status}.",
            "is_success": False
        })

    if request.method == "POST":
        transaction_id = request.POST.get("transaction_id", "").strip()
        if not transaction_id:
            return render(request, "emails/payout_action_form.html", {
                "payout": payout,
                "action": "success",
                "error": "Transaction ID is required."
            })

        # We need a system or admin user object for the 'approved_by' field.
        # Since this is an unauthenticated view originating from an admin email,
        # we can get the first superuser as a fallback.
        from django.contrib.auth import get_user_model
        User = get_user_model()
        admin_user = User.objects.filter(is_superuser=True).first()

        try:
            result = PayoutService.mark_payout_paid_manually(payout, admin_user, transaction_id)
            if result["success"]:
                return render(request, "emails/payout_action_result.html", {
                    "title": "Payout Marked as Paid!",
                    "message": f"Successfully recorded transaction ID '{transaction_id}' and notified the annotator.",
                    "is_success": True
                })
            else:
                return render(request, "emails/payout_action_form.html", {
                    "payout": payout,
                    "action": "success",
                    "error": result.get("error", "Failed to process.")
                })
        except Exception as e:
            logger.error(f"Manual success processing error: {e}")
            import traceback
            error_trace = traceback.format_exc()
            return render(request, "emails/payout_action_form.html", {
                "payout": payout,
                "action": "success",
                "error": f"Runtime Exception: {str(e)} | Trace: {error_trace}"
            })

    # GET request
    return render(request, "emails/payout_action_form.html", {
        "payout": payout,
        "action": "success"
    })

@csrf_exempt
def manual_payout_failed_view(request, payout_id):
    """
    Publicly accessible view to mark a payout as failed/rejected.
    GET: Returns a simple HTML form asking for the Rejection Reason.
    POST: Processes the failure form, updates DB, and returns a success page.
    """
    # payout_id could be an integer ID or a string transaction_id
    from django.db.models import Q
    if str(payout_id).isdigit():
        payout = get_object_or_404(PayoutRequest, Q(id=payout_id) | Q(transaction_id=payout_id))
    else:
        payout = get_object_or_404(PayoutRequest, transaction_id=payout_id)

    # If already processed
    if payout.status not in ["pending", "processing"]:
        return render(request, "emails/payout_action_result.html", {
            "title": "Already Processed",
            "message": f"This payout is already marked as {payout.status}.",
            "is_success": False
        })

    if request.method == "POST":
        rejection_reason = request.POST.get("rejection_reason", "").strip()
        if not rejection_reason:
            return render(request, "emails/payout_action_form.html", {
                "payout": payout,
                "action": "failed",
                "error": "A rejection reason is required."
            })

        from django.contrib.auth import get_user_model
        User = get_user_model()
        admin_user = User.objects.filter(is_superuser=True).first()

        try:
            payout.reject(admin_user, rejection_reason)
            return render(request, "emails/payout_action_result.html", {
                "title": "Payout Rejected",
                "message": f"The payout was rejected. The reason '{rejection_reason}' will be visible to the annotator.",
                "is_success": True
            })
        except Exception as e:
            logger.error(f"Manual reject processing error: {e}")
            return render(request, "emails/payout_action_form.html", {
                "payout": payout,
                "action": "failed",
                "error": str(e)
            })

    # GET request
    return render(request, "emails/payout_action_form.html", {
        "payout": payout,
        "action": "failed"
    })
