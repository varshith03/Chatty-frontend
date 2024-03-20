import { Avatar, Text, CloseButton, HStack } from "@chakra-ui/react";

const UserPill = ({ user, handleRemove }) => {
  return (
    <HStack spacing={2} borderRadius="md" bg="#FADA5E" p={1} height="30px">
      <Avatar name={user.name} src={user.profile_pic} size="xs" />
      <Text fontWeight="medium" fontSize="sm" color="black">
        {user.name}
      </Text>
      <CloseButton size="sm" color="black" onClick={() => handleRemove(user)} />
    </HStack>
  );
};

export default UserPill;
