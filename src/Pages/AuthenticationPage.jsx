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
      <Button
        bg={bgColor}
        _hover={{ bg: colorMode === "light" ? "dark" : "light" }}
        onClick={toggleColorMode}
      >
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
        <Text
          fontSize="xxx-large"
          fontFamily="'Henny Penny', cursive"
          style={{
            textShadow: "0 1px #8da1ff, -1px 0 #c0cbff, -1px 2px #8da1ff, -2px 1px #c0cbff, -2px 3px #8da1ff, -3px 2px #c0cbff, -3px 4px #8da1ff, -4px 3px #c0cbff, -4px 5px #8da1ff, -5px 4px #c0cbff, -5px 6px #8da1ff, -6px 5px #c0cbff, -6px 7px #8da1ff, -7px 6px #c0cbff, -7px 8px #8da1ff, -8px 7px #c0cbff",
          }}
          color={colorMode === "dark" ? "yellow" : "black"}
        >
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
