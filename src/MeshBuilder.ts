import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export class MeshBuilder {
  private meshes: Map<string, THREE.Mesh>;

  constructor() {
    this.meshes = new Map();
  }

  setMaterials(materials: { key: string; material: THREE.Material }[]) {
    materials.forEach(mat => {
      const mesh = this.meshes.get(mat.key);
      if (mesh) {
        mesh.material = mat.material;
      } else {
        this.meshes.set(mat.key, new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), mat.material));
      }
    });
  }

  addGeometry(key: string, newGeometry: THREE.BufferGeometry) {
    const mesh = this.meshes.get(key);
    if (mesh) mesh.geometry = mergeGeometries([mesh.geometry, newGeometry]);
  }

  updateGlobally(updateCallback: (mesh: THREE.Mesh) => void) {
    [...this.meshes.values()].forEach(mesh => {
      updateCallback(mesh);
    });
  }

  getMeshes() {
    return this.meshes.values();
  }
}
