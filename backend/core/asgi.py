import os
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from urllib.parse import parse_qs

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope['query_string'].decode())
        token = query_string.get('token', [None])[0]

        if token:
            try:
                # Normally, verify JWT here. We'll decode using settings.SECRET_KEY
                # if you use SimpleJWT or similar.
                # Assuming the token payload contains 'user_id'
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                scope['user'] = await get_user(payload.get('user_id'))
            except jwt.ExpiredSignatureError:
                scope['user'] = AnonymousUser()
            except jwt.DecodeError:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)

django_asgi_app = get_asgi_application()

import support_chat.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(
            support_chat.routing.websocket_urlpatterns
        )
    ),
})
