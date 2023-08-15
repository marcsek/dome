import * as THREE from 'three';
import { WorldGenerator } from '../WorldGenerator';
import { ModelGroup } from '../ModelGroup';
import { World } from '../World';
import { Dome } from '../Dome';
import { Rock } from '../CustomMeshes/Rock';
import { clamp } from '../utils/Math';
import { Cloud } from '../CustomMeshes/Cloud';

export class PropsGenerator extends WorldGenerator {
  models: Map<string, THREE.Group>;
  generated: THREE.Group;

  constructor() {
    super();

    this.models = new Map();
    this.generated = new THREE.Group();
  }

  async init() {
    const start = performance.now();

    const tree_base_paradigm = await new ModelGroup().load('/public/models/tree_base.gltf');
    this.configureModel(tree_base_paradigm);
    this.models.set('tree_base', tree_base_paradigm.model);

    const tree_paradigm = await new ModelGroup().load('/public/models/strom.gltf');
    this.configureModel(tree_paradigm);
    this.models.set('tree', tree_paradigm.model);

    const bush_paradigm = await new ModelGroup().load('/public/models/bush.gltf');
    this.configureModel(bush_paradigm);
    this.models.set('bush', bush_paradigm.model);

    const end = performance.now();
    console.log(`Props initialization took ${end - start} ms`);
    return this;
  }

  generateOnPos(position: THREE.Vector3): void {
    const random = Math.random();
    const height = position.y;

    let modelToClone;
    let randomTilePos = false;

    if (random < 0.05) {
      modelToClone = new Cloud(16).model;
    }

    switch (true) {
      case height < World.MAX_HEIGHT * 0.15:
        if (random < 0.35 && height > World.MAX_HEIGHT * 0.05) {
          modelToClone = new Rock(clamp(0.2, 0.3, Math.random() * 0.3)).model;
          randomTilePos = true;
        }
        break;
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
        break;
      default:
    }

    if (modelToClone) {
      const clonedModel = this.cloneModel(modelToClone, new THREE.Vector3(position.x, height, position.z));
      if (randomTilePos) this.assingRandomTilePos(clonedModel);
      this.generated.add(clonedModel);
    }
  }

  getGenerated(): THREE.Group {
    return this.generated;
  }

  reset() {
    this.generated = new THREE.Group();
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

  private assingRandomTilePos(model: THREE.Group) {
    const offset: THREE.Vec2 = { x: Math.random() * 0.5, y: Math.random() * 0.5 };
    model.position.set(model.position.x + offset.x, model.position.y, model.position.z + offset.y);
  }
}
