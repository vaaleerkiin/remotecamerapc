"use client";

import { redirect } from "next/navigation";
import OBSWebSocket, { OBSResponseTypes } from "obs-websocket-js";
import { useEffect, useState } from "react";
import { Container, Heading } from "@chakra-ui/react";
import { SceneChange } from "./SceneChange";
import { ToogleStream } from "./ToogleStream";
import { Viewer } from "./Viewer";
import { Stats } from "./Stats";
import { ChangeServerUrl } from "./ChangeServerUrl";
import { ChangeServerKey } from "./ChangeServerKey";

export const ControlPanel = ({ ip }: { ip: string | null }) => {
  const [loading, setLoading] = useState(true);
  const [obs, setObs] = useState<OBSWebSocket | undefined>();
  const [streamStatus, setStreamStatus] = useState<boolean | undefined>();
  const [StreamServiceSettings, setStatusStreamServiceSettings] = useState<
    OBSResponseTypes["GetStreamServiceSettings"] | undefined
  >();
  const [sceneList, setSceneList] = useState<string[]>();
  const [currnetScene, setCurrnetScene] = useState<string>("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    if (!ip) redirect("/search");
    if (!loading) return;

    const obs = new OBSWebSocket();
    setObs(obs);
    await obs
      .connect(`ws:${ip}:4455`)
      .catch(console.log)
      .then(() => setLoading(false));

    const results = await obs
      .callBatch([
        {
          requestType: "GetStreamStatus",
        },
        {
          requestType: "GetSceneList",
        },
        {
          requestType: "GetStreamServiceSettings",
        },
      ])
      .then((res) => res);

    const streamStatus = results[0]
      .responseData as OBSResponseTypes["GetStreamStatus"];

    setStreamStatus(streamStatus.outputActive);

    const sceneList = results[1]
      .responseData as OBSResponseTypes["GetSceneList"];

    setSceneList(
      sceneList.scenes.map((el) => el.sceneName).reverse() as string[]
    );

    setCurrnetScene(sceneList.currentProgramSceneName);

    const streamServiceSettings = results[2]
      .responseData as OBSResponseTypes["GetStreamServiceSettings"];

    setStatusStreamServiceSettings(streamServiceSettings);

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
          <Heading size="md">{ip}</Heading>
          <ChangeServerUrl
            obs={obs}
            streamServiceSettings={StreamServiceSettings}
          />
          <ChangeServerKey
            obs={obs}
            streamServiceSettings={StreamServiceSettings}
          />
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
