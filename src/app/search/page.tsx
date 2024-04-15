"use client";
import { ControlPanel } from "@/components/ControlPanel/ControlPanel";
import {
  Box,
  Center,
  Container,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [init, setInit] = useState(true);
  const [devices, setDevices] = useState<{ ip: string; mac: string }[]>([]);

  useEffect(() => {
    if (init) {
      setInit(false);
      fetchData(999);
    }
  }, [init]);

  const fetchData = async (num: number) => {
    for (let i = 0; i < num; i += 1) {
      fetch(`http://192.168.0.${i}:3033/api/connect-obs`)
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
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
}

function removeDuplicates(arr: { ip: string; mac: string }[], prop: "ip") {
  const uniqueMap = new Map();
  arr.forEach((item) => {
    const key = item[prop];
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  });
  return Array.from(uniqueMap.values());
}
