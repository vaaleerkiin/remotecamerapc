const http = require("http");
const url = require("url");
const os = require("os");
const net = require("net");

function findFreePort(beg, ...rest) {
  const p = rest.slice(0, rest.length - 1),
    cb = rest[rest.length - 1];
  let [end, ip, cnt] = Array.from(p);
  if (!ip && end && !/^\d+$/.test(end)) {
    ip = end;
    end = 65534;
  } else {
    if (end == null) {
      end = 65534;
    }
  }
  if (cnt == null) {
    cnt = 1;
  }

  const retcb = cb;
  const res = [];
  const probe = function (ip, port, cb) {
    const s = net.createConnection({ port: port, host: ip });
    s.on("connect", function () {
      s.end();
      cb(null, port + 1);
    });
    s.on("error", (err) => {
      cb(port);
    });
  };
  var onprobe = function (port, nextPort) {
    if (port) {
      res.push(port);
      if (res.length >= cnt) {
        retcb(null, ...res);
      } else {
        setImmediate(() => probe(ip, port + 1, onprobe));
      }
    } else {
      if (nextPort >= end) {
        retcb(new Error("No available ports"));
      } else {
        setImmediate(() => probe(ip, nextPort, onprobe));
      }
    }
  };
  return probe(ip, beg, onprobe);
}

function findFreePortPmfy(beg, ...rest) {
  const last = rest[rest.length - 1];
  if (typeof last === "function") {
    findFreePort(beg, ...rest);
  } else {
    return new Promise((resolve, reject) => {
      findFreePort(beg, ...rest, (err, ...ports) => {
        if (err) reject(err);
        else resolve(ports);
      });
    });
  }
}

(async () => {
  const [port] = await findFreePortPmfy(3000);

  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === "/api/connect-obs") {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000,

        "Content-Type": "application/json",
      };
      //   res.setHeader("Content-Type", "application/json");

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

        const responseData = {
          ip: localIp,
          mac: macAddress,
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
