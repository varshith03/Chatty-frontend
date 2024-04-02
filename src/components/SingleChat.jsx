import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import {
  Box,
  Flex,
  FormControl,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic.js";
import ProfileModal from "./miscellaneous/ProfileModal.jsx";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel.jsx";
import axios from "axios";
import { apiURL } from "../constants/common.js";
import ScrollableChat from "./miscellaneous/ScrollableChat.jsx";
import { useTheme } from "@emotion/react";
import io from "socket.io-client";
import ImagePreviewModal from "./miscellaneous/ImagePreviewModal.jsx";
import { uploadFileToCloudinary } from "../config/uploadFile.js";
const ENDPOINT = import.meta.env.VITE_APP_ENDPOINT;
var socket, selectedChatCompare;

const SingleChat = ({ refreshChats, setRefreshChats }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [file, setFile] = useState();
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useContext(ChatContext);

  const toast = useToast();

  const { colorMode } = useColorMode();
  const theme = useTheme();

  const innerBoxColor =
    colorMode === "light" ? theme.colors.gray["100"] : theme.colors.gray["700"];
  const iconColor = colorMode === "light" ? "#000000" : "#FFD43B";

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.emit("setup", user);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    console.log(selectedChat);
  }, [selectedChat]);

  // console.log("notitiit--", notification);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        selectedChatCompare &&
        newMessageReceived.chat._id == selectedChatCompare._id
      ) {
        setMessages([...messages, newMessageReceived]);
      } else {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setRefreshChats(!refreshChats);
        }
      }
    });

    // return () => {
    //   socket.off("message received");
    // };
  });

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
      // console.log(messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
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

  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
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
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const uploadImage = async () => {
    if (!uploadedFileUrl) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post(
        `${apiURL}/api/message/upload-image`,
        {
          chatId: selectedChat._id,
          imageURL: uploadedFileUrl,
        },
        config
      );

      // console.log(data);
      setMessages([...messages, data]);
      socket.emit("new message", data);
      setUploadedFileUrl(null);
      setFile(null);
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const timerLength = 3000;
    setTimeout(() => {
      setTyping(false);
      socket.emit("stop typing", selectedChat._id);
    }, timerLength);
  };

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    uploadFileToCloudinary(selectedFile, setLoading, setUploadedFileUrl, toast);
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
                scrollbarwidth="none"
              >
                {file && (
                  <ImagePreviewModal
                    fileName={file.name}
                    setFileName={setFile}
                    fileUrl={uploadedFileUrl}
                    setFileUrl={setUploadedFileUrl}
                    uploadImage={uploadImage}
                  />
                )}
                <ScrollableChat messages={messages} />
              </Box>
            )}
            {istyping ? (
              <Box display="flex">
                <Image
                  src="/assets/typing.gif"
                  alt="Start Chat"
                  boxSize="50"
                  objectFit="cover"
                />
              </Box>
            ) : null}
            <Flex mt={3}>
              <Box position="relative">
                <IconButton
                  aria-label="Upload File"
                  icon={
                    <Box
                      as="i"
                      className="fa-solid fa-paperclip"
                      style={{ color: iconColor, cursor: "pointer" }}
                    >
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        position="absolute"
                        top={0}
                        left={0}
                        opacity={0}
                        style={{ cursor: "pointer" }}
                      />
                    </Box>
                  }
                  marginRight={2}
                />
              </Box>

              <FormControl isRequired>
                <InputGroup>
                  <Input
                    bg={"E0E0E0E"}
                    placeholder="Enter a Message"
                    onChange={typingHandler}
                    value={newMessage}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        sendMessage();
                      }
                    }}
                  />
                  <InputRightElement width="auto" marginRight={3}>
                    <Box
                      as="i"
                      className="fa-solid fa-paper-plane"
                      style={{ color: iconColor, cursor: "pointer" }}
                      onClick={sendMessage}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Flex>
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
            src="/assets/start-chat.gif"
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
