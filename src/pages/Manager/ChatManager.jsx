import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Check, Send } from 'lucide-react';
import { useManager } from '../../context/ManagerContext';

const ChatManager = () => {
  const { user } = useManager();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatWs, setChatWs] = useState(null);
  const [agentWs, setAgentWs] = useState(null);
  const chatBodyRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Authenticate as staff
    fetch('http://localhost:8001/api/chat/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'manager', is_staff: true })
    })
    .then(res => res.json())
    .then(data => {
      setToken(data.token);
      setUserId(data.user_id);
    });
  }, []);

  useEffect(() => {
    if (!token || !userId) return;

    // Fetch initial rooms
    fetch(`http://localhost:8001/api/chat/rooms/?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setRooms(data));

    // Connect to Agent WS for new rooms
    const socket = new WebSocket(`ws://localhost:8001/ws/agents/?token=${token}`);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'new_room') {
        // Refresh rooms list
        fetch(`http://localhost:8001/api/chat/rooms/?user_id=${userId}`)
          .then(res => res.json())
          .then(d => setRooms(d));
      }
    };
    setAgentWs(socket);

    return () => {
      socket.close();
    };
  }, [token, userId]);

  const selectRoom = (room) => {
    setActiveRoom(room);
    setMessages(room.messages.map(m => ({
      senderId: m.sender.id === userId ? 'me' : 'customer',
      senderName: m.sender.username,
      text: m.content
    })));

    if (chatWs) chatWs.close();

    const socket = new WebSocket(`ws://localhost:8001/ws/chat/${room.id}/?token=${token}`);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages(prev => [...prev, {
        senderId: data.sender_id === userId ? 'me' : 'customer',
        senderName: data.sender,
        text: data.message
      }]);
    };
    setChatWs(socket);
  };

  const pickUpRoom = async (roomId) => {
    await fetch(`http://localhost:8001/api/chat/rooms/${roomId}/pick_up/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    // Refresh rooms
    fetch(`http://localhost:8001/api/chat/rooms/?user_id=${userId}`)
      .then(res => res.json())
      .then(d => {
        setRooms(d);
        const updatedRoom = d.find(r => r.id === roomId);
        if (updatedRoom) selectRoom(updatedRoom);
      });
  };

  const closeRoom = async (roomId) => {
    await fetch(`http://localhost:8001/api/chat/rooms/${roomId}/close/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    // Refresh rooms
    fetch(`http://localhost:8001/api/chat/rooms/?user_id=${userId}`)
      .then(res => res.json())
      .then(d => {
        setRooms(d);
        if (activeRoom?.id === roomId) {
          if (chatWs) chatWs.close();
          setActiveRoom(null);
          setMessages([]);
        }
      });
  };

  const handleSend = () => {
    if (!input.trim() || !chatWs) return;
    chatWs.send(JSON.stringify({ message: input }));
    setInput('');
  };

  return (
    <div>
      <div className="manager-header">
        <h1>Live Support Chats</h1>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
        {/* Room List */}
        <div className="manager-card" style={{ width: '30%', overflowY: 'auto' }}>
          <h3>Active Requests</h3>
          {rooms.length === 0 && <p style={{ color: '#888' }}>No active chats.</p>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {rooms.map(r => (
              <li 
                key={r.id} 
                style={{ 
                  padding: '10px', 
                  borderBottom: '1px solid #eee', 
                  cursor: 'pointer',
                  background: activeRoom?.id === r.id ? '#f0f9ff' : 'transparent'
                }}
                onClick={() => r.status === 'picked_up' ? selectRoom(r) : null}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{r.customer.username}</strong>
                  <span style={{ fontSize: '0.8rem', color: r.status === 'open' ? '#f59e0b' : '#10b981' }}>
                    {r.status}
                  </span>
                </div>
                {r.status === 'open' && (
                  <button 
                    className="manager-btn" 
                    onClick={(e) => { e.stopPropagation(); pickUpRoom(r.id); }}
                    style={{ marginTop: '8px', width: '100%' }}
                  >
                    Pick Up
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="manager-card" style={{ width: '70%', display: 'flex', flexDirection: 'column', padding: 0 }}>
          {activeRoom ? (
            <>
              <div style={{ padding: '15px', borderBottom: '1px solid #eee', background: '#fafafa', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                <span>Chatting with {activeRoom.customer.username}</span>
                <button 
                  onClick={() => closeRoom(activeRoom.id)}
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  End Chat
                </button>
              </div>
              <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#fff' }} ref={chatBodyRef}>
                {messages.map((m, i) => (
                  <div key={i} style={{ 
                    marginBottom: '10px', 
                    textAlign: m.senderId === 'me' ? 'right' : 'left' 
                  }}>
                    <div style={{ 
                      display: 'inline-block', 
                      background: m.senderId === 'me' ? '#000' : '#f1f1f1', 
                      color: m.senderId === 'me' ? '#fff' : '#333',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      maxWidth: '80%',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}>
                      {m.senderId !== 'me' && <small style={{display:'block', fontSize:'0.7rem', color:'#888', marginBottom:'2px'}}>{m.senderName}</small>}
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Type a message..."
                  maxLength={100}
                />
                <button className="manager-btn" onClick={handleSend} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatManager;
