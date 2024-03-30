import React, { useEffect, useState } from "react";
import {
  Stack,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { apiURL } from "../../constants/common";
import Icon from "react-icons-kit";
import { eye, eyeOff } from "react-icons-kit/feather";
import CustomFileUpload from "../miscellaneous/CustomFileUpload";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [profile_pic, setProfile_pic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { VITE_APP_CLOUDINARY_URL, VITE_APP_CLOUD_NAME } = import.meta.env;

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", VITE_APP_CLOUD_NAME);
      fetch(VITE_APP_CLOUDINARY_URL, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfile_pic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
          toast({
            title: "Photo Uploaded",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          return;
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (profile_pic === "") {
      setProfile_pic("https://cdn-icons-png.flaticon.com/512/1053/1053244.png");
    }
    if (!name || !email || !password || !confirmpassword) {
      toast({
        description:
          "All fields are required. Please fill out all the details.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        description: "Passwords do not match.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${apiURL}/api/user`,
        { name, email, password, profile_pic },
        config
      );
      toast({
        title: "Registration SuccessFul!",
        description: `Welcome ${data.name}`,
        status: "success",
        duration: 3000,
        isClosable: false,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured.",
        description: error.message,
        status: "error",
        duration: 6000,
        isClosable: false,
        position: "top-right",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width="2.5rem">
            <Button size="sm" mr={1} bg={"none"} onClick={handleClick}>
              <Icon icon={show ? eyeOff : eye} size={20} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          ></Input>
          <InputRightElement width="2.5rem">
            <Button size="sm" mr={1} bg={"none"} onClick={handleClick}>
              <Icon icon={show ? eyeOff : eye} size={20} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="photo">
        <FormLabel>Upload your Picture</FormLabel>
        {/* <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        ></Input> */}
        <CustomFileUpload onChange={(e) => postDetails(e.target.files[0])} />
      </FormControl>

      <Button
        colorScheme="yellow"
        width="100%"
        mt={15}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
