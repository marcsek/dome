import * as THREE from 'three';
import { CustomMesh } from '../CustomMesh';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export class Cloud extends CustomMesh {
  constructor(height: number) {
    super();
    const rightGeo = new THREE.SphereGeometry(0.7, 6, 6);
    const midGeo = new THREE.SphereGeometry(1, 6, 6);
    const leftGeo = new THREE.SphereGeometry(0.8, 6, 6);

    rightGeo.translate(-1.5, 0, 0);
    leftGeo.translate(1.5, 0, 0);

    const merged = mergeGeometries([leftGeo, midGeo, rightGeo]);
    merged.translate(0, height, 0);
    merged.rotateY(Math.random() * Math.PI);

    const mat = new THREE.MeshPhysicalMaterial({ flatShading: true, envMapIntensity: 0.4 });
    const mesh = new THREE.Mesh(merged, mat);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.model.add(mesh);
  }
}
