import React, { useEffect, useMemo } from 'react'
import { Outlet, Link } from "react-router-dom";
import { VStack, Flex, useDisclosure, useEventListenerMap } from '@chakra-ui/react'

const Layout = () => {
  return (
    <Flex
      bg='#054ba9'
      justify={'center'}
      w={'100%'}
    >
      <VStack
        fontFamily={'SF-Pro-Text'}
        fontStyle={'normal'}
        spacing={'10px'}
        color={'white'}
        w = {'100%'}
      >
        <Outlet />
      </VStack>
    </Flex>
  )
};
export default Layout;
