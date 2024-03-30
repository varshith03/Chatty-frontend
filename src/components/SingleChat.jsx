import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic.js";
import ProfileModal from "./miscellaneous/ProfileModal.jsx";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel.jsx";
import axios from "axios";
import { apiURL } from "../constants/common.js";
import ScrollableChat from "./miscellaneous/ScrollableChat.jsx";
import { useTheme } from "@emotion/react";

const SingleChat = ({ refreshChats, setRefreshChats }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

  const { colorMode } = useColorMode();
  const theme = useTheme();
  const innerBoxColor =
    colorMode === "light" ? theme.colors.gray["100"] : theme.colors.gray["700"];

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get(
        `${apiURL}/api/message/${selectedChat._id}`,
        config
      );
      console.log(messages);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${apiURL}/api/message`,
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          config
        );
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

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
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Box>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg={innerBoxColor}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            mt={1}
          >
            {loading ? (
              <Spinner
                alignSelf={"center"}
                w={20}
                h={20}
                margin={"auto"}
                size={"xl"}
              ></Spinner>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                overflowY="scroll"
                scrollbarWidth="none"
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                // variant={"filled"}
                bg={"E0E0E0E"}
                placeholder="Enter a Message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          h={"100%"}
        >
          <Image
            src="/assets/start-chat-unscreen.gif"
            alt="Start Chat"
            boxSize="50%"
          ></Image>
          <Text fontSize={"x-large"}>Click on user to Start Chatting</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
