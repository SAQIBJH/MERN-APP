import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Spinner,
  Box,
} from "@chakra-ui/react";
import React, { useState } from 'react'
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItems from "../userAvatar/UserListItems";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const [groupChatName, setGroupChatName] = useState("");
    const [selectUsers, setSelectUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false);


    const toast = useToast();

    const { user, chats, setChats }
        = ChatState();
    
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config)
           
            // console.log("data")
            // console.log(data)
            setLoading(false);
            setSearchResult(data);

        }
        catch (error) {
            toast({
                title: "Error Occured",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position:"bottom-left"
           }) 
        }
    }

    
    const handleGroup = (userToAdd) => {
        if (selectUsers.includes(userToAdd)) {
            toast({
                title: "User Already added",
                status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
        } 
        
        setSelectUsers([...selectUsers, userToAdd]);
    };
    
    const handleSubmit = async () => {

        if (!groupChatName || !selectUsers) {
            toast({
              title: "Please fill all the field",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
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
            const { data } = await axios.post("/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectUsers.map(u => u._id))
            },config);

          setChats([data, ...chats]);
       
          
          setGroupChatName("");
          setSelectUsers([]);
        setSearchResult([]);
        setLoading(false);
          onClose();

          
              toast({
                title: "New Group Chat Created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
            
        }
        catch (error) {
              toast({
                  title: "Failed to create Chat",
                  description:error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
        setLoading(false);
            
        }


    }
    const handleDelete = (deletedUser) => {
        setSelectUsers(selectUsers.filter(sel => sel._id !== deletedUser._id))
        toast({
          title: "User removed",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
    };
  
    


  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <Input
                placeholder="Add users eg: John, Adam, etc..."
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* selected users */}
            <Box width="100%" display={"flex"} flexWrap={"wrap"}>
              {selectUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {/* {render search users} */}
            {loading ? (
              <Spinner my={5} display={"flex"} />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItems
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              variant={"solid"}
              ml={1}
              isLoading={loading}
              onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal
