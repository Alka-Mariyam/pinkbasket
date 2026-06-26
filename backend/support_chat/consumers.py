import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import ChatRoom, ChatMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope['user']

        if self.user.is_anonymous:
            await self.close()
            return

        is_authorized = await self.is_authorized_for_room()
        if not is_authorized:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message', '')

        if not message:
            return

        saved_msg = await self.save_message(message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': saved_msg['content'],
                'sender': saved_msg['sender'],
                'sender_id': self.user.id,
                'timestamp': saved_msg['timestamp']
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'sender_id': event['sender_id'],
            'timestamp': event['timestamp']
        }))

    @database_sync_to_async
    def is_authorized_for_room(self):
        try:
            room = ChatRoom.objects.get(id=self.room_id)
            return True # Simplified access
        except ChatRoom.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, message):
        room = ChatRoom.objects.get(id=self.room_id)
        msg = ChatMessage.objects.create(room=room, sender=self.user, content=message)
        return {
            'content': msg.content,
            'sender': self.user.username,
            'timestamp': msg.timestamp.isoformat()
        }


class AgentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_anonymous:
            await self.close()
            return

        self.agent_group_name = 'agents_online'
        await self.channel_layer.group_add(
            self.agent_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.agent_group_name,
            self.channel_name
        )

    async def new_room_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_room',
            'room_id': event['room_id'],
            'customer': event['customer']
        }))
