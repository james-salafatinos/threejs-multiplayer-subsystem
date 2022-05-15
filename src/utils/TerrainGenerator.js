import * as THREE from "/modules/three.module.js";

class TerrainGenerator {
  constructor(scene) {
    this.scene = scene;
  }
  create() {
    const geo_landscape = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100);

    let disMap = new THREE.TextureLoader()
      .setPath("/static/")
      .load("heightmap1.png");

    let aMap = new THREE.TextureLoader()
      .setPath("/static/")
      .load("alphamap5.png");
    // .load('alphamap4.png')

    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    disMap.repeat.set(1, 1);

    aMap.wrapS = aMap.wrapT = THREE.RepeatWrapping;
    aMap.repeat.set(1, 1);
    const mat_landscape = new THREE.MeshPhongMaterial({
      color: 0x6a788f,
      wireframe: false,
      transparent: false,
      depthWrite: true,
      depthTest: true,
      //map: disMap,
      // map: disM
      //   alphaMap: aMap,
      displacementMap: disMap,
      displacementScale: 100,
    });

    const matWire_landscape = new THREE.MeshPhongMaterial({
      color: 0x000000,
      wireframe: true,
      displacementMap: disMap,
      depthWrite: true,
      depthTest: true,
      transparent: false,
      //   alphaMap: aMap,
      displacementScale: 100,
    });
    let groundMesh = new THREE.Mesh(geo_landscape, mat_landscape);
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.5;

    let groundMesh2 = new THREE.Mesh(geo_landscape, matWire_landscape);
    groundMesh2.receiveShadow = true;
    this.scene.add(groundMesh2);
    groundMesh2.rotation.x = -Math.PI / 2;
    groundMesh2.position.y = -0.5;
  }
}

export { TerrainGenerator };
