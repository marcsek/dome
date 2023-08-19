import * as THREE from 'three';

export abstract class CustomMesh {
  protected model: THREE.Group;

  constructor() {
    this.model = new THREE.Group();
  }

  modifyMeshAtt(callback: (mesh: THREE.Mesh) => void) {
    this.model.traverse(obj => {
      if (obj instanceof THREE.Mesh) callback(obj);
    });
  }

  setMaterial(callback: (previous: THREE.MaterialParameters) => void) {
    this.model.children.forEach(child => {
      if ('material' in child && typeof child.material === 'object') {
        child.material = callback(child.material as THREE.MaterialParameters);
      }
    });
  }

  getGeo() {
    return this.model.children.map(child => {
      return (child as THREE.Mesh).geometry;
    });
  }
  getMat() {
    return this.model.children.map(child => {
      return (child as THREE.Mesh).material;
    });
  }
  getMesh() {
    return this.model.children.map(child => {
      return child as THREE.Mesh;
    });
  }
}
