import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cynaps.core.settings.cynaps')
django.setup()

from billing.models import SubscriptionPlan, CreditPackage
from decimal import Decimal

print("Setting up subscription plans...")
print("=" * 70)

# Define all plans
PLANS = [
    {
        "name": "Starter Monthly",
        "plan_type": "starter",
        "billing_cycle": "monthly",
        "price_inr": Decimal("19999"),
        "credits_per_month": 16000,
        "effective_rate": Decimal("1.25"),
        "storage_gb": 10,
        "extra_storage_rate_per_gb": Decimal("25"),
        "storage_discount_percent": Decimal("0.00"),
        "max_projects": 0,
        "annotation_discount_percent": Decimal("0.00"),
        "renewal_discount_percent": Decimal("0.00"),
        "max_users": None,
        "priority_support": True,
        "api_access": True,
        "credit_rollover": True,
        "max_rollover_months": 12,
        "annual_bonus_months": 0,
        "annual_bonus_credits": 0,
        "description": "Starter Monthly Plan",
        "features_json": [],
    },
    {
        "name": "Growth Monthly",
        "plan_type": "growth",
        "billing_cycle": "monthly",
        "price_inr": Decimal("49999"),
        "credits_per_month": 43000,
        "effective_rate": Decimal("1.16"),
        "storage_gb": 25,
        "extra_storage_rate_per_gb": Decimal("19"),
        "storage_discount_percent": Decimal("0.00"),
        "max_projects": 0,
        "annotation_discount_percent": Decimal("0.00"),
        "renewal_discount_percent": Decimal("0.00"),
        "max_users": None,
        "priority_support": True,
        "api_access": True,
        "credit_rollover": True,
        "max_rollover_months": 12,
        "annual_bonus_months": 0,
        "annual_bonus_credits": 0,
        "description": "Growth Monthly Plan",
        "features_json": [],
    },
    {
        "name": "Scale Monthly",
        "plan_type": "scale",
        "billing_cycle": "monthly",
        "price_inr": Decimal("79999"),
        "credits_per_month": 79999,
        "effective_rate": Decimal("1.00"),
        "storage_gb": 50,
        "extra_storage_rate_per_gb": Decimal("14"),
        "storage_discount_percent": Decimal("0.00"),
        "max_projects": 0,
        "annotation_discount_percent": Decimal("0.00"),
        "renewal_discount_percent": Decimal("0.00"),
        "max_users": None,
        "priority_support": True,
        "api_access": True,
        "credit_rollover": True,
        "max_rollover_months": 12,
        "annual_bonus_months": 0,
        "annual_bonus_credits": 0,
        "description": "Scale Monthly Plan",
        "features_json": [],
    },
    {
        "name": "Starter Annual",
        "plan_type": "starter",
        "billing_cycle": "annual",
        "price_inr": Decimal("199990"),
        "credits_per_month": 18000,
        "effective_rate": Decimal("0.93"),
        "storage_gb": 10,
        "extra_storage_rate_per_gb": Decimal("25"),
        "storage_discount_percent": Decimal("0.00"),
        "max_projects": 0,
        "annotation_discount_percent": Decimal("0.00"),
        "renewal_discount_percent": Decimal("0.00"),
        "max_users": None,
        "priority_support": True,
        "api_access": True,
        "credit_rollover": True,
        "max_rollover_months": 12,
        "annual_bonus_months": 0,
        "annual_bonus_credits": 0,
        "description": "Starter Annual Plan",
        "features_json": [],
    },
    {
        "name": "Growth Annual",
        "plan_type": "growth",
        "billing_cycle": "annual",
        "price_inr": Decimal("499990"),
        "credits_per_month": 45000,
        "effective_rate": Decimal("0.93"),
        "storage_gb": 25,
        "extra_storage_rate_per_gb": Decimal("19"),
        "storage_discount_percent": Decimal("0.00"),
        "max_projects": 0,
        "annotation_discount_percent": Decimal("0.00"),
        "renewal_discount_percent": Decimal("0.00"),
        "max_users": None,
        "priority_support": True,
        "api_access": True,
        "credit_rollover": True,
        "max_rollover_months": 12,
        "annual_bonus_months": 0,
        "annual_bonus_credits": 0,
        "description": "Growth Annual Plan",
        "features_json": [],
    },
    {
        "name": "Scale Annual",
        "plan_type": "scale",
        "billing_cycle": "annual",
        "price_inr": Decimal("799990"),
        "credits_per_month": 81000,
        "effective_rate": Decimal("0.82"),
        "storage_gb": 50,
        "extra_storage_rate_per_gb": Decimal("14"),
        "storage_discount_percent": Decimal("0.00"),
        "max_projects": 0,
        "annotation_discount_percent": Decimal("0.00"),
        "renewal_discount_percent": Decimal("0.00"),
        "max_users": None,
        "priority_support": True,
        "api_access": True,
        "credit_rollover": True,
        "max_rollover_months": 12,
        "annual_bonus_months": 0,
        "annual_bonus_credits": 0,
        "description": "Scale Annual Plan",
        "features_json": [],
    },
]

# Create or update plans
for plan_data in PLANS:
    plan_name = plan_data["name"]
    defaults = plan_data.copy()
    plan, created = SubscriptionPlan.objects.update_or_create(
        name=plan_name,
        defaults=defaults
    )
    status = "Created" if created else "Updated"
    print(f"{status}: {plan.name} at {plan.price_inr} INR")


print("Setting up credit packages...")
PACKAGES = [
    {
        "name": 'Explorer Package',
        "credits": 5000,
        "price_inr": Decimal("8750"),
        "rate_per_credit": Decimal("1.75"),
        "is_active": True,
    },
    {
        "name": 'Professional Package',
        "credits": 25000,
        "price_inr": Decimal("37500"),
        "rate_per_credit": Decimal("1.50"),
        "is_active": True,
    },
    {
        "name": 'Team Package',
        "credits": 100000,
        "price_inr": Decimal("135000"),
        "rate_per_credit": Decimal("1.35"),
        "is_active": True,
    },
    {
        "name": 'Enterprise PAYG',
        "credits": 500000,
        "price_inr": Decimal("650000"),
        "rate_per_credit": Decimal("1.30"),
        "is_active": True,
    },
]

for package_data in PACKAGES:
    pkg_name = package_data.pop("name")
    package, created = CreditPackage.objects.update_or_create(
        name=pkg_name,
        defaults=package_data
    )
    status = "Created" if created else "Updated"
    print(f"{status}: {package.name} at {package.price_inr} INR")


print("=" * 70)
print("Setup Complete!")
print(f"Total plans: {SubscriptionPlan.objects.count()}")
print(f"Total packages: {CreditPackage.objects.count()}")