import { GetStreamStatus } from "@/util/OBS";
import { Button } from "@chakra-ui/react";
import OBSWebSocket from "obs-websocket-js";
import { useEffect, useState } from "react";

export const ToogleStream = ({
  obs,
  streamStatus,
  setStreamStatus,
}: {
  obs: OBSWebSocket;
  streamStatus: boolean;
  setStreamStatus: (status: boolean) => void;
}) => {
  const ToogleStream = async () => {
    await obs.call("ToggleStream");
    setStreamStatus(!streamStatus);
  };

  return (
    <>
      <Button
        h={50}
        colorScheme={streamStatus ? "red" : "blue"}
        onClick={ToogleStream}
      >
        {streamStatus ? "Stop stream" : "Start stream"}
      </Button>
    </>
  );
};
