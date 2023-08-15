import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CustomMesh } from './CustomMesh';

export class ModelGroup extends CustomMesh {
  private readonly DEFAULT_MATERIAL = THREE.MeshPhysicalMaterial;

  async load(url: string) {
    const loader = new GLTFLoader();
    this.model = (await loader.loadAsync(url)).scene;

    this.replaceMaterial();
    return this;
  }

  private replaceMaterial() {
    this.model.children.forEach(child => {
      if ('material' in child && typeof child.material === 'object') {
        child.material = new this.DEFAULT_MATERIAL({
          ...child.material,
        });
      }
    });
  }
}
