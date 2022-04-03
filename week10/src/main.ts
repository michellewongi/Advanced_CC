import './style.scss';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;

let lightAmbient: THREE.AmbientLight;
let lightPoint: THREE.PointLight;

let controls: OrbitControls;
let stats: any;

let clone: THREE.Object3D = new THREE.Object3D();
let table: THREE.Object3D = new THREE.Object3D();
let plane: THREE.Mesh;
let ground: THREE.Mesh;
let group: THREE.Group = new THREE.Group();
let secondGroup: THREE.Group = new THREE.Group();

// add GUI
const model = {
	firstAngle: 0,
	secondAngle: 0,
};

const gui = new dat.GUI();
gui.add(model, 'firstAngle', 0, Math.PI * 2.0, 0.01);
gui.add(model, 'secondAngle', 0, Math.PI * 2.0, 0.01);

function main() {
	initScene();
	initStats();
	initListeners();
}

function initStats() {
	stats = new (Stats as any)();
	document.body.appendChild(stats.dom);
}

function initScene() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x63cbff);
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	controls = new OrbitControls(camera, renderer.domElement);

	lightAmbient = new THREE.AmbientLight(0x333333);
	scene.add(lightAmbient);

	// Add a point light to add shadows
	const shadowIntensity = 0.7;

	lightPoint = new THREE.PointLight(0xffffff);
	lightPoint.position.set(1, 10, 4);
	lightPoint.castShadow = true;
	lightPoint.intensity = shadowIntensity;
	scene.add(lightPoint);

	const lightPoint2 = lightPoint.clone();
	lightPoint2.intensity = 1 - shadowIntensity;
	lightPoint2.castShadow = false;
	scene.add(lightPoint2);

	const mapSize = 1024; // Default 512
	const cameraNear = 0.5; // Default 0.5
	const cameraFar = 500; // Default 500
	lightPoint.shadow.mapSize.width = mapSize;
	lightPoint.shadow.mapSize.height = mapSize;
	lightPoint.shadow.camera.near = cameraNear;
	lightPoint.shadow.camera.far = cameraFar;

	// Add GLTF
	const tableLoader = new GLTFLoader();
	tableLoader.load('../resources/table.gltf', (gltf: any) => {
		table = gltf.scene;
		table.castShadow = true;
		table.position.setY(-1);
		table.scale.set(0.006, 0.006, 0.006);
		table.position.setX(2.5);

		const colorMap = new THREE.MeshPhongMaterial({ color: 0x7552c7 });

		interface gltfMesh extends THREE.Object3D<THREE.Event> {
			material: THREE.Material;
		}

		table.traverse((child: THREE.Object3D<THREE.Event>) => {
			if (child.type === 'Mesh') {
				(child as gltfMesh).material = colorMap;
			}
		});

		scene.add(table);
	});

	const loader = new GLTFLoader();
	loader.load('../resources/clone.gltf', (gltf: any) => {
		clone = gltf.scene;
		clone.castShadow = true;
		clone.position.setX(-1);
		clone.scale.set(0.005, 0.005, 0.005);
		clone.rotateY(192);

		const colorArr = [0xff0000, 0xffbcb8, 0xc9635d, 0x4ae3e8, 0x7552c7, 0xfff18a];

		const colorMap = new THREE.MeshPhongMaterial({ color: colorArr[Math.floor(Math.random() * colorArr.length)] });

		interface gltfMesh extends THREE.Object3D<THREE.Event> {
			material: THREE.Material;
		}

		clone.traverse((child: THREE.Object3D<THREE.Event>) => {
			if (child.type === 'Mesh') {
				(child as gltfMesh).material = colorMap;
			}
		});

		group.add(clone);
	});

	const loader2 = new GLTFLoader();
	loader2.load('../resources/clone.gltf', (gltf: any) => {
		clone = gltf.scene;
		clone.castShadow = true;
		clone.position.setX(1);
		clone.scale.set(0.005, 0.005, 0.005);
		clone.rotateY(192);

		const colorArr = [0xff0000, 0xffbcb8, 0xc9635d, 0x4ae3e8, 0x7552c7, 0xfff18a];

		const colorMap = new THREE.MeshPhongMaterial({ color: colorArr[Math.floor(Math.random() * colorArr.length)] });

		interface gltfMesh extends THREE.Object3D<THREE.Event> {
			material: THREE.Material;
		}

		clone.traverse((child: THREE.Object3D<THREE.Event>) => {
			if (child.type === 'Mesh') {
				(child as gltfMesh).material = colorMap;
			}
		});

		secondGroup.add(clone);
	});

	// Add a box
	const materialPlane = new THREE.MeshPhongMaterial({
		color: 0x226100,
	});
	const boxGeometry = new THREE.BoxGeometry(100, 10, 100);
	ground = new THREE.Mesh(boxGeometry, materialPlane);
	ground.position.setY(-6.3);
	scene.add(ground);

	scene.add(group);
	scene.add(secondGroup);

	// Init animation
	animate();
}

function initListeners() {
	window.addEventListener('resize', onWindowResize, false);

	window.addEventListener('keydown', (event) => {
		const { key } = event;

		switch (key) {
			case 'e':
				const win = window.open('', 'Canvas Image');

				const { domElement } = renderer;

				// Makse sure scene is rendered.
				renderer.render(scene, camera);

				const src = domElement.toDataURL();

				if (!win) return;

				win.document.write(`<img src='${src}' width='${domElement.width}' height='${domElement.height}'>`);
				break;

			// add keyboard interactions
			case 'd':
				group.position.x += 0.2;
				break;

			case 'a':
				group.position.x -= 0.2;
				break;

			case 'w':
				group.position.z -= 0.2;
				break;

			case 's':
				group.position.z += 0.2;
				break;

			case 'ArrowRight':
				secondGroup.position.x += 0.2;
				break;

			case 'ArrowLeft':
				secondGroup.position.x -= 0.2;
				break;

			case 'ArrowUp':
				secondGroup.position.z -= 0.2;
				break;

			case 'ArrowDown':
				secondGroup.position.z += 0.2;
				break;

			default:
				break;
		}
	});
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(() => {
		animate();
	});

	group.rotation.set(0, model.firstAngle, 0);
	secondGroup.rotation.set(0, model.secondAngle, 0);

	renderer.render(scene, camera);
}

main();

interface gltfMesh extends THREE.Object3D<THREE.Event> {
	material: THREE.Material;
}
