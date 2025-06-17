import ChatHeader from './ChatHeader'
import Chat from './Chat'
import useChatStore from '../store/chatStore';
const ChatArea = () => {
    const { selectedChat } = useChatStore();
  return (
    <div className="chat-area col-7">
      {selectedChat && <ChatHeader chat={selectedChat} />}
      <Chat />
    </div>
  );
};

export default ChatArea;