import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  Input,
  useToast,
  Spinner,
  Box,
  Wrap,
  WrapItem,
  HStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../Context/ChatProvider";
import axios from "axios";
import { apiURL } from "../../constants/common";
import UserListItem from "../User/UserListItem";
import UserPill from "../User/UserPill";
import useDebounce from "./useDebounce";

const GroupModalView = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState(0);
  
  const toast = useToast();
  const inputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, chats, setChats } = useContext(ChatContext);
  
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = null;
      inputRef.current.focus();
    }
    setSearch("");
  }, [selectedUsers]);

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
    const value = e.target.value;
    setSearch(value);
  };

  const handleAddToGroup = (userToAdd) => {
    const isUserAlreadyAdded = selectedUsers.some(
      (user) => user._id === userToAdd._id
    );
    // enhancement - you can us the set data structure of javascript to check to added users.

    if (isUserAlreadyAdded) {
      toast({
        title: "User already added",
        status: "info",
        duration: 2500,
        isClosable: false,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    setSearch("");
    setSearchResult([]);
    console.log("here now");
  };

  const handleRemoveFromGroup = (userToRemove) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToRemove._id)
    );
  };

  //SPECIAL FEATURE KEYBOARD NAVIGATION
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

  //this function will create a group with selected users
  const handleSubmit = async () => {
    if (!groupChatName || groupChatName.trim() === "") {
      toast({
        title: "Please type a group name",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    //check user array has minimum 2
    if (selectedUsers.length < 2) {
      toast({
        title: "A Group needs at least two users.",
        status: "warning",
        duration: 3000,
        isClosable: false,
        position: "top-right",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${apiURL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
          //["user1_id","user2_id","user3_id"]  this format it is stored only id is passed
        },
        config
      );
      //the recently added should show in the top  of chat list so data is first
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            fontFamily={"Work sans"}
            fontSize={"2xl"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                type="text"
                placeholder="Group Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl
              _focus={{
                border: "1px solid",
                borderColor: "blue.400",
                borderRadius: "10px",
              }}
            >
              <Box border="1px" borderColor="inherit" borderRadius="md">
                <HStack px={2} py={1}>
                  <Wrap spacing={2} display="flex" align="center">
                    {selectedUsers.map((user) => (
                      <WrapItem key={user._id}>
                        <UserPill
                          user={user}
                          handleRemove={handleRemoveFromGroup}
                        />
                      </WrapItem>
                    ))}
                    <WrapItem>
                      <Input
                        id="searchInput"
                        width={100}
                        type="text"
                        placeholder="Search users"
                        onChange={(e) => handleSearch(e)}
                        ref={inputRef}
                        flexGrow={1}
                        border="none"
                        _focus={{
                          boxShadow: "none",
                        }}
                        p={0}
                        onKeyDown={handleKeyDown}
                      />
                    </WrapItem>
                  </Wrap>
                </HStack>
              </Box>
            </FormControl>

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
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModalView;
