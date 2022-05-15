import * as THREE from '/modules/three.module.js';

class AudioListener {
    constructor(scene, camera) {
        this.scene = scene
        this.camera = camera
        this.listener = new THREE.AudioListener()
        this.camera.add(this.listener)
        this.audioLoader = new THREE.AudioLoader()
        this.sound = null



    }

    addSound() {
        const sound = new THREE.Audio(this.listener)
        this.audioLoader.load('/static/were.mp3', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(.04);
            // sound.play()
       
            
        });
        this.sound = sound
    }
    



}





export { AudioListener }