const OBSWebSocket = require("obs-websocket-js").default;
const http = require("http");
const url = require("url");
const os = require("os");
const port = 3033;

(async () => {
  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
      "Access-Control-Max-Age": 2592000,

      "Content-Type": "application/json",
    };
    if (parsedUrl.pathname === "/api/connect-obs") {
      if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
      }
      if (["GET", "POST"].indexOf(req.method) > -1) {
        res.writeHead(200, headers);

        const networkInterfaces = os.networkInterfaces();

        let localIp = "";
        let macAddress = "";

        Object.keys(networkInterfaces).forEach((key) => {
          networkInterfaces[key].forEach((iface) => {
            if (
              !iface.internal &&
              iface.family === "IPv4" &&
              !iface.address.startsWith("127") &&
              !iface.address.startsWith("fe80")
            ) {
              localIp = iface.address;
              macAddress = iface.mac.toUpperCase();
            }
          });
        });

        const obs = new OBSWebSocket();
        await obs.connect(`ws://${localIp}:4455`);
        const isRecording = await obs
          .call("GetStreamStatus")
          .then((res) => res.outputActive);
        await obs.disconnect();

        const responseData = {
          ip: localIp,
          mac: macAddress,
          isRecording,
        };

        res.end(JSON.stringify(responseData));
        return;
      }
    } else {
      res.writeHead(405, headers);
      res.end(`${req.method} is not allowed for the request.`);
    }
  });

  server.listen(port, () => {
    console.log(`Сервер чекає на з'єднання на порті: ${port}`);
  });
})();
