class MultiplayerSubsystemServer {
  constructor(server) {
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
    this.io.sockets.on("connection", function (socket) {
      console.log("We have a new client: " + socket.id);
      socket.broadcast.emit(`handshake`, socket.id);

      socket.on("MouseFromClient", function (data) {
        console.log("Received: 'MouseFromClient' " + data.x + " " + data.y);

        //parseMouseFromClientToMouseFromServer{
        //WORK WORK WORK on MouseFromClient
        //}
        socket.broadcast.emit("MouseFromServer", data);
      });

      socket.on("MsgFromClient", function (msg) {
        socket.broadcast.emit("MsgFromServer", msg);
      });

      socket.on("PlayerState", function (data) {
        if (data != null) {
          console.log("Received: 'PlayerState'", data);
          socket.broadcast.emit(`PlayerStateFromServer ${socket.id}`, data);
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
