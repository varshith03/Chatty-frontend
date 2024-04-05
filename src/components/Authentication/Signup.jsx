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
import { uploadFileToCloudinary } from "../../config/uploadFile";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [profile_pic, setProfile_pic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const handleImageUpload = (file) => {
    let selectedFile = file;
    setProfile_pic(selectedFile);
    uploadFileToCloudinary(selectedFile, setLoading, setProfile_pic, toast);
  };

  useEffect(() => {
    console.log(profile_pic);
  }, [profile_pic]);

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
      // console.log(error);
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
        <CustomFileUpload
          profile_pic={profile_pic}
          onChange={handleImageUpload}
        />
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
