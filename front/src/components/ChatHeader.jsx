
import  '../styles/ChatArea.css'
const ChatHeader = ({chat}) => {
  if (!chat) {
    return <div></div>;
  }
  return (
    <div className='chat__header'>
      <div className='chatHeader__photoName'>
        <img className='.chat-header__user avatar' 
        src="src/assets/woman-icon.svg" alt="" />
        <h2 className='chat-header__name mt-2'>{chat.firstName} {chat.lastName}</h2>
      </div>
      <button className='chat-header__settings'>
        <img src="src/assets/settings-icon.svg" 
        height={24} alt=""/>
        </button>
  </div>
  )
}

export default ChatHeader