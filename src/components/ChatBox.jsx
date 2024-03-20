import React, { useContext } from "react";
import { ChatContext } from "../Context/ChatProvider";
import { Box, useColorMode } from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ refreshChats, setRefreshChats }) => {
  const { selectedChat } = useContext(ChatContext);

  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  const bgColor =
    colorMode === "light" ? theme.colors.white : theme.colors.gray["800"];
  const textColor =
    colorMode === "light" ? theme.colors.black : theme.colors.white;

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      width={{ base: "100%", md: "70%" }}
      align="center"
      flexDirection="column"
      borderRadius={"lg"}
      p={3}
      bg={bgColor}
    >
      <SingleChat
        refreshChats={refreshChats}
        setRefreshChats={setRefreshChats}
      />
    </Box>
  );
};

export default ChatBox;
