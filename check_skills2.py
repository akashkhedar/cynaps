import os, sys, django
sys.path.append(r'f:\cynaps-develop\cynaps')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from annotators.models import ExpertiseCategory, ExpertiseSpecialization

cats = ExpertiseCategory.objects.all()
print("CATEGORIES:")
for c in cats:
    print(f"  {c.name} -> {c.slug} (Icon: {c.icon})")

specs = ExpertiseSpecialization.objects.all()
print("\nSPECIALTIES / SKILLS:")
for s in specs:
    print(f"  {s.name} -> {s.slug} (Category: {s.category.slug}) (Icon: {s.icon})")
