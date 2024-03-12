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
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const AuthenticationPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "#0c0c1d");
  const color = useColorModeValue("#0c0c1d", "white");
  return (
    <Container maxW="xl" centerContent>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
      <Box
        bg={bg}
        color={color}
        display="flex"
        justifyContent="center"
        p={3}
        // bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="10px"
        borderWidth="1px"
      >
        <Text fontSize="40px" fontFamily="Work sans">
          Chatty
        </Text>
      </Box>
      <Box
        bg={bg}
        color={color}
        p={4}
        w="100%"
        borderRadius="10px"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded" colorScheme="yellow">
          <TabList mb="10px">
            <Tab width="50%" color={color}>
              Login
            </Tab>
            <Tab width="50%" color={color}>
              Sign Up
            </Tab>
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
