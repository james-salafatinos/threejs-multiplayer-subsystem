class MultiplayerSubsystemClient {
  constructor(io) {
    this.io = io;
    this.socket = this.io.connect(
      // "https://multiplayer-xpzpk.ondigitalocean.app/"
      // "http://localhost:8080/"
      window.location.href
    );
    this.gameState = null;
    this.disconnected_ids = [];
    this.LastGameState = null;
    var parent = this;
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
        // console.log("Player Position Data From Server Received:", data);
        parent.LastGameState = parent.gameState;
        parent.gameState = data;
      }
    );

    this.socket.on(
      "PlayerDisconnect",
      // When we receive data
      function (disconnected_socket_id) {
        console.log(
          "Player Disconnect Data From Server Received:",
          disconnected_socket_id
        );
        parent.disconnected_ids.push(disconnected_socket_id);
        console.log("parent IDS", parent.disconnected_ids);
        delete parent.gameState[disconnected_socket_id];
      }
    );
  }

  emit(name, data) {
    this.socket.emit(name, data);
  }
}

export { MultiplayerSubsystemClient };
