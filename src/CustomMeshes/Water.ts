import * as THREE from 'three';
import { CustomMesh } from '../CustomMesh';
import { World } from '../World';
const waterUrl = new URL('/public/textures/water_map.jpg', import.meta.url).href;

export class Water extends CustomMesh {
  waterMap: THREE.Texture;

  constructor() {
    super();

    const textureLoader = new THREE.TextureLoader();
    this.waterMap = textureLoader.load(waterUrl);

    const waterGeo = new THREE.CylinderGeometry(
      World.MESH_SIZE / Math.sqrt(2) + 0.25,
      World.MESH_SIZE / Math.sqrt(2) + 0.25,
      World.MAX_HEIGHT * 0.1,
      50
    );

    const waterMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#55aaff').convertSRGBToLinear().multiplyScalar(3),
      ior: 1.4,
      transmission: 1,
      transparent: true,
      thickness: 0.2,
      envMapIntensity: 0.2,
      roughness: 0.4,
      metalness: 0.025,
      metalnessMap: this.waterMap,
      roughnessMap: this.waterMap,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(waterGeo, waterMat);
    mesh.position.set(0, World.MAX_HEIGHT * 0.04, 0);
    mesh.receiveShadow = true;

    this.model.add(mesh);
  }
}
