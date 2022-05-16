import * as THREE from "/modules/three.module.js";

class MultiplayerGameInterface {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.player;
    this.playerState = {};
  }

  createPlayer() {
    //Three.js
    let mat = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    let geo = new THREE.BoxGeometry(1, 1, 1);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = this.camera.position.x;
    mesh.position.y = this.camera.position.y;
    mesh.position.z = this.camera.position.z;

    this.scene.add(mesh);
    this.player = mesh;
  }

  updatePlayerState() {
    this.playerState = {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
    };
  }
}

export { MultiplayerGameInterface };
