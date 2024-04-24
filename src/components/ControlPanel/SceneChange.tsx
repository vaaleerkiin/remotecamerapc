"use client";
import {
  Box,
  HStack,
  RadioProps,
  Text,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react";
import OBSWebSocket from "obs-websocket-js";
import { useEffect, useState } from "react";

const RadioCard = (props: RadioProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        white-space="nowrap"
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "#222126",
          color: "white",
          borderColor: "#222126",
        }}
        _focus={{
          boxShadow: "#393841",
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minW={74}
        maxW={150}
        h={50}
        // p={4}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export const SceneChange = ({
  obs,
  sceneList,
  currnetScene,
  setCurrnetScene,
}: {
  obs: OBSWebSocket;
  sceneList: string[] | undefined;
  currnetScene: string;
  setCurrnetScene: (value: string) => void;
}) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "scenes",
    value: currnetScene,
    onChange: (nextValue) => {
      obs
        .call("SetCurrentProgramScene", { sceneName: nextValue })
        .then(() =>
          obs
            .call("GetSceneList")
            .then((res) => setCurrnetScene(res.currentProgramSceneName))
        );
    },
  });

  const group = getRootProps();

  return (
    <HStack {...group} display="inline-flex" flexWrap="wrap" gap={2}>
      {sceneList &&
        sceneList.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} {...radio}>
              <Text
                textAlign="center"
                white-space="nowrap"
                display="block"
                noOfLines={2}
                p="0 6px"
                w="calc(100% + 8px)"
              >
                {value}
              </Text>
            </RadioCard>
          );
        })}
    </HStack>
  );
};
