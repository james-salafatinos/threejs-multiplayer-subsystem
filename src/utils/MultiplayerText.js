import * as THREE from "/modules/three.module.js";

class MultiplayerText {
  constructor(window, scene, camera, MultiplayerSubsystemClientHandler) {
    this.scene = scene;
    this.camera = camera;
    this.MultiplayerSubsystemClientHandler = MultiplayerSubsystemClientHandler;

    window.addEventListener("keydown", (event) => {
      this.lock();
      switch (event.code) {
        case "KeyT":
          console.log("pressing t");
          break;
      }
    });
  }
}

export { MultiplayerText };
