import * as THREE from "/modules/three.module.js";

class MultiplayerGameInterface {
  constructor(scene, camera, MultiplayerSubsystemClientHandler) {
    this.scene = scene;
    this.camera = camera;
    this.MultiplayerSubsystemClientHandler = MultiplayerSubsystemClientHandler;

    this.GameMeshState = {};

    this.player;
    // this.PlayerMeshes = [];
    this.playerState = {};
  }

  CheckForNewPlayersAndAddThemOrUpdatePositions() {
    if (this.MultiplayerSubsystemClientHandler.gameState != undefined) {
      // console.log("check", this.MultiplayerSubsystemClientHandler.gameState);

      let listOfSocketIDs = Object.keys(
        //ServerGameState
        this.MultiplayerSubsystemClientHandler.gameState
      );

      let listOfDisconnectedSocketIDs =
        this.MultiplayerSubsystemClientHandler.disconnected_ids;

      for (let i = 0; i < listOfSocketIDs.length; i++) {
        //checking in
        const element = listOfSocketIDs[i];
        // console.log(element);

        //
        if (element in this.GameMeshState) {
          // console.log("TRUE");

          if (element != this.MultiplayerSubsystemClientHandler.socket.id) {
            this.GameMeshState[element].position.x =
              this.MultiplayerSubsystemClientHandler.gameState[element].x;
            this.GameMeshState[element].position.y =
              this.MultiplayerSubsystemClientHandler.gameState[element].y;
            this.GameMeshState[element].position.z =
              this.MultiplayerSubsystemClientHandler.gameState[element].z;

            // console.log(
            //   "CAMERA LOOK VEC",
            //   this.MultiplayerSubsystemClientHandler.gameState[element]
            //     .cameraLookVec
            // );
            this.GameMeshState[element].lookAt(
              this.MultiplayerSubsystemClientHandler.gameState[element]
                .cameraLookVec.x +
                this.MultiplayerSubsystemClientHandler.gameState[element].x,
              this.MultiplayerSubsystemClientHandler.gameState[element]
                .cameraLookVec.y +
                this.MultiplayerSubsystemClientHandler.gameState[element].y,
              this.MultiplayerSubsystemClientHandler.gameState[element]
                .cameraLookVec.z +
                this.MultiplayerSubsystemClientHandler.gameState[element].z
            );
          }
          if (element == this.MultiplayerSubsystemClientHandler.socket.id) {
            this.GameMeshState[element].position.x = this.camera.position.x;
            this.GameMeshState[element].position.y = this.camera.position.y;
            this.GameMeshState[element].position.z = this.camera.position.z;
            this.GameMeshState[element].material.visible = false;
            this.GameMeshState[element].children[0].material.visible = false;
            this.GameMeshState[element].children[1].material.visible = false;
            // console.log(this.GameMeshState[element]);
          }
        } else {
          console.log("ADDING PLAYER");
          this.GameMeshState[element] = this.createPlayer();
        }
      }

      // console.log("DISCONNECTED IDS", listOfDisconnectedSocketIDs);
      for (let i = 0; i < listOfDisconnectedSocketIDs.length; i++) {
        //checking in
        const element = listOfDisconnectedSocketIDs[i];
        // console.log("DISCONNECTED ID ELEMENT", element);
        // console.log("To be removed", this.GameMeshState[element]);
        this.scene.remove(this.GameMeshState[element]);
        // if (element in this.GameMeshState) {
        //   console.log(
        //     "To be removed",
        //     this.MultiplayerSubsystemClientHandler.gameState[element]
        //   );
        //   this.scene.remove(
        //     this.MultiplayerSubsystemClientHandler.gameState[element]
        //   );
        // }
      }
    }
  }

  createPlayer() {
    //Three.js
    let mat = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: false,
      depthTest: true,
      side: THREE.DoubleSide,
      color: new THREE.Color(0x004ea1),
    });

    let mat2 = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: false,
      depthTest: true,
      side: THREE.DoubleSide,
      color: new THREE.Color(0x51dbe8),
    });
    let geo = new THREE.BoxGeometry(10, 10, 10);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = this.camera.position.x;
    mesh.position.y = this.camera.position.y;
    mesh.position.z = this.camera.position.z;

    let sphereGeo = new THREE.SphereGeometry(2, 10, 10);
    let sphereMesh = new THREE.Mesh(sphereGeo, mat2);
    sphereMesh.position.x = this.camera.position.x + 3;
    sphereMesh.position.y = this.camera.position.y + 2.5;
    sphereMesh.position.z = this.camera.position.z + 5;

    let sphereGeo2 = new THREE.SphereGeometry(2, 10, 10);
    let sphereMesh2 = new THREE.Mesh(sphereGeo2, mat2);
    sphereMesh2.position.x = this.camera.position.x - 3;
    sphereMesh2.position.y = this.camera.position.y + 2.5;
    sphereMesh2.position.z = this.camera.position.z + 5;

    mesh.attach(sphereMesh);
    mesh.attach(sphereMesh2);
    // sphereMesh.add(mesh);
    // mesh.add(sphereMesh);
    this.scene.add(mesh);

    // this.player = mesh;
    // this.PlayerMeshes.push(mesh);
    console.log("Player Mesh added to scene,", this.player);
    return mesh;
  }

  cameraLookDir(camera) {
    var vector = new THREE.Vector3(0, 0, -1);
    vector.applyEuler(camera.rotation, camera.rotation.order);
    return vector;
  }

  updatePlayerState() {
    //DO NOT TOUCH
    this.playerState = {
      socket_id: this.MultiplayerSubsystemClientHandler.socket.id,
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
      cameraLookVec: this.cameraLookDir(this.camera),
    };
  }

  // updatePlayerMesh() {
  //   this.player.position.x = this.camera.position.x;
  //   this.player.position.y = this.camera.position.y;
  //   this.player.position.z = this.camera.position.z;
  // }

  updatePlayerMeshes() {
    for (let i = 0; i < PlayerMeshes.length; i++) {
      const element = listOfSocketIDs[i];
      let positions = this.MultiplayerSubsystemClientHandler.gameState[element];
      console.log("POSITIONS", positions);
    }
  }

  updateOtherPlayersMesh() {
    let listOfSocketIDs = Object.keys(
      this.MultiplayerSubsystemClientHandler.gameState
    );
    // console.log(listOfSocketIDs);
    for (let index = 0; index < listOfSocketIDs.length; index++) {
      const element = listOfSocketIDs[index];
      let positions = this.MultiplayerSubsystemClientHandler.gameState[element];
      console.log("POSITIONS", positions);

      this.player.position.x = this.camera.position.x;
      this.player.position.y = this.camera.position.y;
      this.player.position.z = this.camera.position.z;
    }

    // for (let i = 0; i < )
    // if (this.MultiplayerSubsystemClientHandler.socket.id)
  }
}

export { MultiplayerGameInterface };
