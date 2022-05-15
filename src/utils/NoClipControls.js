

import { PointerLockControls } from "/modules/PointerLockControls.js";
import { Vector3, ArrowHelper } from '/modules/three.module.js';



class NoClipControls extends PointerLockControls {
    //Child Constructor
    constructor(scene, window, camera, domElement) {
        //Parent Constructor
        super(camera, domElement.body);

        this.velocity = new Vector3();
        this.direction = new Vector3();
        this.gravity = 1
        this.flyRelease = 3
        this.flySpeed = 200
        this._moveForward = false;
        this._moveBackward = false;
        this._moveLeft = false;
        this._moveRight = false;
        this._moveUp = false;
        this._moveDown = false;
        this.scene = scene

        //Initializing with DOM
        const blocker = document.getElementById('blocker');
        const instructions = document.getElementById('instructions');
        const container = document.getElementById('container');
        this.addEventListener('lock', function () {
            instructions.style.display = 'none';
            blocker.style.display = 'none';
        });
        this.addEventListener('unlock', function () {
            blocker.style.display = 'block';
            instructions.style.display = '';
        });
        window.addEventListener('dblclick', (event) => {
            this.lock();
        });

        window.addEventListener('keydown', (event) => {
            this.lock();
            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':
                    this._moveForward = true;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    this._moveLeft = true;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    this._moveBackward = true;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    this._moveRight = true;
                    break;

                case 'Space':
                    this._moveUp = true
                    break;
                case 'ShiftLeft':
                    this._moveDown = true
                    break;

                case 'KeyF':

                    let arrow = new ArrowHelper(this.cameraLookDir(camera), camera.position, 10, Math.random() * 0xffffff);
                    this.scene.add(arrow);


                    break;


            }

        });

        window.addEventListener('keyup', (event) => {
            this.lock();
            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':

                    this._moveForward = false;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    this._moveLeft = false;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    this._moveBackward = false;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    this._moveRight = false;
                    break;

                case 'Space':
                    this._moveUp = false
                    break;
                case 'ShiftLeft':
                    this._moveDown = false
                    break;
            }

        });

    }


    cameraLookDir = function (camera) {
        var vector = new Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        return vector;
    }

    update(time, prevTime) {

        if (this.isLocked === true) {

            const delta = (time - prevTime) / 1000;

            //Move WASD, SHIFT, SPACE
            this.velocity.x -= this.velocity.x * this.flyRelease * delta;
            this.velocity.z -= this.velocity.z * this.flyRelease * delta;
            this.velocity.y -= this.gravity * this.velocity.y * this.flyRelease * delta;

            this.direction.z = Number(this._moveForward) - Number(this._moveBackward);
            this.direction.x = Number(this._moveRight) - Number(this._moveLeft);
            this.direction.y = Number(this._moveUp) - Number(this._moveDown);
            this.direction.normalize(); // this ensures consistent movements in all directions

            if (this._moveForward || this._moveBackward) this.velocity.z -= this.direction.z * this.flySpeed * delta;
            if (this._moveLeft || this._moveRight) this.velocity.x -= this.direction.x * this.flySpeed * delta;
            if (this._moveUp || this._moveDown) this.velocity.y -= this.direction.y * this.flySpeed * delta;

            
            this.moveRight(- this.velocity.x * delta);
            this.moveForward(- this.velocity.z * delta);
            this.moveUp(this.velocity.y * delta);

        }

    }
}

export { NoClipControls }
