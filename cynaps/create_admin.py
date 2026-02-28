import os
import sys
import django

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.cynaps')

try:
    django.setup()
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

from django.contrib.auth import get_user_model
User = get_user_model()

email = 'singhdhruva45@gmail.com'
password = 'singhdhruva45@gmail.com'

try:
    user = User.objects.get(email=email)
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f'SUCCESS: Updated existing user: {email}')
except User.DoesNotExist:
    try:
        user = User.objects.create_superuser(email=email, password=password)
        print(f'SUCCESS: Created new superuser: {email}')
    except Exception as e:
        print(f"FAILED to create user using email only: {e}")
        try:
            print("Trying with username parameter...")
            user = User.objects.create_superuser(username=email, email=email, password=password)
            print(f'SUCCESS: Created new superuser (with username): {email}')
        except Exception as e2:
            print(f"FAILED completely: {e2}")
