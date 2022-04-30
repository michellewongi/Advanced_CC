import { Clock, PerspectiveCamera, Renderer, Scene, Color, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class BaseView {
	scene: Scene;
	camera: PerspectiveCamera;
	renderer: WebGLRenderer;
	controls: OrbitControls;
	model: any;

	constructor(model: any, renderer: WebGLRenderer) {
		this.scene = new Scene();
		this.camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
		this.camera.position.set(0, 1500, 6000);
		this.renderer = renderer;
		this.model = model;
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
	}

	update(clock: Clock): void {}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
