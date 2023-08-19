import * as THREE from 'three';
import { WorldGenerator } from '../WorldGenerator';
import { ModelGroup } from '../ModelGroup';
import { World } from '../World';
import { Dome } from '../Dome';
import { Rock } from '../CustomMeshes/Rock';
import { clamp } from '../utils/Math';
import { Cloud } from '../CustomMeshes/Cloud';
import { MeshBuilder } from '../MeshBuilder';
const bushUrl = new URL('/public/models/bush.gltf', import.meta.url).href;
const treeUrl = new URL('/public/models/tree.gltf', import.meta.url).href;
const tree_baseUrl = new URL('/public/models/tree_base.gltf', import.meta.url).href;

export class PropsGenerator extends WorldGenerator {
  meshBuilder: MeshBuilder;

  bush_paradigm: ModelGroup;
  tree_paradigm: ModelGroup;
  tree_base_paradigm: ModelGroup;

  constructor() {
    super();

    this.meshBuilder = new MeshBuilder();

    this.bush_paradigm = new ModelGroup();
    this.tree_paradigm = new ModelGroup();
    this.tree_base_paradigm = new ModelGroup();
  }

  async init() {
    const start = performance.now();

    const rock = new Rock(0);
    const cloud = new Cloud(0);
    this.bush_paradigm = await new ModelGroup().load(bushUrl);
    this.bush_paradigm.setMaterial(mat => new THREE.MeshPhysicalMaterial({ ...mat, envMapIntensity: Dome.ENV_INTENSITY }));

    this.tree_paradigm = await new ModelGroup().load(treeUrl);
    this.tree_paradigm.setMaterial(mat => new THREE.MeshPhysicalMaterial({ ...mat, envMapIntensity: Dome.ENV_INTENSITY }));

    this.tree_base_paradigm = await new ModelGroup().load(tree_baseUrl);
    this.tree_base_paradigm.setMaterial(mat => new THREE.MeshPhysicalMaterial({ ...mat, envMapIntensity: Dome.ENV_INTENSITY }));

    this.meshBuilder.setMesh('rock', rock.getMesh(), true);
    this.meshBuilder.setMesh('cloud', cloud.getMesh(), true);
    this.meshBuilder.setMesh('bush', this.bush_paradigm.getMesh(), true);
    this.meshBuilder.setMesh('tree', this.tree_paradigm.getMesh(), true);
    this.meshBuilder.setMesh('tree_base', this.tree_base_paradigm.getMesh(), true);

    this.meshBuilder.updateGlobally(mesh => {
      mesh.castShadow = true;
    });

    const end = performance.now();
    console.log(`Props initialization took ${end - start} ms`);
    return this;
  }

  generateOnPos(position: THREE.Vector3): void {
    const random = Math.random();
    const height = position.y;

    if (random < 0.005) {
      const cloudGeo = new Cloud(16).getGeo();
      cloudGeo.forEach(geo => geo.translate(position.x, height, position.z));
      this.meshBuilder.addGeometry('cloud', cloudGeo);
    }

    switch (true) {
      case height < World.MAX_HEIGHT * 0.15:
        if (random < 0.35 && height > World.MAX_HEIGHT * 0.05) {
          const rockGeo = new Rock(clamp(0.2, 0.3, Math.random() * 0.3)).getGeo();
          this.assingRandomTilePos(rockGeo);
          rockGeo.forEach(geo => geo.translate(position.x, height, position.z));
          this.meshBuilder.addGeometry('rock', rockGeo);
        }
        break;
      case height < World.MAX_HEIGHT * 0.25:
        if (random < 0.075) {
          const treeGeo = this.tree_paradigm.getGeo().map(g => g.clone());
          this.configureGeo(treeGeo, position);

          this.meshBuilder.addGeometry('tree', treeGeo);
        } else if (random < 0.15) {
          const treeBaseGeo = this.tree_base_paradigm.getGeo().map(g => g.clone());
          this.configureGeo(treeBaseGeo, position);
          this.meshBuilder.addGeometry('tree_base', treeBaseGeo);
        }
        break;
      case height < World.MAX_HEIGHT * 0.5:
        if (random < 0.05) {
          const bushGeo = this.bush_paradigm.getGeo().map(g => g.clone());
          this.configureGeo(bushGeo, position);
          this.meshBuilder.addGeometry('bush', bushGeo);
        }
        break;
    }
  }

  getGenerated(): THREE.Group {
    return new THREE.Group().add(...this.meshBuilder.getMeshes());
  }

  reset() {
    this.meshBuilder.resetGeometry();
  }

  private configureGeo(geo: THREE.BufferGeometry[], position: THREE.Vector3) {
    geo.forEach(g => g.scale(0.35, 0.35, 0.35));
    geo.forEach(g => g.translate(position.x, position.y, position.z));
  }

  private assingRandomTilePos(geo: THREE.BufferGeometry[]) {
    const offset: THREE.Vec2 = { x: 0.25 + -Math.random() * 0.5, y: 0.25 + -Math.random() * 0.5 };
    geo.forEach(geo => geo.translate(offset.x, 0, offset.y));
  }
}
