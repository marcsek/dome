import * as THREE from 'three';
import { CustomMesh } from '../CustomMesh';
import { World } from '../World';

export class Water extends CustomMesh {
  constructor() {
    super();

    const start = performance.now();

    const textureLoader = new THREE.TextureLoader();
    const waterMap = textureLoader.load('/public/textures/water_map.jpg');

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
      metalnessMap: waterMap,
      roughnessMap: waterMap,
    });

    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, World.MAX_HEIGHT * 0.04, 0);
    waterMesh.receiveShadow = true;

    this.model.add(waterMesh);

    const end = performance.now();
    console.log(`Water initialization took ${end - start} ms`);
  }
}
