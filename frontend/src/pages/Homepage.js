import {React,useEffect} from 'react'
import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import Login from '../components/authentication/Login';
import SignUp from '../components/authentication/SignUp';
import { useNavigate } from "react-router-dom";


const Homepage = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  },[navigate])

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        bg={"white"}
        w="100%"
        m="95px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        color="black"
        minH={"70px"}>
        <Text
          fontSize={"4xl"}
          textAlign={"center"}
          p={"10px"}
          fontFamily={"Work sans"}
          color={"black"}>
          <strong>Chat Web App</strong>
        </Text>
      </Box>

      <Box bg="white" w="100%" p={5} borderRadius={"lg"} color={"blackAlpha.900"} borderWidth={"1px"}>
        <Tabs variant="soft-rounded" >
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {<Login/>}
            </TabPanel>
            <TabPanel>
              {<SignUp/>}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage
