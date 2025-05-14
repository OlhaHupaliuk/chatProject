import { useEffect } from 'react'
import useChatStore from '../store/chatStore'
import ChatItem from './ChatItem'

const ChatList = () => {
  const { chats, setChats } = useChatStore()
  const token = localStorage.getItem('token')
  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/chats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch chats');
          return res.json();
        })
        .then((data) => setChats(data))
        .catch((error) => console.error('Error fetching chats:', error));
    }
  }, [token, setChats]); // Залежності: token і setChats
  return (
    <div className="chat-list col-12">
      <div className='d-flex justify-content-between px-3 py-2'>
        <h2 className='chat-list__title pt-3'>Chats</h2>
        <button className='addBtn'><img src="src/assets/add-icon.svg" height={20} alt="" /></button>
      </div>
      {chats.map(chat => (
        <ChatItem key={chat._id} chat={chat} />
      ))}
    </div>
  )
}
export default ChatList
