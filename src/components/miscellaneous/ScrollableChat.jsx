import { Avatar, Box, Image, Text, Tooltip, useConst } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatContext } from "../../Context/ChatProvider";
import {
  isSamePerson,
  isLastMessage,
  senderMargin,
} from "../../config/ChatLogic";
const ScrollableChat = ({ messages }) => {
  const { user } = useContext(ChatContext);

  const scrollableFeedRef = useRef();

  const scrollToBottom = () => {
    if (scrollableFeedRef.current) {
      scrollableFeedRef.current.scrollToBottom();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollableFeed ref={scrollableFeedRef}>
      {messages?.map?.((msg, index) => (
        <Box display="flex" key={msg._id}>
          {(isSamePerson(messages, msg, index, user._id) ||
            isLastMessage(messages, index, user._id)) && (
            <Tooltip label={msg.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mr={1}
                mt={1}
                size={"sm"}
                cursor={"pointer"}
                name={msg.sender.name}
                src={msg.sender.profile_pic}
              />
            </Tooltip>
          )}
          <Box
            bg={msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}
            borderRadius={10}
            color="black"
            borderTopLeftRadius={msg.sender._id === user._id ? 10 : 0}
            borderTopRightRadius={msg.sender._id !== user._id ? 10 : 0}
            maxWidth="75%"
            mt={1}
            ml={senderMargin(messages, msg, index, user._id)}
          >
            {msg.content ? (
              // Render msg content if present
              <Box padding="5px 15px">{msg.content}</Box>
            ) : (
              // Render Image tag if msg has image
              msg.image && (
                <Image
                  src={msg.image}
                  alt="Uploaded Image"
                  maxW="200px"
                  maxH="200px"
                  objectFit="cover"
                  borderRadius={10}
                />
              )
            )}
          </Box>
        </Box>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
