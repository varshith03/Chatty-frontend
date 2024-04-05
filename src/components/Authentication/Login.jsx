import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  position,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { apiURL } from "../../constants/common";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import Icon from "react-icons-kit";
import { eye, eyeOff } from "react-icons-kit/feather";
import { ChatContext } from "../../Context/ChatProvider";
import ChatLoading from "../miscellaneous/ChatLoading";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { user, setUser } = useContext(ChatContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  const bgColor =
    colorMode === "light" ? theme.colors.white : theme.colors.gray["800"];
  const textColor =
    colorMode === "light" ? theme.colors.black : theme.colors.white;

  const handleClick = () => setShow(!show);

  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all Feilds",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        header: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        `${apiURL}/api/user/login`,
        { email, password },
        config
      );
      setTimeout(() => {
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setUser(data);
        setLoading(false);
        navigate("/chats");
      }, 3000);
    } catch (error) {
      toast({
        title: "Invalid Email or Password",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const guestDetails = () => {
    setEmail("guest@example.com");
    setPassword("123456");
  };

  return (
    <>
      <VStack>
        <FormControl id="login-email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
        </FormControl>

        <FormControl id="login-password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <InputRightElement width="2.5rem">
              <Button size="sm" mr={1} bg={"none"} onClick={handleClick}>
                <Icon icon={show ? eyeOff : eye} size={20} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="yellow"
          width="100%"
          mt={15}
          onClick={handleLogin}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
          colorScheme="yellow"
          width="100%"
          mt={15}
          onClick={guestDetails}
        >
          Get GuestUser Login
        </Button>
      </VStack>
      {loading && <ChatLoading />}
    </>
  );
};

export default Login;
