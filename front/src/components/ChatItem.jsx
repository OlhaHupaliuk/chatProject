import useChatStore from '../store/chatStore'
import '../styles/chatItem.css'
import womanIcon from '../assets/woman-icon.svg';
const ChatItem = ({chat}) => {
    const { setSelectedChat } = useChatStore()
    const { firstName, lastName, messages } = chat;
    const lastMsg = messages.length ? messages[messages.length - 1] : null;
    const formattedDate = lastMsg ? new Date(lastMsg.timestamp).toLocaleDateString() : '';

  return (
    <div className='chatItem' onClick={() => setSelectedChat(chat)}>
    <img className='img' src={womanIcon} alt="chat" />  
        <div className='chatItem__block col-9'>
            <h2 className='chatItem__title mt-3'>{firstName} {lastName}</h2>
            <p className='chatItem__msg'>{lastMsg?.text}</p>
        </div>
        <p className='chatItem__date'>{formattedDate}</p>
    </div>
  )
}
export default ChatItem