import { React, useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { useToast, Box, Button, Stack, Text,Avatar } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = (fetchAgain) => {
  const [loggedUser, setLoggedUser] = useState();

  const toast = useToast();

  const { selectedChat, setSelectedChat, user, chats, setChats } =
    ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the chat",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={3}
      bg={"whiteAlpha.700"}
      width={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}>
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work sans"}
        display={"flex"}
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}>
        My Chats
        <GroupChatModal>
          <Button
          backgroundColor="rgba(255, 255, 255, 0.7)"
    _hover={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
    paddingX={4}
    paddingY={2}
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg="blackAlpha.600"
        width={"100%"}
        height={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}>
        <Stack overflowY={"scroll"}>
          {chats ? (
            chats.map((chat) => {
              // Find the user associated with the chat
            const otherUser = chat.users.find(
              (user) => user._id !== loggedUser._id
            );
            const formattedName = otherUser.name.charAt(0).toUpperCase() + otherUser.name.slice(1).toLowerCase();

              return (
                <Box
                  onClick={() => setSelectedChat(chat)}

                  // onClick={handleFunction}
      width={"100%"}
      cursor={"pointer"}
      bg="blackAlpha.700"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      display={"flex"}
      alignItems={"center"}
      color="white"
      px={3}
      py={2}
      mb={2}
       key={chat._id}
      borderRadius={"lg"}>
      <Box display="flex">
        
                  {!chat.isGroupChat
                    ? (<div backgroundColor="rgba(255, 255, 255, 0.15)"
  backdropFilter="blur(10px)"
  {/* border="1px solid rgba(255, 255, 255, 0.2)" */}
  boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
  p={6}
  textAlign="center">
                        <Avatar
        mr={2}
        size={"sm"}
        cursor={"pointer"}
        name={formattedName.name}
        src={otherUser.pic}
      />

      <Box display="flex">
        <Text 
        
        fontSize="m">
          <b>{formattedName}</b>
        </Text>
  
      </Box>
                    </>)
                    : chat.chatName}
                
      </Box>
    


                




                </Box>
              );
            })
          ) : (
            <ChatLoading />
          )}
        </Stack>

        {/* {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}>
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )} */}
      </Box>
    </Box>
  );
};

export default MyChats;
