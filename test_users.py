import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
for u in User.objects.all():
    print(u.id, u.username, u.is_staff)
