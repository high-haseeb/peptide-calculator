import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DEG2RAD } from "three/src/math/MathUtils.js";

export class ThreeScene {

    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private container!: HTMLCanvasElement;
    private model?: THREE.Object3D;
    private plunger?: THREE.Mesh;
    private clock = new THREE.Clock();
    public amplitude: number = 0.0;

    constructor(containerId: string, modelPath: string) {
        const container = document.getElementById(containerId) as HTMLCanvasElement;
        if (!container) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }

        this.container = container;
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color("#181818");

        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 1, 30);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.container, alpha: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        this.addLights();
        this.loadModel(modelPath);
        this.handleResize();
        this.animate();
    }

    private addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 50);
        this.scene.add(directionalLight);
    }

    private loadModel(modelPath: string) {
        const loader = new GLTFLoader();
        loader.load(
            modelPath,
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);

                this.plunger = gltf.scene.getObjectByName("Plunger") as THREE.Mesh;
                if (!this.plunger) {
                    console.warn("Plunger mesh not found in the model!");
                }
                this.model.rotation.set(-10*DEG2RAD, 0, 135*DEG2RAD);
            },
            (xhr) => console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`),
            (error) => console.error("Error loading model:", error)
        );
    }

    private handleResize() {
        window.addEventListener("resize", () => {
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
        });
    }

    private animate = () => {
        requestAnimationFrame(this.animate);

        const time = this.clock.getElapsedTime();

        if (this.plunger && this.model) {
            this.model.rotation.y += 0.001;
            this.plunger.position.y = -Math.abs(Math.sin(time)) - 20;
        }

        this.renderer.render(this.scene, this.camera);
    };

    public setAmplitude(newAmplitude: number) {
        this.amplitude = newAmplitude;
    }
}
