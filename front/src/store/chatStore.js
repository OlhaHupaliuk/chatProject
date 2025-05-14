import { create } from "zustand";
const useChatStore = create((set) => ({
  selectedChat: null,
  chats: [],
  setChats: (chatsUpdater) =>
    set((state) => ({
      chats:
        typeof chatsUpdater === "function"
          ? chatsUpdater(state.chats)
          : chatsUpdater,
    })),
  setSelectedChat: (chat) => set({ selectedChat: chat }),
}));

export default useChatStore;
