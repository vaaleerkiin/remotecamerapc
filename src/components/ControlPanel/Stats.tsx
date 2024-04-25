import { Center, Container, Text } from "@chakra-ui/react";
import OBSWebSocket, {
  OBSRequestTypes,
  OBSResponseTypes,
} from "obs-websocket-js";
import { useEffect, useState } from "react";

export const Stats = ({ obs }: { obs: OBSWebSocket }) => {
  const [stats, setStats] = useState<
    undefined | OBSResponseTypes["GetStats"]
  >();

  useEffect(() => {
    const interval = setInterval(async () => {
      const currnetStats = await obs.call("GetStats");
      setStats(currnetStats);
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, [obs]);

  return (
    <>
      {stats && (
        <Container
          w="100%"
          textAlign="center"
          display="flex"
          flexDirection="column"
        >
          <Text as="span">
            render skipped frames: {stats.renderSkippedFrames} | render total
            frames: {stats.renderTotalFrames}{" "}
          </Text>
          <Text as="span">
            output skipped frames: {stats.outputSkippedFrames} | output total
            frames: {stats.outputTotalFrames}
          </Text>
          <Text as="span">
            cpu usage: {Math.round(stats.cpuUsage * 10) / 10}% | active fps:{" "}
            {Math.round(stats.activeFps)}
          </Text>
        </Container>
      )}
    </>
  );
};
