import { useEffect, useState } from 'react'
import useChatStore from '../store/chatStore'
import ChatItem from './ChatItem'
import Modal from './Modal'
const ChatList = () => {
  const { chats, setChats, isAuthenticated, token } = useChatStore()
  const [showModal, setShowModal] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
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
  }, [token, isAuthenticated]);

  const handleAddChat = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Введи ім’я та прізвище')
      return
    }
    try {
      const res = await fetch('http://localhost:5000/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName }),
      })

      if (!res.ok) throw new Error('Failed to create chat')
      const newChat = await res.json()
      setChats((prevChats) => [...prevChats, newChat]);
      setFirstName('')
      setLastName('')
      setShowModal(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="chat-list col-12">
      <div className='d-flex justify-content-between px-3 py-2'>
        <h2 className='chat-list__title pt-3'>Chats</h2>
        <button className='addBtn' onClick={() => setShowModal(true)}>
          <img src="src/assets/add-icon.svg" height={20} alt="" />
        </button>
      </div>

      {chats.map(chat => (
        <ChatItem key={chat._id} chat={chat} />
      ))}

      {showModal && (
        <Modal
          title="New Chat"
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
          onSubmit={handleAddChat}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default ChatList
