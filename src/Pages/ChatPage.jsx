import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { ChatContext } from "../Context/ChatProvider";

const ChatPage = () => {
  const { user } = useContext(ChatContext);
  const [refreshChats, setRefreshChats] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      <SideDrawer></SideDrawer>
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="90vh"
        p="10px"
        gap={2}
      >
        {user && <MyChats refreshChats={refreshChats} />}
        {user && (
          <ChatBox
            refreshChats={refreshChats}
            setRefreshChats={setRefreshChats}
          />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
