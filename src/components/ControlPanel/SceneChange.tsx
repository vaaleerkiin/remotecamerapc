"use client";
import {
  Box,
  Button,
  HStack,
  RadioProps,
  Text,
  useRadio,
} from "@chakra-ui/react";
import OBSWebSocket from "obs-websocket-js";
import { ConfirmAction } from "./ConfirmAction";

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
}: {
  obs: OBSWebSocket;
  sceneList: string[] | undefined;
  currnetScene: string;
}) => {
  const ChangeScene = (SceneName: string) =>
    obs
      .call("SetCurrentProgramScene", { sceneName: SceneName })
      .then(() => obs.call("GetSceneList"));

  return (
    <HStack display="inline-flex" flexWrap="wrap" gap={2}>
      {sceneList &&
        sceneList.map((value) => {
          return (
            <ConfirmAction key={value} onClick={() => ChangeScene(value)}>
              <Button colorScheme={value === currnetScene ? "teal" : "gray"}>
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
              </Button>
            </ConfirmAction>
          );
        })}
    </HStack>
  );
};
