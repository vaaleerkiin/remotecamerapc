import { Img } from "@chakra-ui/react";
import OBSWebSocket from "obs-websocket-js";
import { useEffect, useState } from "react";

export const Viewer = ({
  obs,
  currnetScene,
}: {
  obs: OBSWebSocket;
  currnetScene: string;
}) => {
  const [sourceImage, setSourceImage] = useState<string | undefined>();

  useEffect(() => {
    if (!currnetScene) return;

    const interval = setInterval(async () => {
      const { imageData } = await obs.call("GetSourceScreenshot", {
        sourceName: currnetScene,
        imageFormat: "jpeg",
        imageWidth: 1280,
        imageHeight: 720,
      });
      setSourceImage(imageData);
    }, 70);

    return () => {
      clearInterval(interval);
    };
  }, [currnetScene, obs]);

  return <>{sourceImage && <Img src={sourceImage} alt="screenshot"></Img>}</>;
};
