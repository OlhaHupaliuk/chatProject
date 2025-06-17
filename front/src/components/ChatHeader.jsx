import  '../styles/ChatArea.css'
import useChatStore from '../store/chatStore'
import { useState } from 'react'
import Modal from './Modal'
const ChatHeader = ({chat}) => {
  const { chats, setChats, token } = useChatStore()
  const [showModal, setShowModal] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const handleUpdateChat = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Введи ім’я та прізвище')
      return
    }
    try {
      console.log(chat._id)
      const res = await fetch(`http://localhost:5000/chats/${chat._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName }),
      })

      if (!res.ok) throw new Error('Failed to update chat')
      const newChat = await res.json()
      setChats((prev) => prev.map(c => c._id === newChat._id ? newChat : c));
      setFirstName('')
      setLastName('')
      setShowModal(false)
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <>
      <div className='chat__header'>
        <div className='chatHeader__photoName'>
          <img className='.chat-header__user avatar' 
          src="src/assets/woman-icon.svg" alt="" />
          <h2 className='chat-header__name mt-2'>
            {chat.firstName} {chat.lastName}</h2>
        </div>
        <button onClick={() => {
          setFirstName(chat.firstName);
          setLastName(chat.lastName);
          setShowModal(true);
        }}
        className='chat-header__settings'>
          <img src="src/assets/settings-icon.svg" 
          height={24} alt=""/>
        </button>
      </div>

      {showModal && (
        <Modal
          title="Update Chat"
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
          onSubmit={handleUpdateChat}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

export default ChatHeader