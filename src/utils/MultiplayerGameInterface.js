import * as THREE from "/modules/three.module.js";

class MultiplayerGameInterface {
  constructor(scene, camera, MultiplayerSubsystemClientHandler) {
    this.scene = scene;
    this.camera = camera;
    this.MultiplayerSubsystemClientHandler = MultiplayerSubsystemClientHandler;
    this.player;
    this.playerState = {};
  }

  createPlayer() {
    //Three.js
    let mat = new THREE.MeshPhongMaterial({
      wireframe: true,
      transparent: false,
      depthTest: true,
      side: THREE.DoubleSide,
    });
    let geo = new THREE.BoxGeometry(50, 50, 50);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = this.camera.position.x;
    mesh.position.y = this.camera.position.y;
    mesh.position.z = this.camera.position.z;

    this.scene.add(mesh);
    this.player = mesh;
    console.log("Player Mesh added to scene,", this.player);
  }

  updatePlayerState() {
    this.playerState = {
      socket_id: this.MultiplayerSubsystemClientHandler.socket.id,
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
    };
  }

  updatePlayerMesh() {
    this.player.position.x = this.camera.position.x;
    this.player.position.y = this.camera.position.y;
    this.player.position.z = this.camera.position.z;
  }

  updateOtherPlayersMesh() {
    console.log(this.MultiplayerSubsystemClientHandler.gameState);
  }
}

export { MultiplayerGameInterface };
