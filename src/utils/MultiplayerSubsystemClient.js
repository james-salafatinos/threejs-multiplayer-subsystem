class MultiplayerSubsystemClient {
  constructor(io) {
    this.io = io;
    this.socket = this.io.connect("http://localhost:3000");
    this.gameState = null;
    var parent = this;
    // this.socket_id;

    // this.socket.on(
    //   "MouseFromServer",
    //   // When we receive data
    //   function (data) {
    //     console.log(
    //       "MouseFromServerReceived: " + data.x + " " + data.y + " " + data.z
    //     );
    //   }
    // );

    this.socket.on(
      "handshake",
      // When we receive data
      function (data) {
        console.log("handshake", data);
        // this.socket_id = data;
      }
    );

    this.socket.on(
      "PlayerPositions",
      // When we receive data
      function (data) {
        console.log("Player Position Data From Server Received:", data);
        parent.gameState = data;
      }
    );
  }

  emit(name, data) {
    this.socket.emit(name, data);
  }
}

export { MultiplayerSubsystemClient };
