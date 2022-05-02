import './style.scss';
import * as THREE from 'three';
import { ShaderMaterial } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

let renderer: THREE.WebGLRenderer;
let clock = new THREE.Clock();
let stats: any;
let pointerPosition: THREE.Vector2;
let viewOne: ViewOne;
let views: BaseView[] = [];

import { ViewOne } from './view/ViewOne';
import { BaseView } from './view/BaseView';
let shaderMat: ShaderMaterial;

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
	renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	viewOne = new ViewOne(renderer);
	views.push(viewOne);

	// controls = new OrbitControls(camera, renderer.domElement);

	pointerPosition = new THREE.Vector2(0, 0);

	const uniforms = {
		u_time: { type: 'f', value: 1.0 },
		u_resolution: { type: 'v2', value: new THREE.Vector2(800, 800) },
		// u_mouse: { type: 'v2', value: new THREE.Vector2() },
	};

	shaderMat = new THREE.ShaderMaterial({
		uniforms: uniforms,
		side: THREE.DoubleSide,
	});

	// add event listener to highlight dragged objects

	// controls = new DragControls([plane], camera, renderer.domElement);

	// controls.addEventListener('dragstart', function(event) {
	// 	event.object.material.emissive.set(0xaaaaaa);
	// })

	// controls.addEventListener('dragend', function (event) {
	// 	event.object.material.emissive.set(0x000000);
	// })

	// // Init animation
	animate();
}

function initListeners() {
	window.addEventListener('resize', onWindowResize, false);

	window.addEventListener('pointermove', onPointerMove);

	window.addEventListener('keydown', (event) => {
		const { key } = event;
		// console.log(key);

		switch (key) {
			case 'e':
				const win = window.open('', 'Canvas Image');

				const { domElement } = renderer;

				const src = domElement.toDataURL();

				if (!win) return;

				win.document.write(`<img src='${src}' width='${domElement.width}' height='${domElement.height}'>`);
				break;

			case 'ArrowRight':
				viewOne.group.position.x += 100;
				viewOne.camera.position.x += 100;
				break;

			case 'ArrowLeft':
				viewOne.group.position.x -= 100;
				viewOne.camera.position.x -= 100;
				break;

			case 'ArrowUp':
				viewOne.group.position.z -= 100;
				viewOne.camera.position.z -= 100;
				break;

			case 'ArrowDown':
				viewOne.group.position.z += 100;
				viewOne.camera.position.z += 100;
				break;

			default:
				break;
		}
	});
}

function onWindowResize() {
	viewOne.onWindowResize();
}

function onPointerMove(event: any) {
	pointerPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointerPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
	requestAnimationFrame(() => {
		animate();
	});

	let delta = clock.getDelta();

	shaderMat.uniforms.u_time.value += delta;

	viewOne.update(clock);

	if (stats) stats.update();

	// if (controls) controls.update();

	renderer.render(viewOne.scene, viewOne.camera);
}

main();

interface MeshObj extends THREE.Object3D<THREE.Event> {
	material: THREE.MeshPhongMaterial;
}

interface gltfMesh extends THREE.Object3D<THREE.Event> {
	material: THREE.Material;
}

interface ColorMaterial extends THREE.Material {
	color: THREE.Color;
}
