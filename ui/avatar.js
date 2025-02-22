import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

export class AvatarRenderer {
    constructor() {
        this.container = document.getElementById('container');
        this.loadingElement = document.getElementById('loading');
        this.isSpeaking = false;
        
        this.params = {
            cellSize: 60,
            contrast: 0.3,
            backgroundColor: "black",
            foregroundColor: "#33ff33",
            speed: 1,
            speakingIntensity: 1,
            cameraZ: 5
        };

        this.init();
        // this.setupGUI();
        this.animate();
        this.setupLoadingAnimation();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            1, // Aspect ratio will be set later
            0.1,
            1000
        );
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(500, 500); // Set renderer size to 250x250
        this.container.appendChild(this.renderer.domElement);

        // ASCII effect
        this.asciiEffect = new AsciiEffect(this.renderer, ' .-+*:=%@#######################################################################################', { 
            invert: true,
            cellSize: this.params.cellSize,
            contrast: this.params.contrast
        });
        this.asciiEffect.setSize(500, 500); // Set ASCII effect size to 250x250
        this.asciiEffect.domElement.style.color = this.params.foregroundColor;
        this.asciiEffect.domElement.style.backgroundColor = this.params.backgroundColor;
        this.asciiEffect.domElement.style.fontSize = '8px';
        this.asciiEffect.domElement.style.fontWeight = 'bold';
        this.asciiEffect.domElement.style.position = 'absolute';
        this.asciiEffect.domElement.style.top = '0';
        this.asciiEffect.domElement.style.left = '0';
        this.container.appendChild(this.asciiEffect.domElement);

        // Update camera aspect ratio
        this.camera.aspect = 500 / 500; // Update aspect ratio
        this.camera.updateProjectionMatrix();

        // Create controls first
        // this.controls = new OrbitControls(this.camera, this.asciiEffect.domElement);
        // this.controls.enableDamping = true;
        // this.controls.dampingFactor = 0.05;
        
        // Force camera position after a brief delay
        setTimeout(() => {
            this.camera.position.set(
                1.7618816782437274,
                160.32529425740424,
                30.339506152748925
            );
            this.camera.rotation.set(
                0.3323739085367392,
                -0.06481849046841913,
                0.022354622797616405
            );
            // this.controls.target.set(0, 0, 0);
            // this.controls.update();
        }, 100);

        // Updated lighting setup
        this.lights = {
            directional: new THREE.DirectionalLight(0xffffff, 20),
            ambient: new THREE.AmbientLight(0x404040, 20),
            front: new THREE.SpotLight(0xffffff, 20),
            back: new THREE.SpotLight(0xffffff, 2)
        };

        // Main directional light from above-front
        this.lights.directional.position.set(132, 126.8, 58.8);
        
        // Front spotlight for detail
        this.lights.front.position.set(0, 50, 100);
        this.lights.front.angle = Math.PI / 4;
        
        // Back light for depth
        this.lights.back.position.set(0, 50, -50);
        this.lights.back.angle = Math.PI / 4;

        // Add lights to scene
        Object.values(this.lights).forEach(light => this.scene.add(light));

