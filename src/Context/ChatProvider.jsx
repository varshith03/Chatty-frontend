import { createContext, useEffect, useState } from "react";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userInfo")) || null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  return (
    <ChatContext.Provider value={{ user, setUser,selectedChat, setSelectedChat,chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};


export default ChatProvider;
