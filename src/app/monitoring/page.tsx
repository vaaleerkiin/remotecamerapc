"use client";

import { ControlPanel } from "@/components/ControlPanel/ControlPanel";
import {
  Box,
  Center,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
  Wrap,
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
    <Box mt={4} display="flex" justifyContent="center">
      {loading && <Spinner size="xl" />}

      {!loading && (
        <Wrap w="100%" as="ul">
          {removeDuplicates(devices, "ip").map((el, index) => (
            <ControlPanel ip={el.ip} key={index} />
          ))}
        </Wrap>
      )}
    </Box>
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
