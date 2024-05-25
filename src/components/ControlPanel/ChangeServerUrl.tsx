import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import OBSWebSocket, { OBSResponseTypes } from "obs-websocket-js";
import { useEffect, useState } from "react";
import { ConfirmAction } from "./ConfirmAction";

export const ChangeServerUrl = ({
  obs,
  streamServiceSettings,
}: {
  obs: OBSWebSocket;
  streamServiceSettings:
    | OBSResponseTypes["GetStreamServiceSettings"]
    | undefined;
}) => {
  const [field, setField] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setField(e.target.value);
    console.log(e);
  }

  function handleSubmit() {
    if (!streamServiceSettings) return;

    const data = { ...streamServiceSettings };
    data.streamServiceSettings.server = field;
    obs.call("SetStreamServiceSettings", data);
  }

  useEffect(() => {
    if (!streamServiceSettings?.streamServiceSettings.server?.toString())
      return;
    setField(streamServiceSettings.streamServiceSettings.server?.toString());
  }, [streamServiceSettings]);

  return (
    <>
      {streamServiceSettings && (
        <FormControl
          as="form"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <FormLabel>Server url</FormLabel>
          <Input
            onChange={handleChange}
            type="text"
            name="url"
            placeholder="Enter url"
            defaultValue={streamServiceSettings.streamServiceSettings.server?.toString()}
          />
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
