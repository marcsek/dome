import * as THREE from 'three';
import { WorldGenerator } from '../WorldGenerator';
import { ModelGroup } from '../ModelGroup';
import { World } from '../World';
import { Dome } from '../Dome';

export class PropsGenerator extends WorldGenerator {
  models: Map<string, THREE.Group>;
  generated: THREE.Group;

  constructor() {
    super();

    this.models = new Map();
    this.generated = new THREE.Group();
  }

  async init() {
    const tree_base_paradigm = await new ModelGroup().load('/public/models/tree_base.gltf');
    this.configureModel(tree_base_paradigm);
    this.models.set('tree_base', tree_base_paradigm.model);

    const tree_paradigm = await new ModelGroup().load('/public/models/strom.gltf');
    this.configureModel(tree_paradigm);
    this.models.set('tree', tree_paradigm.model);

    const bush_paradigm = await new ModelGroup().load('/public/models/bush.gltf');
    this.configureModel(bush_paradigm);
    this.models.set('bush', bush_paradigm.model);

    return this;
  }

  generateOnPos(position: THREE.Vector3): void {
    const random = Math.random();
    const height = position.y;

    let modelToClone;

    switch (true) {
      case height < World.MAX_HEIGHT * 0.25:
        if (random < 0.075) {
          modelToClone = this.models.get('tree');
        } else if (random < 0.15) {
          modelToClone = this.models.get('tree_base');
        }
        break;
      case height < World.MAX_HEIGHT * 0.5:
        if (random < 0.15) {
          modelToClone = this.models.get('bush');
        }
    }

    if (modelToClone) {
      const clonedModel = this.cloneModel(modelToClone, new THREE.Vector3(position.x, height, position.z));
      this.generated.add(clonedModel);
    }
  }

  getGenerated(): THREE.Group {
    return this.generated;
  }

  private cloneModel(modelParadigm: THREE.Group, newPos: THREE.Vector3) {
    const model = modelParadigm.clone();
    model.position.set(newPos.x, newPos.y, newPos.z);
    return model;
  }

  private configureModel(model: ModelGroup) {
    model.model.scale.set(0.35, 0.35, 0.35);
    model.setMaterial(mat => new THREE.MeshPhysicalMaterial({ ...mat, envMapIntensity: Dome.ENV_INTENSITY }));
    model.modifyMeshAtt(mesh => {
      mesh.castShadow = true;
    });
  }
}
