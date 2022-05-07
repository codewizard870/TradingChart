import React, { FunctionComponent, useState, useEffect } from 'react';
import { HStack, VStack, Flex, Box, Button, Text, Divider } from '@chakra-ui/react'
import axios from 'axios';
import TradingChart from './TradingChart';
import { data } from "./data";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

const Candlestick: FunctionComponent = (props) => {
  const [initialData, setInitialData] = useState<any[]>(data);
  const [index, setIndex] = useState(1);
  const setTabIndex = (index: number) => {
    setIndex(index)
  }

  useEffect( () => {
    const fetchPrice = async () => {
      const period = [300, 900, 3600, 14400, 86400];
      const res = await axios.get(
        `https://ftx.com/api/markets/LUNA/USD/candles?resolution=${period[index]}`,
      );
      return res
    }
    fetchPrice().then((res: any) => {
console.log(res)
      setInitialData(res)
    });
  }, [index])
  return (
    <Flex
      mt='200px !important'
      direction='column'
      maxW='900px'
      background='#04306b'
    >
      <Tabs onChange={(index) => setTabIndex(index)} cursor='pointer' defaultIndex={index}>
        <TabList color='white'  border='solid 0px'>
          <Tab bg='#232c4b' _selected={{ bg: '#2e3ed7' }} _hover={{bg: '#283780'}}>5m</Tab>
          <Tab bg='#232c4b' _selected={{ bg: '#2e3ed7' }} _hover={{bg: '#283780'}}>15m</Tab>
          <Tab bg='#232c4b' _selected={{ bg: '#2e3ed7' }} _hover={{bg: '#283780'}}>1h</Tab>
          <Tab bg='#232c4b' _selected={{ bg: '#2e3ed7' }} _hover={{bg: '#283780'}}>4h</Tab>
          <Tab bg='#232c4b' _selected={{ bg: '#2e3ed7' }} _hover={{bg: '#283780'}}>1d</Tab>
        </TabList>
      </Tabs>
      <Flex pt='10px' justify='center'>
        <TradingChart initialData={initialData} />
      </Flex>
    </Flex>
  )
}

export default Candlestick;