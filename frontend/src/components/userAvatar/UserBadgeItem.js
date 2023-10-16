import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
  return (
      <Box
          px={2}
          py={1}
          borderRadius="lg"
          m={1}
          mb={2}
          variant="solid"
          fontSize={16}
          color={"white"}
          bg={"blue.500"}
          cursor={"pointer"}
          onClick={handleFunction}
      >

          {user.name}
          <CloseIcon pl={2} fontSize={18} alignItems={"center"}/>
      </Box>
      
  )
}

export default UserBadgeItem
