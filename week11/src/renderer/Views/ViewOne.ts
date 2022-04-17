import {
  Mesh,
  Renderer,
  BoxGeometry,
  MeshPhongMaterial,
  AmbientLight,
  PointLight,
  Group,
  Material,
  TextureLoader,
  RepeatWrapping,
  Texture,
  MeshBasicMaterial,
  WebGLRenderer,
  PlaneBufferGeometry,
  DoubleSide,
  Clock,
  ShaderMaterial,
  Vector2,
  DodecahedronGeometry,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { BaseView } from "./BaseView";

import texturePath from "../assets/textures/texture.jpg";
import modelPath from "../assets/models/shape.gltf";

export class ViewOne extends BaseView {
  group: Group;
  shape: Mesh;
  wireframeShape: Mesh;
  exampleModel: Group;
  exampleTexture: Texture;

  lightAmbient: AmbientLight;
  lightPoint: PointLight;

  shaderMat: ShaderMaterial;

  constructor(model: any, renderer: WebGLRenderer) {
    super(model, renderer);

    this.exampleModel = new Group();
    this.exampleTexture = new Texture();
    this.group = new Group();
    this.scene.add(this.group);

    const shapeGeometry = new DodecahedronGeometry();
    const shapeMaterial = new MeshPhongMaterial({ color: 0xf0bbbb });
    this.shape = new Mesh(shapeGeometry, shapeMaterial);
    this.shape.castShadow = true;

    this.group.add(this.shape);

    const wireframeShape = new DodecahedronGeometry();
    this.wireframeShape = new Mesh(wireframeShape, shapeMaterial);
    shapeMaterial.wireframe = true;
    this.wireframeShape.scale.set(1.5, 1.5, 1.5);

    this.group.add(this.wireframeShape);

    const uniforms = {
      u_time: { type: "f", value: 1.0 },
      u_resolution: { type: "v2", value: new Vector2(800, 800) },
    };

    this.shaderMat = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: model.vertexShader,
      fragmentShader: model.fragmentShader,
      side: DoubleSide,
    });

    this.lightAmbient = new AmbientLight(0x333333);
    this.scene.add(this.lightAmbient);

    this.lightPoint = new PointLight(0xffffff);
    this.lightPoint.position.set(-0.5, 0.5, 4);
    this.lightPoint.castShadow = true;
    this.lightPoint.intensity = 0.25;
    this.scene.add(this.lightPoint);

    const mapSize = 1024; // Default 512
    const cameraNear = 0.5; // Default 0.5
    const cameraFar = 500; // Default 500
    this.lightPoint.shadow.mapSize.width = mapSize;
    this.lightPoint.shadow.mapSize.height = mapSize;
    this.lightPoint.shadow.camera.near = cameraNear;
    this.lightPoint.shadow.camera.far = cameraFar;

    let textureMaterial: Material;

    let textureLoader = new TextureLoader();
    textureLoader.load(
      texturePath,
      (texture) => {
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

        this.exampleTexture = texture;

        textureMaterial = new MeshBasicMaterial({ map: texture });

        this.shape.material = textureMaterial;

        const modelLoader = new GLTFLoader();
        modelLoader.load(modelPath, (gltf) => {
          this.exampleModel = gltf.scene;

          this.exampleModel.traverse((child: THREE.Object3D<THREE.Event>) => {
            if (child.type === "Mesh") {
              (child as gltfMesh).material = textureMaterial;
            }
          });

          this.group.add(this.exampleModel);
        });
      },
      undefined,
      (err) => {
        console.log(err);
      }
    );
  }

  update(clock: Clock, delta: number): void {
    this.shaderMat.uniforms.u_time.value += delta;

    this.group.position.set(this.model.groupX, this.model.groupY, 0);
  }
}

interface gltfMesh extends THREE.Object3D<THREE.Event> {
  material: THREE.Material;
}
