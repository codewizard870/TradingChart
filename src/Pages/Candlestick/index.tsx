import React, { FunctionComponent, useState, useEffect } from 'react';
import { HStack, VStack, Flex, Box, Button, Text, Divider } from '@chakra-ui/react'
import axios from 'axios';
import TradingChart from './TradingChart';
import { data } from "./data";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { OHLCSeries } from 'react-financial-charts';

interface OHCL{
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}
const Candlestick: FunctionComponent = (props) => {
  const [initialData, setInitialData] = useState<any[]>([]);
  const [index, setIndex] = useState(1);

  const setTabIndex = (index: number) => {
    setIndex(index)
  }
  const round2Decimal = (value: number) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
  useEffect( () => {
    const fetchHistoric = async () => {
      const period = [1, 7, 14, 30, 90];
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/wrapped-near/ohlc?vs_currency=usd&days=${period[index]}`
      );
      console.log(res)
      return res
    }
    fetchHistoric().then((res: any) => {
      let length = res.data.length;
      let data = new Array<OHCL>(length);

      for(let i=0; i<length; i++){
        data[i] = {
          time: res.data[i][0],
          open: res.data[i][1],
          high: res.data[i][2],
          low: res.data[i][3],
          close: res.data[i][4]
        };
      }
      setInitialData(data)
    });
  }, [index])

  const [info, setInfo] = useState<any>({});
  useEffect( () => {
    const fectchPrice = async () => {
      const res = await axios.get(
        // 'https://cors-anywhere.herokuapp.com/https://ftx.com/api/markets/BTC/USD'
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=wrapped-near&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      console.log(res)
      return res
    }
    const fetch = () => {
      fectchPrice().then((res:any) => {
        setInfo(res.data[0])
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
          Near/USD
        </Text>
        <VStack>
          <Text>
            Price
          </Text>
          <Text>
            {info.current_price}
          </Text>
        </VStack>
        <VStack>
          <Text>
            24h Change
          </Text>
          <Text>
            {round2Decimal(info.price_change_24h)}
          </Text>
        </VStack>
        <VStack>
          <Text>
            24h high
          </Text>
          <Text>
            {info.high_24h}
          </Text>
        </VStack>
        <VStack>
          <Text>
            24h low
          </Text>
          <Text>
            {info.low_24h}
          </Text>
        </VStack>
      </HStack>
      <Flex
        mt='30px'
        direction='column'
        w='100%'
        // background='#04306b'
        background = "white"
      >
        <Tabs onChange={(index) => setTabIndex(index)} cursor='pointer' defaultIndex={index}>
          <TabList color='white'  border='solid 0px'>
            <Tab bg='#232c4b' _selected={{ bg: '#2e3ed7' }} _hover={{bg: '#283780'}}>1</Tab>
            <Tab bg='#232c4b' _selected={{ bg: '#2e3ed7' }} _hover={{bg: '#283780'}}>7</Tab>
            <Tab bg='#232c4b' _selected={{ bg: '#2e3ed7' }} _hover={{bg: '#283780'}}>14</Tab>
            <Tab bg='#232c4b' _selected={{ bg: '#2e3ed7' }} _hover={{bg: '#283780'}}>30</Tab>
            <Tab bg='#232c4b' _selected={{ bg: '#2e3ed7' }} _hover={{bg: '#283780'}}>90</Tab>
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