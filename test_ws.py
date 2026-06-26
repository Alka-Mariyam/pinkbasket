import asyncio
import websockets
import json
import urllib.request

async def test():
    req = urllib.request.Request("http://localhost:8001/api/chat/token/", data=b'{"username":"test_agent", "is_staff":true}', headers={'Content-Type': 'application/json'})
    res = urllib.request.urlopen(req)
    data = json.loads(res.read())
    token = data['token']
    
    async with websockets.connect(f"ws://localhost:8001/ws/agents/?token={token}") as ws:
        print("Connected to agents WS")
        await ws.close()

asyncio.run(test())
