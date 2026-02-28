from annotators.models import ExpertiseCategory, ExpertiseSpecialization

print("== CATEGORIES ==")
for c in ExpertiseCategory.objects.all().order_by('id'):
    print(f"ID: {c.id} | Name: {c.name} | Slug: {c.slug} | Icon: {c.icon}")

print("\n== SPECIALTIES / SKILLS ==")
for s in ExpertiseSpecialization.objects.select_related('category').all().order_by('category_id', 'id'):
    print(f"ID: {s.id} | Name: {s.name} | Slug: {s.slug} | Icon: {s.icon} | Parent: {s.category.slug}")
