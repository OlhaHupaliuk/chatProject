import ChatHeader from './ChatHeader'
import Chat from './Chat'
import useChatStore from '../store/chatStore';
const ChatArea = () => {
    const { selectedChat, setChats } = useChatStore();
  return (
    <div className="chat-area col-7">
      <ChatHeader chat={selectedChat} />
      <Chat />
    </div>
  );
};

export default ChatArea;