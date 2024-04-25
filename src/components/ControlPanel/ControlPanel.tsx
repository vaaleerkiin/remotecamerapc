"use client";

import { redirect } from "next/navigation";
import OBSWebSocket from "obs-websocket-js";
import { useEffect, useState } from "react";
import { Container } from "@chakra-ui/react";
import { SceneChange } from "./SceneChange";
import { ToogleStream } from "./ToogleStream";
import { Viewer } from "./Viewer";
import { Stats } from "./Stats";

export const ControlPanel = ({ ip }: { ip: string | null }) => {
  const [loading, setLoading] = useState(true);
  const [obs, setObs] = useState<OBSWebSocket | undefined>();
  const [streamStatus, setStreamStatus] = useState<boolean | undefined>();
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
      {!loading && obs && (
        <Container
          marginTop={4}
          display="flex"
          flexWrap="wrap"
          gap={2}
          justifyContent="center"
        >
          <Viewer
            obs={obs}
            currnetScene={currnetScene}
            streamStatus={streamStatus}
          />
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
          <Stats obs={obs} />
        </Container>
      )}
    </>
  );
};
