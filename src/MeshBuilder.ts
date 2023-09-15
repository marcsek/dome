import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export class MeshBuilder {
  private meshes: Map<string, THREE.Mesh[]>;

  constructor() {
    this.meshes = new Map();
  }

  setMaterials(materials: { key: string; materials: THREE.Material[] }[]) {
    materials.forEach(mat => {
      const newMeshes = mat.materials.map(material => new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), material));
      this.meshes.set(mat.key, newMeshes);
    });
  }

  setMesh(key: string, meshes: THREE.Mesh[], replaceGeo?: boolean) {
    const meshClones = meshes.map(mesh => mesh.clone());

    if (replaceGeo) {
      meshClones.forEach(clone => (clone.geometry = new THREE.BoxGeometry(0, 0, 0)));
    }

    this.meshes.set(key, meshClones);
  }

  addGeometry(key: string, newGeometries: THREE.BufferGeometry[]) {
    const mesh = this.meshes.get(key);

    if (!mesh) return;

    for (let i = 0; i < newGeometries.length; i++) {
      mesh[i].geometry = mergeGeometries([mesh[i].geometry, newGeometries[i]]);
    }
  }

  updateGlobally(updateCallback: (mesh: THREE.Mesh) => void) {
    [...this.meshes.values()].forEach(meshes => {
      meshes.forEach(mesh => updateCallback(mesh));
    });
  }

  resetGeometry() {
    [...this.meshes.values()].forEach(values => {
      values.forEach(value => (value.geometry = new THREE.BoxGeometry(0, 0, 0)));
    });
  }

  getMeshes() {
    const res: THREE.Mesh[] = [];
    const values = [...this.meshes.values()];

    for (const row of values) for (const e of row) res.push(e);

    return res;
  }
}
