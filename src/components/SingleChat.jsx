import React, { useContext } from "react";
import { ChatContext } from "../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic.js";
import ProfileModal from "./miscellaneous/ProfileModal.jsx";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel.jsx";

const SingleChat = ({ refreshChats, setRefreshChats }) => {
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            w="100%"
            fontFamily="Work sans"
            fontSize={{ base: "28px", md: "30px" }}
            px={2}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  refreshChats={refreshChats}
                  setRefreshChats={setRefreshChats}
                  // fetchMessages = {fetchMessages}
                />
              </>
            )}
          </Box>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            mesagah
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h={"100%"}
        >
          <Text fontSize={"x-large"}>Click on user to Start Chatting</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
