import {
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import OBSWebSocket, { OBSResponseTypes } from "obs-websocket-js";
import React from "react";
import { useEffect, useState } from "react";
import { ConfirmAction } from "./ConfirmAction";

export const ChangeServerKey = ({
  obs,
  streamServiceSettings,
}: {
  obs: OBSWebSocket;
  streamServiceSettings:
    | OBSResponseTypes["GetStreamServiceSettings"]
    | undefined;
}) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [field, setField] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setField(e.target.value);
  }

  function handleSubmit() {
    if (!streamServiceSettings) return;

    const data = { ...streamServiceSettings };
    data.streamServiceSettings.key = field;
    obs.call("SetStreamServiceSettings", data);
  }

  useEffect(() => {
    if (!streamServiceSettings?.streamServiceSettings.key?.toString()) return;
    setField(streamServiceSettings.streamServiceSettings.key?.toString());
  }, [streamServiceSettings]);

  return (
    <>
      {obs && streamServiceSettings && (
        <FormControl
          as="form"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <FormLabel>Server key</FormLabel>
          <InputGroup size="md">
            <Input
              onChange={handleChange}
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter key"
              defaultValue={streamServiceSettings.streamServiceSettings.key?.toString()}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <ConfirmAction onClick={handleSubmit}>
            <Button mt={4} colorScheme="teal" type="submit">
              Submit
            </Button>
          </ConfirmAction>
        </FormControl>
      )}
    </>
  );
};
