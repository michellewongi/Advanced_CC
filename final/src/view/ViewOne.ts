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
	Vector3,
	RepeatWrapping,
	Object3D,
	Group,
	MeshPhongMaterial,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BaseView } from './BaseView';
import { Water } from 'three/examples/jsm/objects/Water.js';

export class ViewOne extends BaseView {
	lightAmbient: AmbientLight;
	lightPoint: PointLight;
	lightPoint2: PointLight;
	skybox: Mesh;
	water: Mesh;
	board: Object3D;
	person: Object3D;
	group: Group;

	constructor(model: any, renderer: WebGLRenderer) {
		super(model, renderer);

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

		// adding skybox to scene
		const skyboxImages = [
			'../resources/images/Daylight_Box_Front.png',
			'../resources/images/Daylight_Box_Back.png',
			'../resources/images/Daylight_Box_Top.png',
			'../resources/images/Daylight_Box_Bottom.png',
			'../resources/images/Daylight_Box_Left.png',
			'../resources/images/Daylight_Box_Right.png',
		];

		const skyboxGeometry = new BoxGeometry(10000, 10000, 10000);
		const skyboxMaterial = skyboxImages.map((image) => {
			let skyboxTexture = new TextureLoader().load(image);
			return new MeshBasicMaterial({ map: skyboxTexture, side: BackSide });
		});
		this.skybox = new Mesh(skyboxGeometry, skyboxMaterial);
		this.scene.add(this.skybox);

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
			this.group.add(this.board);
		});

		// add person
		const personLoader = new GLTFLoader();
		personLoader.load('../resources/models/clone.gltf', (gltf: any) => {
			this.person = gltf.scene;
			this.person.scale.set(2, 2, 2);
			this.person.position.y = 600;
			this.person.position.z = 4000;

			this.person.traverse((child: Object3D) => {
				if (child.type === 'Mesh') {
					(child as gltfMesh).material = new MeshPhongMaterial({ color: 0xd59890 });
				}
			});

			this.group.add(this.person);
		});
	}

	update(clock: Clock): void {
		this.water.material.uniforms['time'].value += 1.0 / 30.0;
	}
}

interface gltfMesh extends THREE.Object3D<THREE.Event> {
	material: THREE.Material;
}
