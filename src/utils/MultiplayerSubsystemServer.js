class MultiplayerSubsystemServer {
  constructor(server) {
    this.gameState = {};
    this.io = require("socket.io")(server, {
      cors: {
        origin: "http://localhost:3000",
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
            };
          }

          console.log(parent.gameState);
          socket.broadcast.emit(`PlayerPositions`, parent.gameState);

          //   //Handshake
          //   socket.broadcast.emit(`PlayerStateFromServer`, socket.id);
        }
      });

      socket.on("disconnect", function () {
        console.log("Client ", socket.id, " has disconnected");
      });
    });
  }
}

// export { MultiplayerSubsystemServer };
exports.MultiplayerSubsystemServer = MultiplayerSubsystemServer;
