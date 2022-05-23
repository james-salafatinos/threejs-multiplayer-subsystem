//External Libraries
import * as THREE from "/modules/three.module.js";
import Stats from "/modules/stats.module.js";
//Internal Libraries
import { NoClipControls } from "/utils/NoClipControls.js";
import { TerrainGenerator } from "/utils/TerrainGenerator.js";
//CDN
// import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { io } from "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.esm.min.js";
import { MultiplayerSubsystemClient } from "../utils/MultiplayerSubsystemClient.js";
import { MultiplayerGameInterface } from "../utils/MultiplayerGameInterface.js";
//THREE JS
let camera, scene, renderer, composer, controls;
let stats;
//Required for NOCLIPCONTROLS
let prevTime = performance.now();
let physicsObjects = [];
let frameIndex = 0;
let labelRenderer;
// let iFrame
let cameraLookDir;
let updatePositionForCamera;
let collisions;
// let SS;
let SS_Array = [];
let AL;
let PS;
let SKYDOME;
let label_meshes = [];

let MultiplayerSubsystemClientHandler;
let MultiplayerGameInterfaceHandler;

let sendmouse;
var socket;

let player;
let players = [];
let otherPlayer;

let MAP = new THREE.TextureLoader();
init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL(0.6, 0.9, 0.9);
  scene.fog = new THREE.Fog(0xffffff, 1, 5000);

  //Create three.js stats
  stats = new Stats();
  container.appendChild(stats.dom);

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  //   LIGHTS;
  let dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 500, 0);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 512;
  dirLight.shadow.mapSize.height = 512;
  dirLight.shadow.camera.top = 512;
  dirLight.shadow.camera.left = -512;
  dirLight.shadow.camera.right = 512;
  dirLight.shadow.camera.bottom = -512;
  dirLight.shadow.camera.near = 0.5; // default
  dirLight.shadow.camera.far = 10000; // default

  const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
  scene.add(dirLightHelper);

  scene.add(dirLight);

  //Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 60;
  camera.position.z = 120;
  camera.position.x = 0;

  cameraLookDir = function (camera) {
    var vector = new THREE.Vector3(0, 0, -1);
    vector.applyEuler(camera.rotation, camera.rotation.order);
    return vector;
  };

  //NO CLIP CONTROLS
  controls = new NoClipControls(scene, window, camera, document);

  MultiplayerSubsystemClientHandler = new MultiplayerSubsystemClient(io);
  MultiplayerGameInterfaceHandler = new MultiplayerGameInterface(
    scene,
    camera,
    MultiplayerSubsystemClientHandler
  );

  function mouseDragged() {
    //Crosshair
    cameraLookDir = function (camera) {
      var vector = new THREE.Vector3(0, 0, -1);
      vector.applyEuler(camera.rotation, camera.rotation.order);
      return vector;
    };
    let __x = camera.position.x + 2 * cameraLookDir(camera).x;
    let __y = camera.position.y + 2 * cameraLookDir(camera).y;
    let __z = camera.position.z + 2 * cameraLookDir(camera).z;

    sendmouse(__x, __y, __z);
  }

  // Function for sending to the socket
  sendmouse = function (xpos, ypos, zpos) {
    // We are sending!
    // console.log("sendmouse()FromClient: " + xpos + " " + ypos + " " + zpos);

    // Make a little object with  and y
    var data = {
      x: xpos,
      y: ypos,
      z: zpos,
    };

    // Send that object to the socket
    // socket.emit("MouseFromClient", data);
    MultiplayerSubsystemClientHandler.emit("MouseFromClient", data);
  };

  let createStars = function () {
    let M = 48;
    let N = 48;
    let vertices = [];
    for (let x = -M; x <= M; x += 1) {
      for (let z = -N; z <= N; z += 1) {
        // vertices.push(x / scaler, 0 / scaler, z / scaler)

        let rx = THREE.MathUtils.randFloatSpread(2000);
        let ry = THREE.MathUtils.randFloatSpread(2000) + 1100;
        let rz = THREE.MathUtils.randFloatSpread(2000);
        vertices.push(rx, ry, rz);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    let material = new THREE.PointsMaterial({
      size: 0.7,
      sizeAttenuation: true,
      alphaTest: 0.2,
      transparent: true,
    });
    material.color.setHSL(0.6, 0.8, 0.9);
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
  };
  createStars();

  window.addEventListener("mousemove", () => {
    mouseDragged(3, 2, 5);
    // sendmouse();
  });

  //   loadImage("texture1.png", 0, 60, 0, 50);

  let terrain = new TerrainGenerator(scene);
  terrain.create();
  console.log(terrain);

  updatePositionForCamera = function (camera, myObject3D) {
    // fixed distance from camera to the object
    var dist = 100;
    var cwd = new THREE.Vector3();

    camera.getWorldDirection(cwd);

    cwd.multiplyScalar(dist);
    cwd.add(camera.position);

    myObject3D.position.set(cwd.x, cwd.y, cwd.z);
    myObject3D.setRotationFromQuaternion(camera.quaternion);
  };
}

function animate() {
  //Frame Start up
  requestAnimationFrame(animate);

  const time = performance.now();

  //   if (frameIndex % 5 == 0) {
  //     collisions.checkCollisions();
  //   }

  if (frameIndex % 3 == 0) {
    MultiplayerGameInterfaceHandler.updatePlayerState();
    MultiplayerSubsystemClientHandler.emit(
      "PlayerState",
      MultiplayerGameInterfaceHandler.playerState
    );
    // MultiplayerGameInterfaceHandler.updatePlayerMesh();
    // MultiplayerGameInterfaceHandler.updateOtherPlayersMesh();
    MultiplayerGameInterfaceHandler.CheckForNewPlayersAndAddThemOrUpdatePositions();
  }

  controls.update(time, prevTime);
  renderer.render(scene, camera);
  stats.update();

  //Frame Shut Down
  prevTime = time;
  frameIndex++;
}
