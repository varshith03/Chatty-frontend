import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../Context/ChatProvider";
import UserPill from "../User/UserPill";
import { apiURL } from "../../constants/common";
import axios from "axios";
import useDebounce from "./useDebounce";
import UserListItem from "../User/UserListItem";

const UpdateGroupChatModel = ({
  refreshChats,
  setRefreshChats,
  fetchMessages,
}) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);
  const toast = useToast();

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResult([]);
      return;
    }
    setActiveSuggestions(0);

    const fetchSearchResults = async () => {
      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(
          `${apiURL}/api/user?search=${debouncedSearch}`,
          config
        );

        if (data.length === 0) {
          toast({
            title: "No users found",
            status: "info",
            duration: 3000,
            isClosable: true,
            position: "top-center",
          });
        }

        setSearchResult(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
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

    fetchSearchResults();
  }, [debouncedSearch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleAddToGroup = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    //if (!selectedChat.groupAdmin.some(admin => admin._id === user._id))  multiple admin case
    if (selectedChat.groupAdmin[0]._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${apiURL}/api/chat/group-add`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setRefreshChats(!refreshChats);
      setLoading(false);
      toast({
        title: "USer  added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      // console.log(error);
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemoveFromGroup = async (userToRemove) => {
    if (
      selectedChat.groupAdmin[0]._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${apiURL}/api/chat/group-remove`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      //SPECIAL FEATURE FOR GROUP CHATS i.e admin leaves all users removed
      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setRefreshChats(!refreshChats);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${apiURL}/api/chat/rename-group`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setRefreshChats(!refreshChats);
      setRenameLoading(false);
      toast({
        title: "Group name Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleKeyDown = (e) => {
    // Check if Backspace key is pressed and input is empty and there are selected users
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUsers.length > 0
    ) {
      // If conditions met, remove the last selected user from the group
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveFromGroup(lastUser);
    } // Check if ArrowDown key is pressed and there are search results
    else if (e.key === "ArrowDown" && searchResult.length > 0) {
      // If conditions met, move the active suggestion index down
      setActiveSuggestions((prevIndex) =>
        prevIndex < searchResult.length - 1 ? prevIndex + 1 : 0
      );
    } // Check if ArrowUp key is pressed and there are search results
    else if (e.key === "ArrowUp" && searchResult.length > 0) {
      // If conditions met, move the active suggestion index up
      setActiveSuggestions((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : searchResult.length - 1
      );
    } // Check if Enter key is pressed, there is an active suggestion, and it's within the range of search results
    else if (
      e.key === "Enter" &&
      activeSuggestions >= 0 &&
      activeSuggestions < searchResult.length
    ) {
      // If conditions met, add the active suggestion to the group
      handleAddToGroup(searchResult[activeSuggestions]);
      setSearch("");
      setSearchResult([]);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <Box
              w={"100%"}
              display="flex"
              flexWrap="wrap"
              pb={3}
              mb={2}
              gap={2}
            >
              {selectedChat.users.map((user) => (
                <UserPill
                  key={user._id}
                  user={user}
                  handleRemove={handleRemoveFromGroup}
                />
              ))}
            </Box>

            <FormControl display="flex" gap={1}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="blue"
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e)}
                onKeyDown={handleKeyDown}
              />
              <Box>
                {loading ? (
                  <Spinner />
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user, index) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleGroup={() => handleAddToGroup(user)}
                        isActive={index === activeSuggestions}
                      />
                    ))
                )}
              </Box>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => handleRemoveFromGroup(user)}
              colorScheme="red"
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
