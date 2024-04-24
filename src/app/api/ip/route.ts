import os from "os";

export async function GET() {
  const networkInterfaces = os.networkInterfaces();
  let localIp = "";
  let macAddress = "";

  Object.keys(networkInterfaces).forEach((key) => {
    networkInterfaces[key]!.forEach((iface) => {
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
  return Response.json(localIp);
}
