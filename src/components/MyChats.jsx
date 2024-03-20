import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import {
  Box,
  Button,
  Stack,
  Text,
  useColorMode,
  useTheme,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { apiURL } from "../constants/common";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./miscellaneous/ChatLoading";
import ChatSkelleton from "./miscellaneous/ChatSkelleton";
import { getSender } from "../config/ChatLogic.js";
import GroupModalView from "./miscellaneous/GroupModalView.jsx";

const MyChats = ({ refreshChats }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { user, selectedChat, setSelectedChat, chats, setChats } =
    useContext(ChatContext);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const theme = useTheme();

  // Determine background color and text color based on colorMode
  const bgColor =
    colorMode === "light" ? theme.colors.white : theme.colors.gray["800"];
  const textColor =
    colorMode === "light" ? theme.colors.black : theme.colors.white;

  // Function for fetching chats
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${apiURL}/api/chat`, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "Failed to Load Chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    fetchChats();
  }, [refreshChats]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      padding={3}
      backgroundColor={bgColor}
      width={{ base: "100%", md: "30%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        paddingBottom={3}
        paddingRight={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work Sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
      >
        My Chats
        <GroupModalView>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupModalView>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        // bg="#F8F8F8"
        backgroundColor={bgColor}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#FADA5E" : { bgColor }}
                _hover={{ bg: "lightgray", color: "black" }}
                color={textColor}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatSkelleton />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
