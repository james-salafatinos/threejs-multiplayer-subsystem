class MultiplayerSubsystemClient {
  constructor(io) {
    this.io = io;
    this.socket = this.io.connect("http://localhost:3000");

    this.socket.on(
      "MouseFromServer",
      // When we receive data
      function (data) {
        console.log(
          "MouseFromServerReceived: " + data.x + " " + data.y + " " + data.z
        );
      }
    );
    this.socket.on(
      "msg",
      // When we receive data
      function (data) {
        console.log("MsgFromServerReceived:", data);
      }
    );
  }

  emit(name, data) {
    this.socket.emit(name, data);
  }
}

export { MultiplayerSubsystemClient };
