import React from 'react'
import { Avatar, Box, Text } from '@chakra-ui/react';

const UserListItems = ({ user, handleFunction }) => {
 

  return (
    <Box
      onClick={handleFunction}
      width={"100%"}
      cursor={"pointer"}
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      display={"flex"}
      alignItems={"center"}
      color="blackAlpha.800"
      px={3}
      py={2}
      mb={2}
      borderRadius={"lg"}>
      <Avatar
        mr={2}
        size={"sm"}
        cursor={"pointer"}
        name={user.name}
        src={user.pic}
      />

      <Box>
        <Text fontSize="m">
          <b>{user.name}</b>
        </Text>
        <Text fontSize="1em">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
}

export default UserListItems
