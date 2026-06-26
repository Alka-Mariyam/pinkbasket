import asyncio
import websockets
import json
import urllib.request

async def test():
    req = urllib.request.Request("http://localhost:8001/api/chat/token/", data=b'{"username":"test_user", "is_staff":false}', headers={'Content-Type': 'application/json'})
    res = urllib.request.urlopen(req)
    data = json.loads(res.read())
    token = data['token']
    user_id = data['user_id']
    
    req_init = urllib.request.Request("http://localhost:8001/api/chat/rooms/initiate/", data=json.dumps({"user_id": user_id}).encode(), headers={'Content-Type': 'application/json'})
    res_init = urllib.request.urlopen(req_init)
    room_data = json.loads(res_init.read())
    room_id = room_data['id']
    print("Room ID:", room_id)
    
    async with websockets.connect(f"ws://localhost:8001/ws/chat/{room_id}/?token={token}") as ws:
        print("Connected to chat WS")
        await ws.send(json.dumps({"message": "Hello from python"}))
        response = await ws.recv()
        print("Received:", response)

asyncio.run(test())
