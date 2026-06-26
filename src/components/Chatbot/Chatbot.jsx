import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import './Chatbot.css';

const Chatbot = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const chatBodyRef = useRef(null);
  
  const username = 'Customer_' + (user?.name || 'Guest_' + Math.floor(Math.random() * 1000));

  useEffect(() => {
    if (isOpen && !ws) {
      startChat();
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const startChat = async () => {
    setLoading(true);
    try {
      // 1. Get Token
      const tokenRes = await fetch('http://localhost:8001/api/chat/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, is_staff: false })
      });
      const tokenData = await tokenRes.json();
      const token = tokenData.token;
      const userId = tokenData.user_id;

      // 2. Initiate Room
      const roomRes = await fetch('http://localhost:8001/api/chat/rooms/initiate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const roomData = await roomRes.json();
      const currentRoomId = roomData.id;
      setRoomId(currentRoomId);

      // Load existing messages
      if (roomData.messages) {
        setMessages(roomData.messages.map(m => ({
          senderId: m.sender.id === userId ? 'me' : 'agent',
          senderName: m.sender.username,
          text: m.content
        })));
      } else {
        setMessages([{ senderId: 'agent', senderName: 'System', text: 'Connecting you to an agent...' }]);
      }

      // 3. Connect Websocket
      const socket = new WebSocket(`ws://localhost:8001/ws/chat/${currentRoomId}/?token=${token}`);
      
      socket.onopen = () => {
        setWs(socket);
        setLoading(false);
      };

      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setMessages(prev => [...prev, {
          senderId: data.sender_id === userId ? 'me' : 'agent',
          senderName: data.sender,
          text: data.message
        }]);
      };

      socket.onclose = () => {
        setWs(null);
      };

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !ws) return;
    ws.send(JSON.stringify({ message: input }));
    setInput('');
  };

  const endChat = async () => {
    if (!roomId) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:8001/api/chat/rooms/${roomId}/close/`, {
        method: 'POST'
      });
      if (ws) ws.close();
      setWs(null);
      setRoomId(null);
      setMessages([]);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="chatbot-wrapper">
      <button className="chatbot-toggle btn-primary" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-window card animate-fade-in">
          <div className="chatbot-header" style={{ background: '#000', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Customer Support</h3>
            {roomId && (
              <button 
                onClick={endChat} 
                style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
                disabled={loading}
              >
                End Chat
              </button>
            )}
          </div>
          <div className="chatbot-body" ref={chatBodyRef}>
            {loading && <p style={{textAlign: 'center', color: '#888'}}>Connecting to agent...</p>}
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.senderId === 'me' ? 'user' : 'ai'}`}>
                {m.senderId !== 'me' && <small style={{display:'block', fontSize:'0.7rem', color:'#888', marginBottom:'2px'}}>{m.senderName}</small>}
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <div className="chatbot-footer">
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={!ws || loading}
              maxLength={100}
            />
            <button onClick={handleSend} disabled={!ws || loading}><Send size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
