import React, { useContext, useState } from "react";
import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useColorMode,
  useColorModeValue,
  useTheme,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import { ChatContext } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import ChatSkelleton from "./ChatSkelleton";
import axios from "axios";
import { apiURL } from "../../constants/common";
import UserListItem from "../User/UserListItem";
import "@fortawesome/fontawesome-free/css/all.css";
import { getSender } from "../../config/ChatLogic";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isRegular, setIsRegular] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useContext(ChatContext);
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  const bgColor =
    colorMode === "light" ? theme.colors.white : theme.colors.gray["800"];

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter a search term!",
        status: "warning",
        duration: "3000",
        isClosable: true,
        position: "top-left",
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
      const { data } = await axios.get(
        `${apiURL}/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
      if (data.length < 1) {
        toast({
          title: "No users found🙁",
          status: "info",
          duration: "3000",
          isClosable: true,
          position: "top-left",
        });
      }
    } catch (error) {
      // console.log(error.message);
      toast({
        title: "Error Occurred.",
        description: "Failed to get user",
        status: "error",
        duration: "3000",
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const toggleBellIcon = () => {
    setIsRegular(!isRegular);
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${apiURL}/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chats",
        description: error.message,
        status: "error",
        duration: "3000",
        isClosable: true,
        position: "top-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px"
        borderWidth="5px"
        bgColor={bgColor}
      >
        <Button variant="ghost" onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <Text display={{ base: "none", md: "flex" }} px="4px">
            Search User
          </Text>
        </Button>
        <Text
          fontSize="3xl"
          fontFamily="'Henny Penny', cursive"
          style={{
            textShadow:
              "0 1px #8da1ff, -1px 0 #c0cbff, -1px 2px #8da1ff, -2px 1px #c0cbff, -2px 3px #8da1ff, -3px 2px #c0cbff, -3px 4px #8da1ff, -4px 3px #c0cbff, -4px 5px #8da1ff, -5px 4px #c0cbff, -5px 6px #8da1ff, -6px 5px #c0cbff, -6px 7px #8da1ff, -7px 6px #c0cbff, -7px 8px #8da1ff, -8px 7px #c0cbff",
          }}
          color={colorMode === "dark" ? "yellow" : "black"}
        >
          CHATTY
        </Text>
        <Box>
          <Button
            bgColor={bgColor}
            onClick={toggleColorMode}
            p={{ base: 1, md: 4 }}
          >
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
          <Menu>
            <MenuButton p={1} onClick={toggleBellIcon}>
              {isRegular ? (
                <i className="fa-regular fa-bell fa-lg"></i>
              ) : (
                <i className="fa-solid fa-bell fa-lg"></i>
              )}
              {notification.length > 0 && (
                <Badge colorScheme="red" borderRadius="full" mt={-5}>
                  {notification.length}
                </Badge>
              )}
            </MenuButton>

            <MenuList textAlign="center">
              {!notification.length && "No new notifications"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              p={{ base: 1, md: 4 }}
              bgColor={bgColor}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.profile_pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody overflowX={"hidden"}>
            <Box display="flex" p={2}>
              <Input
                placeholder="Search Channels"
                value={search}
                mr={2}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleEnter}
              ></Input>
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatSkelleton />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleGroup={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
