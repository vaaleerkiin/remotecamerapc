import { Container, Img, Text } from "@chakra-ui/react";
import OBSWebSocket from "obs-websocket-js";
import { useEffect, useState } from "react";

export const Viewer = ({
  obs,
  currnetScene,
  streamStatus,
}: {
  obs: OBSWebSocket;
  currnetScene: string;
  streamStatus: boolean | undefined;
}) => {
  const [sourceImage, setSourceImage] = useState<string | undefined>();

  useEffect(() => {
    if (!currnetScene) return;

    const interval = setInterval(
      async () => {
        const { imageData } = await obs.call("GetSourceScreenshot", {
          sourceName: currnetScene,
          imageFormat: "jpeg",
          imageWidth: 853,
          imageHeight: 480,
        });
        setSourceImage(imageData);
      },
      streamStatus ? 2000 : 70
    );

    return () => {
      clearInterval(interval);
    };
  }, [currnetScene, obs, streamStatus]);

  return (
    <>
      {sourceImage && (
        <Container aspectRatio="16/9" w="100%" p={0} position="relative">
          <Img
            w="100%"
            borderRadius="8px"
            src={sourceImage}
            alt="screenshot"
          ></Img>
          {streamStatus && (
            <Text
              position="absolute"
              transform="translateX(50%)"
              bottom="2px"
              right="50%"
              color="#ffffffae"
              textAlign="center"
              w="100%"
            >
              When there is a stream, the preview is updated every 2 seconds
            </Text>
          )}
        </Container>
      )}
    </>
  );
};
