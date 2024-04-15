"use client";
import {
  Box,
  HStack,
  RadioProps,
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
        px={5}
        py={3}
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
    <HStack {...group} display="inline-flex" gap={2}>
      {sceneList &&
        sceneList.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          );
        })}
    </HStack>
  );
};
