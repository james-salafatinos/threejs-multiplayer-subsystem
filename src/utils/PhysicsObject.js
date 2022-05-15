import * as THREE from "/modules/three.module.js";

class PhysicsObject {
  constructor(m, x, y, z, offset, ivx = 0, ivy = 0, ivz = 0, density = 1) {
    this.mass = m;
    this.pos = new THREE.Vector3(x, y, z);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(ivx, ivy, ivz);
    this.gravity = 0.000001;
    this.dirVector = new THREE.Vector3();
    this.mesh;

    this.tail = null;
    this.tail_length = 25;
    this.tail_history = [];
    this.tail_geometry = null;
    this.tail_material = null;

    this.lookDir;
    this.hasBeenRaycast;
    this.offset = offset;
    this.density = density;
    this.isStationary = false;
  }
  Sphere() {
    let mat = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: false,
      depthTest: true,

      side: THREE.DoubleSide,
    });
    let geo = new THREE.IcosahedronGeometry(this.mass * (1 / this.density), 3);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.position.x = this.pos.x;
    mesh.position.y = this.pos.y;
    mesh.position.z = this.pos.z;
    mesh.userData.offset = this.offset;

    mesh.geometry.scale(4, 4, 4);
    this.mesh = mesh;
    return this.mesh;
  }

  addTail() {
    this.MAX_POINTS = 25;
    this.tail_geometry = new THREE.BufferGeometry();
    var positions = new Float32Array(this.MAX_POINTS * 3); // 3 vertices per point
    this.tail_geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    this.tail_positions = this.tail_geometry.attributes.position.array;
    this.tail_material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    this.tail = new THREE.LineSegments(this.tail_geometry, this.tail_material);

    for (var i = 0; i < this.MAX_POINTS; i++) {
      positions[i] = Math.random() * 10;
      positions[i + 1] = Math.random() * 10;
      positions[i + 2] = Math.random() * 10;
    }
    return this.tail;
  }
  updateTail() {
    //console.log(this.tail_positions)
    for (var i = 0; i < this.MAX_POINTS; i++) {
      this.tail_positions[i] = this.pos.x;
      this.tail_positions[i + 1] = this.pos.y;
      this.tail_positions[i + 2] = this.pos.z;

      this.tail_positions[i + 3] = this.pos.x + this.velocity.x * 100;
      this.tail_positions[i + 4] = this.pos.y + this.velocity.y * 100;
      this.tail_positions[i + 5] = this.pos.z + this.velocity.z * 100;
    }
    // this.tail_positions[3] +=.01
  }
  updateGeometry() {
    // console.log(this.pos)

    if (this.isStationary) {
      return null;
    }
    this.mesh.position.x = this.pos.x;
    this.mesh.position.y = this.pos.y;
    this.mesh.position.z = this.pos.z;

    if (this.mesh.userData.hasBeenRaycast) {
      this.mesh.material.color = new THREE.Color(`hsl(${50}, 100%, 100%)`);
    } else {
      this.mesh.material.color = new THREE.Color(
        `hsl(${200 - -1 * this.velocity.length() * 10 ** 3.2}, 100%, 50%)`
      );
    }
  }

  // Mover applyForce
  applyForce(force) {
    let a = force.clone();
    a = a.clone().divideScalar(this.mass);
    this.acceleration.add(a);
  }

  constrain(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  getUnitVectorTo(otherObject) {
    var dir = new THREE.Vector3(); // create once an reuse it
    dir.subVectors(this.pos, otherObject.pos).normalize();

    return dir;
  }

  getDistanceTo(otherObject) {
    var distance = this.pos.distanceTo(otherObject.pos);
    return distance;
  }

  attract(otherObject) {
    let vec = this.pos.clone().sub(otherObject.pos.clone()).normalize();
    let distance = this.pos.clone().distanceTo(otherObject.pos.clone());
    distance = this.constrain(distance, 2, 5);
    let strength =
      (this.gravity * this.mass * otherObject.mass) / (distance * distance);
    let force = vec.clone().multiplyScalar(strength);
    force.multiplyScalar(-1);
    return force;
  }

  updatePhysics() {
    this.velocity.add(this.acceleration.clone());
    this.pos.add(this.velocity.clone());
    this.acceleration.multiplyScalar(0);
  }
}

export { PhysicsObject };
