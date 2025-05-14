import { useState, useEffect } from 'react';
import useChatStore from '../store/chatStore';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { selectedChat, setChats } = useChatStore();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);

      // Join the chat room
      socket.emit("joinChat", selectedChat._id);

      // Listen for new messages
      const handleMessageAdded = (updatedChat) => {
        if (updatedChat._id === selectedChat._id) {
          setMessages(updatedChat.messages);
          setChats((chats) =>
            chats.map((c) =>
              c._id === updatedChat._id ? updatedChat : c
            )
          );
        }
      };

      socket.on("messageAdded", handleMessageAdded);

      return () => {
        socket.off("messageAdded", handleMessageAdded);
      };
    }
  }, [selectedChat, setChats]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/chats/${selectedChat._id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newMsg }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setNewMsg('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className='chat'>
      <div className="chat-area__messages">
        {messages.map((msg, i) => (
          <div
            className={msg.sender !== 'user' ? 'userMsg msg' : 'msg'}
            key={i}
          >
            {msg.text}
            <p className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
      <div className="chat-area__input-section">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="chat-area__input"
          type="text"
          placeholder="Type your message"
        />
        <button onClick={sendMessage} className="chat-area__send-button">
          <img src="src/assets/send-icon.svg" alt="Send" />
        </button>
      </div>
    </div>
  );
};

export default Chat;