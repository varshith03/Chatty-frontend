import React, { useContext } from "react";
import { ChatContext } from "../../Context/ChatProvider";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  // const { user } = useContext(ChatContext);
  return (
    <Box
      onClick={() => handleFunction(user)}
      w="100%"
      display={"flex"}
      alignItems={"center"}
      color={"black"}
      bg={"E8E8E8"}
      cursor={"pointer"}
      _hover={{ bg: "#FADA5E" }}
      px={3}
      py={2}
      mb={2}
      borderRadius={"lg"}
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
        <Text fontSize="xs">
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
