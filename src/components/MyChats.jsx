import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { apiURL } from "../constants/common";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();

  const { user, selectedChat, setSelectedChat, chats, setChats } =
    useContext(ChatContext);
  const toast = useToast();

  //function for fetching chata
  const fetchChats = async () => {
    try {
      const config = {
        header: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${apiURL}/api/chat`, config);
      console.log(data)
      setChats(data);
    } catch (error) {
      console.log(user.token)
      toast({
        title: "Error occured",
        description: "Failed to Load Chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    fetchChats();
  }, []);

  return <div>MyChats</div>;
};

export default MyChats;
