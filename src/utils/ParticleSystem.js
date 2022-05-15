import * as THREE from '/modules/three.module.js';
class ParticleSystem {
    constructor(scene) {
        this.scene = scene
        this.vertices = []
        this.velocities = []
        this.geometry = new THREE.BufferGeometry();
        this.particles = null

        THREE.Vector3.prototype.randomUnitVector = function () {
            this.x = Math.random() * 2 - 1;
            this.y = Math.random() * 2 - 1;
            this.z = Math.random() * 2 - 1;
            this.normalize();
            return this;
        }

        this.V1 = new THREE.Vector3()
        this.V2 = new THREE.Vector3()


    }



    createParticles(_x, _y, _z) {
        this.vertices = []
        this.velocities = []
        let M = 4
        let N = 4
        for (let x = -M; x <= M; x += 1) {
            for (let z = -N; z <= N; z += 1) {
                // vertices.push(x / scaler, 0 / scaler, z / scaler)

                let v = this.V1.randomUnitVector()

                //Vertices setup
                this.vertices.push(
                    _x,
                    _y,
                    _z
                )
                //velocities setup
              
                this.velocities.push(v.x, v.y, v.z)
            }
        }

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3));
        let material = new THREE.PointsMaterial({ size: .7, sizeAttenuation: true, alphaTest: 0.2, transparent: false });
        
        let mat_color = new THREE.Color("hsl(60, 82%, 56%)");
        material.color = mat_color
        
        this.particles = new THREE.Points(this.geometry, material);
        this.scene.add(this.particles);


        // setTimeout(()=>{
        //     this.scene.remove(this.particles)
        //     this.vertices = []
        //     this.velocities = []
        //     this.geometry = new THREE.BufferGeometry();
        //     this.particles = null
        //     // this.geometry.dispose();
        //     // this.material.dispose();
        // }, 2000)
    }

    updateParticles() {

        let gravity = 0.02

        for (let iter = 0; iter <= this.vertices.length; iter += 3) {
            this.velocities[iter + 1] -= gravity

            //console.log("updating particles!!")
            this.geometry.attributes.position.array[iter] += this.velocities[iter]
            this.geometry.attributes.position.array[iter + 1] += this.velocities[iter + 1]
            this.geometry.attributes.position.array[iter + 2] += this.velocities[iter + 2]

        }
        this.geometry.attributes.position.needsUpdate = true;
    }

}




export { ParticleSystem }