import {
  Box,
  Button,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const AuthenticationPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  const bgColor =
    colorMode === "light" ? theme.colors.white : theme.colors.gray["800"];
  const textColor =
    colorMode === "light" ? theme.colors.black : theme.colors.white;

  return (
    <Container maxW="xl" centerContent>
      <Button bg={bgColor} _hover={{ bg:  colorMode === "light" ? "dark" : "light" }} onClick={toggleColorMode}>
        {colorMode === "light" ? "Dark Mode" : "Light Mode"}
      </Button>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="10px"
        borderWidth="1px"
        bg={bgColor}
      >
        <Text fontSize="40px" fontFamily="Work sans" color={textColor}>
          Chatty
        </Text>
      </Box>
      <Box p={4} w="100%" borderRadius="10px" borderWidth="1px" bg={bgColor}>
        <Tabs variant="soft-rounded" colorScheme="yellow">
          <TabList mb="10px">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default AuthenticationPage;
