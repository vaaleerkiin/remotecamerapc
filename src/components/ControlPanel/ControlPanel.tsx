"use client";

import { Heading } from "@chakra-ui/react";
import { redirect, useSearchParams } from "next/navigation";
import OBSWebSocket from "obs-websocket-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@chakra-ui/react";
import { SceneChange } from "./SceneChange";
import { ToogleStream } from "./ToogleStream";
import { BackButton } from "../BackButton";

// const obs = new OBSWebSocket();
// obs.connect(`ws://192.168.0.143:4455`);
// obs.connect(`ws://192.168.0.143:4455`);

export const ControlPanel = () => {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const ip = searchParams.get("ip");
  const [obs, setObs] = useState<OBSWebSocket | undefined>();
  const [streamStatus, setStreamStatus] = useState(false);
  const [sceneList, setSceneList] = useState<string[]>();
  const [currnetScene, setCurrnetScene] = useState<string>("");

  useEffect(() => {
    if (!ip) redirect("/search");
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip]);

  const fetchData = async () => {
    if (!loading) return;

    const obs = new OBSWebSocket();
    setObs(obs);
    await obs
      .connect(`ws:${ip}:4455`)
      .catch(console.log)
      .then(() => setLoading(false));

    const streamStatus = await obs
      .call("GetStreamStatus")
      .then((res) => res.outputActive);
    setStreamStatus(streamStatus);

    const sceneList = await obs.call("GetSceneList");
    setSceneList(
      sceneList.scenes.map((el) => el.sceneName).reverse() as string[]
    );
    setCurrnetScene(sceneList.currentProgramSceneName);

    return () => {
      obs.disconnect();
    };
  };

  return (
    <>
      <BackButton />

      {!loading && obs && (
        <>
          <Heading textAlign="center">Control panel</Heading>
          <Container marginTop={4} display="flex" flexWrap="wrap" gap={2}>
            <SceneChange
              obs={obs}
              sceneList={sceneList}
              currnetScene={currnetScene}
              setCurrnetScene={setCurrnetScene}
            />
            <ToogleStream
              obs={obs}
              streamStatus={streamStatus}
              setStreamStatus={setStreamStatus}
            />
          </Container>
        </>
      )}
    </>
  );
};
