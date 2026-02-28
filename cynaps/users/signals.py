"""
Signals for the users app.
Automatically creates AnnotatorProfile for annotator users.
"""
import logging
from django.db.models.signals import post_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)


@receiver(post_save, sender='users.User')
def create_annotator_profile(sender, instance, created, **kwargs):
    """
    Automatically create an AnnotatorProfile when a user with is_annotator=True is saved.
    This ensures annotator profiles are always created regardless of the signup method.
    """
    # Only process if user is an annotator
    if not instance.is_annotator:
        return
    
    # Import here to avoid circular imports
    from annotators.models import AnnotatorProfile
    
    # Check if profile already exists
    if hasattr(instance, 'annotator_profile'):
        try:
            # Profile exists, just return
            _ = instance.annotator_profile
            return
        except AnnotatorProfile.DoesNotExist:
            pass
    
    # Create the profile
    try:
        profile, profile_created = AnnotatorProfile.objects.get_or_create(
            user=instance,
            defaults={
                "status": "pending_verification",
                "experience_level": "beginner",
                "email_verified": instance.email_verified if hasattr(instance, 'email_verified') else False,
            }
        )
        if profile_created:
            profile.generate_verification_token()
            logger.info(f"Auto-created AnnotatorProfile for user {instance.email}")
    except Exception as e:
        logger.error(f"Failed to auto-create AnnotatorProfile for {instance.email}: {e}")
