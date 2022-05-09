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
  const round2Decimal = (value: number) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
  useEffect( () => {
    const fetchHistoric = async () => {
      const period = [300, 900, 3600, 14400, 86400];
      const res = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://ftx.com/api/markets/LUNA/USD/candles?resolution=${period[index]}`
      );
      return res
    }
    fetchHistoric().then((res: any) => {
      setInitialData(res.data.result)
    });
  }, [index])

  const [info, setInfo] = useState<any>({});
  useEffect( () => {
    const fectchPrice = async () => {
      const res = await axios.get(
        'https://cors-anywhere.herokuapp.com/https://ftx.com/api/markets/LUNA/USD'
      );
      return res
    }
    const fetch = () => {
      fectchPrice().then((res:any) => {
        setInfo(res.data.result)
      })
    }
    fetch();

    // setInterval(fetch, 1000);
  },[])

  return (
    <Flex
      maxW='900px'
      direction={'column'}
      justify='center'
    >
      <HStack
        w='100%'
        bg='#04306b'
        spacing='50px'
        px='50px'
        h='80px'
      >
        <Text
          fontSize='24px'
        >
          LUNA/USD
        </Text>
        <VStack>
          <Text>
            Price
          </Text>
          <Text>
            {info.price}
          </Text>
        </VStack>
        <VStack>
          <Text>
            24h Change
          </Text>
          <Text>
            {round2Decimal(info.change24h)}
          </Text>
        </VStack>
        <VStack>
          <Text>
            24h high
          </Text>
          <Text>
            {info.priceHigh24h}
          </Text>
        </VStack>
        <VStack>
          <Text>
            24h low
          </Text>
          <Text>
            {info.priceLow24h}
          </Text>
        </VStack>
      </HStack>
      <Flex
        mt='30px'
        direction='column'
        w='100%'
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
    </Flex>
  )
}

export default Candlestick;