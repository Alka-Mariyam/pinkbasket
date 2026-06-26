from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import ChatRoom
from .serializers import ChatRoomSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def get_mock_token(request):
    username = request.data.get('username')
    is_staff = request.data.get('is_staff', False)
    if not username:
        return Response({'error': 'Username required'}, status=400)
    
    user, created = User.objects.get_or_create(username=username, defaults={'is_staff': is_staff})
    if is_staff and not user.is_staff:
        user.is_staff = True
        user.save()
        
    token = jwt.encode({'user_id': user.id}, settings.SECRET_KEY, algorithm='HS256')
    return Response({'token': token, 'user_id': user.id})

class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [AllowAny]
    queryset = ChatRoom.objects.all()

    def get_queryset(self):
        if self.action in ['pick_up', 'close']:
            return ChatRoom.objects.all()
            
        user_id = self.request.query_params.get('user_id')
        if not user_id:
            return ChatRoom.objects.none()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return ChatRoom.objects.none()

        if user.is_staff:
            return ChatRoom.objects.filter(status__in=['open', 'picked_up']).order_by('-created_at')
        return ChatRoom.objects.filter(customer=user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def initiate(self, request):
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Invalid user'}, status=400)

        room = ChatRoom.objects.filter(customer=user, status__in=['open', 'picked_up']).first()
        
        if not room:
            room = ChatRoom.objects.create(customer=user)
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                'agents_online',
                {
                    'type': 'new_room_notification',
                    'room_id': room.id,
                    'customer': user.username
                }
            )

        serializer = self.get_serializer(room)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def pick_up(self, request, pk=None):
        user_id = request.data.get('user_id')
        try:
            agent = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Invalid user'}, status=400)

        room = self.get_object()
        if room.status == 'open':
            room.agent = agent
            room.status = 'picked_up'
            room.save()
            return Response({'status': 'room picked up'})
        return Response({'error': 'Room is not open'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        room = self.get_object()
        if room.status != 'closed':
            room.status = 'closed'
            room.closed_at = timezone.now()
            room.save()
            return Response({'status': 'room closed'})
        return Response({'error': 'Room is already closed'}, status=status.HTTP_400_BAD_REQUEST)