        // Load model
        const loader = new FBXLoader();
        loader.load('zerebro_voxel.fbx', (fbx) => {
            this.avatar = fbx;
            this.scene.add(fbx);
            
            // Setup animations
            this.mixer = new THREE.AnimationMixer(fbx);
            if (fbx.animations.length > 0) {
                this.idleAction = this.mixer.clipAction(fbx.animations[0]);
                this.idleAction.play();
            }
            
            // Hide loading message
            this.loadingElement.style.display = 'none';
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.asciiEffect.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupGUI() {
        const gui = new GUI();
        
        // Create a camera folder
        const cameraFolder = gui.addFolder('Camera');
        
        this.params.camera = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };

        // Add camera position controls
        // cameraFolder.add(this.params.camera, 'x', -20, 20).listen();
        // cameraFolder.add(this.params.camera, 'y', -20, 20).listen();
        // cameraFolder.add(this.params.camera, 'z', -20, 20).listen();
        
        // Add button to log camera position
        
        cameraFolder.add({
            logPosition: () => {
                console.log('Camera position:', {
                    x: this.camera.position.x,
                    y: this.camera.position.y,
                    z: this.camera.position.z,
                    rotationX: this.camera.rotation.x,
                    rotationY: this.camera.rotation.y,
                    rotationZ: this.camera.rotation.z
                });
            }
        }, 'logPosition').name('Log Position');

        // Add lighting controls
        const lightFolder = gui.addFolder('Lighting');
        
        // Intensity controls
        lightFolder.add(this.lights.directional, 'intensity', 0, 2).name('Main Light');
        lightFolder.add(this.lights.ambient, 'intensity', 0, 2).name('Ambient');
        lightFolder.add(this.lights.front, 'intensity', 0, 2).name('Front Spot');
        lightFolder.add(this.lights.back, 'intensity', 0, 2).name('Back Spot');

        // Position controls for main light
        const mainLightPos = lightFolder.addFolder('Main Light Position');
        mainLightPos.add(this.lights.directional.position, 'x', -200, 200);
        mainLightPos.add(this.lights.directional.position, 'y', -200, 200);
        mainLightPos.add(this.lights.directional.position, 'z', -200, 200);

        // Rest of your existing GUI controls
        gui.add(this.params, 'cellSize', 1, 20).onChange((value) => {
            this.recreateAsciiEffect();
        });
        
        gui.add(this.params, 'contrast', 0, 1).onChange((value) => {
            this.recreateAsciiEffect();
        });

        gui.add(this.params, 'speed', 0.1, 5);
        gui.add(this.params, 'speakingIntensity', 0.1, 5);

        gui.addColor(this.params, 'foregroundColor').onChange((value) => {
            this.asciiEffect.domElement.style.color = value;
        });

        gui.addColor(this.params, 'backgroundColor').onChange((value) => {
            this.asciiEffect.domElement.style.backgroundColor = value;
        });
    }

    recreateAsciiEffect() {
        const oldElement = this.asciiEffect.domElement;
        this.asciiEffect = new AsciiEffect(this.renderer, " /'¦+-*:;=!%$#@", {
            invert: true,
            cellSize: this.params.cellSize,
            contrast: this.params.contrast
        });
        this.asciiEffect.setSize(window.innerWidth, window.innerHeight);
        this.asciiEffect.domElement.style.color = this.params.foregroundColor;
        this.asciiEffect.domElement.style.backgroundColor = this.params.backgroundColor;
        oldElement.parentNode.replaceChild(this.asciiEffect.domElement, oldElement);
        
        // Reconnect OrbitControls to new domElement
        // this.controls = new OrbitControls(this.camera, this.asciiEffect.domElement);
        // this.controls.enableDamping = true;
        // this.controls.dampingFactor = 0.05;
    }

    setupLoadingAnimation() {
        const frames = ['|', '/', '-', '\\'];
        let frameIndex = 0;
        
        this.loadingInterval = setInterval(() => {
            this.loadingElement.textContent = 'Loading... ' + frames[frameIndex];
            frameIndex = (frameIndex + 1) % frames.length;
        }, 250);
    }

    setupSpeakButton() {
        this.speakButton.addEventListener('click', () => {
            this.isSpeaking = !this.isSpeaking;
            this.speakButton.textContent = this.isSpeaking ? 'Stop Speaking' : 'Simulate Speaking';
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // this.controls.update();

        // Update camera position in GUI
        if (this.params.camera) {
            this.params.camera.x = this.camera.position.x;
            this.params.camera.y = this.camera.position.y;
            this.params.camera.z = this.camera.position.z;
        }

        if (this.avatar) {
            const time = Date.now() * 0.001 * this.params.speed;
            
            // // Add subtle idle movement
            // this.avatar.rotation.y = Math.sin(time * 0.1) * 0.01;
            
            // Add more movement when speaking
            if (this.isSpeaking) {
                this.avatar.rotation.y = Math.sin(time * 2) * 0.05 * this.params.speakingIntensity; // Head moves back and forth
                // also move the head up and down, not just back and forth
                this.avatar.position.x = Math.sin(time * 2) * 0.05 * this.params.speakingIntensity;
            } else {
                // this.avatar.rotation.x *= 0.95;
                // this.avatar.position.y *= 0.95;
            }

            if (this.mixer) {
                this.mixer.update(0.016);
            }
        }

        this.asciiEffect.render(this.scene, this.camera);
    }
}