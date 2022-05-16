import * as THREE from "/modules/three.module.js";

class MultiplayerObject {
  constructor(name) {
    this.name = name;
  }

  register(socket) {
    socket.emit("RegisterMultiplayerObject", this.name);
    socket.on(`RegisteredMultiplayerObject::${this.name}`, function (data) {
      console.log(
        "Received Confirmation That RegisteredMultiplayerObject:",
        data
      );
    });
  }
}

export { MultiplayerObject };
