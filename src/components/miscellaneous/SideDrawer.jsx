import React, { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
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

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isRegular, setIsRegular] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setSelectedChat, chats, setChats } = useContext(ChatContext);
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  const bgColor =
    colorMode === "light" ? theme.colors.white : theme.colors.gray["800"];
  const textColor =
    colorMode === "light" ? theme.colors.black : theme.colors.white;

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
    } catch (error) {
      console.log(error.message);
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
        <Text fontSize="3xl" fontFamily="Work sans">
          CHATTY
        </Text>
        <div>
          <Menu>
            <Button bgColor={bgColor} onClick={toggleColorMode} mr={2}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            <MenuButton p={1} onClick={toggleBellIcon}>
              {isRegular ? (
                <i className="fa-regular fa-bell fa-lg"></i>
              ) : (
                <i className="fa-solid fa-bell fa-lg"></i>
              )}
            </MenuButton>
            <MenuList>
              <MenuItem>notification 1</MenuItem>
              <MenuItem>notification 2</MenuItem>
              <MenuItem>notification 3</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bgColor={bgColor} rightIcon={<ChevronDownIcon />}>
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
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody overflowX={"hidden"}>
            <Box display="flex" p={2}>
              <Input
                placeholder="Search Channels"
                value={search}
                mr={2}
                onChange={(e) => setSearch(e.target.value)}
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
                  handleFunction={() => accessChat(user._id)}
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
