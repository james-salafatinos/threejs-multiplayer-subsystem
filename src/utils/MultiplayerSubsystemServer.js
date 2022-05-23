class MultiplayerSubsystemServer {
  constructor(server) {
    this.gameState = {};
    this.io = require("socket.io")(server, {
      cors: {
        // origin: "https://multiplayer-xpzpk.ondigitalocean.app/",
        // origin: "http://localhost:8080",
        origin:
          process.env.ENVIRONMENT == "DEV"
            ? "http://localhost:8080"
            : "https://multiplayer-xpzpk.ondigitalocean.app/",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        credentials: true,
      },
      allowEIO3: true,
    });
  }
  listen() {
    let parent = this;

    this.io.sockets.on("connection", function (socket) {
      console.log("We have a new client: " + socket.id);

      socket.broadcast.emit(`handshake`, socket.id);

      socket.on("PlayerState", function (data) {
        if (data != null) {
          // console.log("Received: 'PlayerState'", data);

          if (data.socket_id != undefined) {
            parent.gameState[data.socket_id] = {
              x: data.x,
              y: data.y,
              z: data.z,
              cameraLookVec: data.cameraLookVec,
            };
          }

          // console.log(parent.gameState);
          socket.broadcast.emit(`PlayerPositions`, parent.gameState);

          //   //Handshake
          //   socket.broadcast.emit(`PlayerStateFromServer`, socket.id);
        }
      });

      socket.on("disconnect", function () {
        console.log("Client ", socket.id, " has disconnected");
        // console.log(parent.gameState);
        socket.broadcast.emit(`PlayerDisconnect`, socket.id);
        // console.log(parent.gameState[socket.id]);
        delete parent.gameState[socket.id];
        console.log("Client ", socket.id, " has been deleted from gameState");
      });
    });
  }
}

// export { MultiplayerSubsystemServer };
exports.MultiplayerSubsystemServer = MultiplayerSubsystemServer;
