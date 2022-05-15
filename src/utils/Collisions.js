

import { ParticleSystem } from "/utils/ParticleSystem.js";
import * as THREE from '/modules/three.module.js';
class Collisions {
    constructor(scene, camera, SS_Array, PS) {
        this.scene = scene
        this.camera = camera
        this.SS_Array = SS_Array
        this.entered = false;
        // this.AL = AL //Audio Listener
        this.PS = PS //ParticleSystem
        this.createdFrame = false;
        this.yellow_color = new THREE.Color("hsl(60, 82%, 56%)");
       
        
    }

    checkCollisions() {
        for (let i = 0; i < this.SS_Array.length; i++) {

            let distance_vec = this.camera.position.clone().sub(this.SS_Array[i].mesh.position.clone())
            let distance_mag = distance_vec.length()

            if (distance_mag < 50) {
                let ss = this.SS_Array[i]
                if (this.SS_Array[i].isPlaying) {
                } else {

                    // let selection = parseInt(Math.round(Math.random()*this.SS_Array.length))
                    let selection = parseInt(Math.round(Math.random() * 71))
                    console.log("Selection", selection)


                    ss.createFrame(selection, ss.mesh.position.x, ss.mesh.position.y, ss.mesh.position.z)

                    ss.mesh.material.wireframe = false;
                    let ssl = this.SS_Array[i].light
                    ssl.color = this.yellow_color

                    this.PS.createParticles(ss.mesh.position.x, ss.mesh.position.y, ss.mesh.position.z)

                }
                this.entered = true
            }


            if (distance_mag < 200) {
                let ss = this.SS_Array[i]
                if (this.SS_Array[i].isLit) {
                    let ssl = this.SS_Array[i].light
                    ssl.intensity += 2
                } else {
                    ss.createLight()
                    this.SS_Array[i].isLit = true;
                }
                this.entered = true
            } else {
                if (this.SS_Array[i].isLit) {
                    let ssl = this.SS_Array[i].light
                    ssl.intensity -= 20
                    // this.PS.destroyParticles()
                }
            }
        }
    }
}





export { Collisions }