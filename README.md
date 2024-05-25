# Remote camera pc

### Get started

A project for remote access to computers on a local network to manage multiple computers using obs based on obs Web Sockets.

To use it, you need to launch the site from the `main` branch on the local network

```bash
#node.js
npm i

npm run build

npm start
```

Then you need to install and run the JS server from the `detect-server` branch on your computer with the obs you want to manage.

```bash
#node.js
npm i

node server.js
```

On the same computer, you need to enable the Web Sockets server and remove authorization.

**All computers and servers must be on the same local network!!!**

### Currently available:

- Search for devices on the local network
- Preview the current image
- Show statistics
- Switching scenes
- Start and stop stream
- A page with display and management of all available devices
