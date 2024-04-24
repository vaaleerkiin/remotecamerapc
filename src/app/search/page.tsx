"use client";

import {
  Box,
  Center,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [init, setInit] = useState(true);

  const [devices, setDevices] = useState<
    { ip: string; mac: string; isRecording: boolean }[]
  >([]);

  useEffect(() => {
    if (init) {
      setInit(false);
      fetchData(255);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init]);

  function removeLastOctet(ipAddress: any) {
    var ipAddressString = ipAddress.toString();
    var lastDotIndex = ipAddressString.lastIndexOf(".");
    return ipAddressString.substring(0, lastDotIndex);
  }
  const fetchData = async (num: number) => {
    const ip = await fetch("/api/ip")
      .then((res) => res.json())
      .then(removeLastOctet);
    console.log(ip);

    for (let i = 0; i <= num; i += 1) {
      fetch(`http://${ip}.${i}:3033/api/connect-obs`)
        .then((res) => res.json())
        .then((data) => {
          setDevices((prevDevices) => [...prevDevices, data]);
          setLoading(false);
        })
        .catch(() => console.log("fail"));
    }
  };

  console.log(devices);

  return (
    <Container mt={4} display="flex" justifyContent="center">
      {loading && <Spinner size="xl" />}

      {!loading && (
        <VStack w="100%" as="ul">
          {removeDuplicates(devices, "ip").map((el, index) => (
            <Box
              position="relative"
              href={`/connect?ip=${el.ip}`}
              as="a"
              key={index}
              p={2}
              w="100%"
              shadow="md"
              borderWidth="1px"
              textAlign="center"
              display="flex"
              flexDirection="column"
              cursor="pointer"
              _active={{ transform: "scale(0.995)" }}
            >
              <Text as="span" pointerEvents="none">
                ip:{el.ip}
              </Text>
              <Text as="span" pointerEvents="none">
                mac:{el.mac}
              </Text>
              {el.isRecording && (
                <Text
                  w="24px"
                  h="24px"
                  borderRadius="50%"
                  border="1px solid black"
                  backgroundColor="red"
                  position="absolute"
                  top="50%"
                  right="16px"
                  transform="translateY(-50%)"
                ></Text>
              )}
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
}

function removeDuplicates<T extends { ip: string; mac: string }>(
  arr: T[],
  prop: "ip"
): T[] {
  const uniqueMap = new Map();
  arr.forEach((item) => {
    const key = item[prop];
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  });
  return Array.from(uniqueMap.values());
}
