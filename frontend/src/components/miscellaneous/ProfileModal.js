import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  IconButton,
  useDisclosure,
  // Image,
  Text,
  // Avatar,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { Avatar as ChakraAvatar } from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  // console.log(user.name);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h={"380px"}>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display={"flex"}
            justifyContent={"center"}>
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}>
            {/* <Image
              borderRadius="full"
              boxSize="150px"
            //   src={user.pic}
            //   alt={user.name}
            
            /> */}
            {/* <Avatar
              borderRadius="full"
              boxSize="130px"
                size="lg"
              cursor="pointer"
              name={user.name}
              src={user.pic}
             ></Avatar> */}

            <ChakraAvatar
              boxSize="130px"
              size="lg"
              cursor="pointer"
              minW="135px"
              bg="teal.500" // Set your desired background color
              color="white" // Set your desired text color
              fontSize="2xl" // Set your desired font size
              src={user.pic}></ChakraAvatar>
          </ModalBody>
          <Text
            align={"center"}
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily={"Work sans"}>
            Email: {user.email}
          </Text>

          <ModalFooter justifyContent={"center"}>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
