import OBSWebSocket from "obs-websocket-js";

let obs: OBSWebSocket;

export const connectWebSocket = async (ip: any) => {
  if (typeof ip !== "string") return;

  const obsws = new OBSWebSocket();
  obs = obsws;
  await obsws.connect(`ws:${ip}:4455`).catch(console.log);
  return obs;
};
export const getOBSWebSocket = () => {
  if (!obs) return;
  return obs;
};

export const disconnectWebSocket = async () => {
  if (!obs) return;
  return await obs.disconnect();
};

export const GetStreamStatus = async (obs: OBSWebSocket) => {
  if (!obs) return;
  return await obs.call("GetStreamStatus");
};
