import React, { useContext } from "react";
import { ChatContext } from "../../Context/ChatProvider";
import { Avatar, Box, Text, useColorMode, useTheme } from "@chakra-ui/react";

const UserListItem = ({ user, handleGroup, isActive }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  const bgColor =
    colorMode === "light" ? theme.colors.white : theme.colors.gray["800"];
  const textColor =
    colorMode === "light" ? theme.colors.black : theme.colors.white;

  return (
    <Box
      w="100%"
      display={"flex"}
      alignItems={"center"}
      color={textColor}
      cursor={"pointer"}
      _hover={{ bg: "lightgray", color: "black" }}
      px={3}
      py={2}
      mb={2}
      borderRadius={"lg"}
      // bg={bgColor}
      bg={isActive ? "gray.200" : "white"}
      onClick={() => handleGroup(user)}
    >
      <Avatar
        mr={2}
        size={"sm"}
        cursor={"pointer"}
        name={user.name}
        src={user.profile_pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text
          fontSize="xs"
          isTruncated
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
