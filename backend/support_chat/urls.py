from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatRoomViewSet, get_mock_token

router = DefaultRouter()
router.register(r'rooms', ChatRoomViewSet, basename='chatroom')

urlpatterns = [
    path('token/', get_mock_token, name='get_token'),
    path('', include(router.urls)),
]
