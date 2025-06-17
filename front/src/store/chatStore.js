import { create } from "zustand";
const useChatStore = create((set) => ({
  selectedChat: null,
  chats: [],
  isAuthenticated: !!localStorage.getItem("token"), // початкове значення

  setChats: (chatsUpdater) =>
    set((state) => ({
      chats:
        typeof chatsUpdater === "function"
          ? chatsUpdater(state.chats)
          : chatsUpdater,
    })),

  setSelectedChat: (chat) => set({ selectedChat: chat }),

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
}));

export default useChatStore;
