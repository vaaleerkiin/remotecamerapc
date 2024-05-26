"use client";

import { redirect } from "next/navigation";
import OBSWebSocket, { OBSResponseTypes } from "obs-websocket-js";
import { useEffect, useState } from "react";
import { Container, Heading, Tooltip } from "@chakra-ui/react";
import { SceneChange } from "./SceneChange";
import { ToogleStream } from "./ToogleStream";
import { Viewer } from "./Viewer";
import { Stats } from "./Stats";
import { ChangeServerUrl } from "./ChangeServerUrl";
import { ChangeServerKey } from "./ChangeServerKey";
import { Modal } from "./Modal";

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
    if (!ip) redirect("/search");
    Handlers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip]);

  const Handlers = async () => {
    if (!loading) return;

    const obs = new OBSWebSocket();
    setObs(obs);
    await obs
      .connect(`ws:${ip}:4455`)
      .catch(console.log)
      .then(() => setLoading(false));

    const results = await obs.callBatch([
      {
        requestType: "GetStreamStatus",
      },
      {
        requestType: "GetSceneList",
      },
      {
        requestType: "GetStreamServiceSettings",
      },
    ]);

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

    obs.on("StreamStateChanged", (e) => {
      setStreamStatus(e.outputActive);
    });

    obs.on("CurrentProgramSceneChanged", (e) => {
      setCurrnetScene(e.sceneName);
    });

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
          <Viewer
            obs={obs}
            currnetScene={currnetScene}
            streamStatus={streamStatus}
          />
          <SceneChange
            obs={obs}
            sceneList={sceneList}
            currnetScene={currnetScene}
          />
          <ToogleStream obs={obs} streamStatus={streamStatus} />

          <Modal
            disabled={streamStatus || false}
            header={<Heading size="md">{ip}</Heading>}
            buttonText="Credentials"
            tooltipLabel="Cannot be changed during broadcast"
          >
            <ChangeServerUrl
              obs={obs}
              streamServiceSettings={StreamServiceSettings}
            />
            <ChangeServerKey
              obs={obs}
              streamServiceSettings={StreamServiceSettings}
            />
          </Modal>

          <Stats obs={obs} />
        </Container>
      )}
    </>
  );
};
