import {
	PointLight,
	WebGLRenderer,
	Clock,
	AmbientLight,
	BoxGeometry,
	Mesh,
	TextureLoader,
	MeshBasicMaterial,
	BackSide,
	PlaneGeometry,
	RepeatWrapping,
	Object3D,
	Group,
	MeshPhongMaterial,
	SphereGeometry,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { BaseView } from './BaseView';
import { Water } from 'three/examples/jsm/objects/Water.js';

export class ViewOne extends BaseView {
	lightAmbient: AmbientLight;
	lightPoint: PointLight;
	lightPoint2: PointLight;
	skybox: Mesh;
	interstellar: Mesh;
	galaxy: Mesh;
	water: Mesh;
	board!: Object3D;
	person!: Object3D;
	fish!: Object3D;
	group: Group;
	bubble: Mesh;
	bubbleTwo: Mesh;
	bubbleThree: Mesh;

	constructor(renderer: WebGLRenderer) {
		super(renderer);

		this.lightAmbient = new AmbientLight(0x333333);
		this.scene.add(this.lightAmbient);

		this.lightPoint = new PointLight(0xffffff);
		this.lightPoint.position.set(0, 1000, 5000);
		this.lightPoint.castShadow = true;
		this.lightPoint.intensity = 0.8;
		this.scene.add(this.lightPoint);

		this.lightPoint2 = new PointLight(0xffffff);
		this.lightPoint2.position.set(0, 1000, -5000);
		this.lightPoint2.castShadow = true;
		this.lightPoint2.intensity = 1.0;
		this.scene.add(this.lightPoint2);

		const mapSize = 1024; // Default 512
		const cameraNear = 0.5; // Default 0.5
		const cameraFar = 500; // Default 500
		this.lightPoint.shadow.mapSize.width = mapSize;
		this.lightPoint.shadow.mapSize.height = mapSize;
		this.lightPoint.shadow.camera.near = cameraNear;
		this.lightPoint.shadow.camera.far = cameraFar;

		// skybox images
		const skyboxImages = [
			'../resources/images/Daylight_Box_Front.png',
			'../resources/images/Daylight_Box_Back.png',
			'../resources/images/Daylight_Box_Top.png',
			'../resources/images/Daylight_Box_Bottom.png',
			'../resources/images/Daylight_Box_Left.png',
			'../resources/images/Daylight_Box_Right.png',
		];

		const interstellarImages = [
			'../resources/images/zpos.png',
			'../resources/images/zneg.png',
			'../resources/images/ypos.png',
			'../resources/images/yneg.png',
			'../resources/images/xneg.png',
			'../resources/images/xpos.png',
		];

		const galaxyImages = [
			'../resources/images/gloomy_ft.png',
			'../resources/images/gloomy_bk.png',
			'../resources/images/gloomy_up.png',
			'../resources/images/gloomy_dn.png',
			'../resources/images/gloomy_rt.png',
			'../resources/images/gloomy_lf.png',
		];

		// daylight background
		const skyboxGeometry = new BoxGeometry(10000, 10000, 10000);
		const skyboxMaterial = skyboxImages.map((image) => {
			let skyboxTexture = new TextureLoader().load(image);
			return new MeshBasicMaterial({ map: skyboxTexture, side: BackSide });
		});
		this.skybox = new Mesh(skyboxGeometry, skyboxMaterial);
		this.scene.add(this.skybox);

		// interstellar background
		const interstellarMat = interstellarImages.map((image) => {
			let skyboxTexture = new TextureLoader().load(image);
			return new MeshBasicMaterial({ map: skyboxTexture, side: BackSide });
		});
		this.interstellar = new Mesh(skyboxGeometry, interstellarMat);

		// galaxy background
		const galaxyMat = galaxyImages.map((image) => {
			let skyboxTexture = new TextureLoader().load(image);
			return new MeshBasicMaterial({ map: skyboxTexture, side: BackSide });
		});
		this.galaxy = new Mesh(skyboxGeometry, galaxyMat);

		// applying water texture
		// referencing the tutorial on https://www.liquid.fish/current/threejs by Ken Kozma
		const waterGeometry = new PlaneGeometry(10000, 10000);
		this.water = new Water(waterGeometry, {
			textureWidth: 510,
			textureHeight: 510,
			waterNormals: new TextureLoader().load('../resources/textures/watertexture.jpg', function (texture) {
				texture.wrapS = texture.wrapT = RepeatWrapping;
			}),
			waterColor: 0x0b5394,
			distortionScale: 10.0,
		});
		this.water.rotation.x = -Math.PI / 2;
		this.scene.add(this.water);

		// add board
		this.group = new Group();
		this.scene.add(this.group);
		const boardLoader = new GLTFLoader();
		boardLoader.load('../resources/models/board.gltf', (gltf: any) => {
			this.board = gltf.scene;
			this.board.scale.set(2, 2, 2);
			this.board.position.y = -520;
			this.board.position.z = 4200;
			this.board.position.x = -1290;
			this.board.rotateY(83.2);

			this.board.traverse((child: Object3D) => {
				if (child.type === 'Mesh') {
					(child as gltfMesh).material = new MeshPhongMaterial({ color: 0x5e3429 });
				}
			});

			this.group.add(this.board);
		});

		// add person
		const personLoader = new GLTFLoader();
		personLoader.load('../resources/models/clone.gltf', (gltf: any) => {
			this.person = gltf.scene;
			this.person.scale.set(2, 2, 2);
			this.person.position.y = 600;
			this.person.position.z = 4000;
			this.person.position.x = -20;

			this.person.traverse((child: Object3D) => {
				if (child.type === 'Mesh') {
					(child as gltfMesh).material = new MeshPhongMaterial({ color: 0xd59890 });
				}
			});

			this.group.add(this.person);
		});

		// add choice bubble
		const bubbleGeometry = new SphereGeometry(400, 100);
		const bubbleMaterial = new MeshPhongMaterial({ color: 0xafe1af, opacity: 0.4, transparent: true });
		this.bubble = new Mesh(bubbleGeometry, bubbleMaterial);
		this.bubble.position.x = -2200;
		this.bubble.position.y = 600;
		this.bubble.position.z = -2000;
		this.scene.add(this.bubble);

		const bubbleTwoMaterial = new MeshPhongMaterial({ color: 0xc70039, opacity: 0.4, transparent: true });
		this.bubbleTwo = new Mesh(bubbleGeometry, bubbleTwoMaterial);
		this.bubbleTwo.position.x = 2200;
		this.bubbleTwo.position.y = 600;
		this.bubbleTwo.position.z = -2000;
		this.scene.add(this.bubbleTwo);

		const bubbleThreeMaterial = new MeshPhongMaterial({ color: 0xadd8e6, opacity: 0.4, transparent: true });
		this.bubbleThree = new Mesh(bubbleGeometry, bubbleThreeMaterial);
		this.bubbleThree.position.y = 600;
		this.bubbleThree.position.z = -2000;
		this.scene.add(this.bubbleThree);

		// add fishes
		const fishLoader = new OBJLoader();
		fishLoader.load('../resources/models/fish.obj', (obj: any) => {
			this.fish = obj;
			this.fish.scale.set(20, 20, 20);
			this.fish.position.set(4000, 0, 1000);
			this.fish.rotateX(180.7);
			this.scene.add(this.fish);
		});
	}

	//@ts-ignore
	update(clock: Clock): void {
		//@ts-ignore
		this.water.material.uniforms['time'].value += 1.0 / 30.0;

		// check for collision and change background
		if (this.group.position.x == -2200 && this.group.position.z == -6000) {
			this.scene.add(this.interstellar);
			if (this.scene.children.includes(this.skybox)) {
				this.scene.remove(this.skybox);
			} else if (this.scene.children.includes(this.galaxy)) {
				this.scene.remove(this.galaxy);
			}
		} else if (this.group.position.x == 2200 && this.group.position.z == -6000) {
			this.scene.add(this.galaxy);
			if (this.scene.children.includes(this.skybox)) {
				this.scene.remove(this.skybox);
			} else if (this.scene.children.includes(this.galaxy)) {
				this.scene.remove(this.interstellar);
			}
		} else if (this.group.position.x == 0 && this.group.position.z == -6000) {
			this.scene.add(this.skybox);
			if (this.scene.children.includes(this.galaxy)) {
				this.scene.remove(this.galaxy);
			} else if (this.scene.children.includes(this.interstellar)) {
				this.scene.remove(this.interstellar);
			}
		}
	}
}

interface gltfMesh extends THREE.Object3D<THREE.Event> {
	material: THREE.Material;
}
