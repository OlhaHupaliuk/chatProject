import { useEffect, useState } from 'react'
import useChatStore from '../store/chatStore'
import ChatItem from './ChatItem'

const ChatList = () => {
  const { chats, setChats } = useChatStore()
  const token = localStorage.getItem('token')
  const [showModal, setShowModal] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

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
  }, [token, setChats]);

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
      setChats([...chats, newChat])
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
        <div className="modal-backdrop">
          <div className="modal-content p-4 bg-white rounded shadow">
            <h5>New Chat</h5>
            <input
              className="form-control my-2"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="form-control my-2"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddChat}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatList
