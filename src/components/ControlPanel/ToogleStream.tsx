import { GetStreamStatus } from "@/util/OBS";
import { Button } from "@chakra-ui/react";
import OBSWebSocket from "obs-websocket-js";
import { useEffect, useState } from "react";
import { ConfirmAction } from "./ConfirmAction";

export const ToogleStream = ({
  obs,
  streamStatus,
}: {
  obs: OBSWebSocket;
  streamStatus: boolean | undefined;
}) => {
  const ToogleStream = async () => await obs.call("ToggleStream");

  return (
    <>
      {streamStatus !== undefined && (
        <ConfirmAction onClick={ToogleStream}>
          <Button colorScheme={streamStatus ? "red" : "blue"}>
            {streamStatus ? "Stop stream" : "Start stream"}
          </Button>
        </ConfirmAction>
      )}
    </>
  );
};
