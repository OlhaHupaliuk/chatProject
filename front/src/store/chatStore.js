import { create } from "zustand";

const useChatStore = create((set) => ({
  selectedChat: null,
  chats: [],
  isAuthenticated: !!localStorage.getItem("token"),
  token: localStorage.getItem("token") || null,

  setChats: (chatsUpdater) =>
    set((state) => ({
      chats:
        typeof chatsUpdater === "function"
          ? chatsUpdater(state.chats)
          : chatsUpdater,
    })),

  setSelectedChat: (chat) => set({ selectedChat: chat }),

  login: (token) => {
    localStorage.setItem("token", token);
    set({ isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      isAuthenticated: false,
      token: null,
      chats: [],
      selectedChat: null,
    });
  },
}));

export default useChatStore;
