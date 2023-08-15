import * as THREE from 'three';
import { MeshBuilder } from '../MeshBuilder';
import { WorldGenerator } from '../WorldGenerator';
import { World } from '../World';
import { Dome } from '../Dome';

export class TileGenerator extends WorldGenerator {
  private meshBuilder: MeshBuilder;

  constructor() {
    super();

    this.meshBuilder = new MeshBuilder();
  }

  async init() {
    const start = performance.now();

    const textureLoader = new THREE.TextureLoader();

    const stone = await textureLoader.loadAsync('/public/textures/stone.jpg');
    const sand = await textureLoader.loadAsync('/public/textures/sand.jpg');
    const grass = await textureLoader.loadAsync('/public/textures/grass.jpg');
    const dirt_dark = await textureLoader.loadAsync('/public/textures/dirt_dark.jpg');
    const dirt_light = await textureLoader.loadAsync('/public/textures/dirt_light.jpg');

    stone.colorSpace = THREE.SRGBColorSpace;
    sand.colorSpace = THREE.SRGBColorSpace;
    grass.colorSpace = THREE.SRGBColorSpace;
    dirt_dark.colorSpace = THREE.SRGBColorSpace;
    dirt_light.colorSpace = THREE.SRGBColorSpace;

    this.meshBuilder.setMaterials([
      { key: 'stone', material: new THREE.MeshPhysicalMaterial({ map: stone, flatShading: true, envMapIntensity: Dome.ENV_INTENSITY }) },
      { key: 'sand', material: new THREE.MeshPhysicalMaterial({ map: sand, flatShading: true, envMapIntensity: Dome.ENV_INTENSITY }) },
      { key: 'grass', material: new THREE.MeshPhysicalMaterial({ map: grass, flatShading: true, envMapIntensity: Dome.ENV_INTENSITY }) },
      {
        key: 'dirt_dark',
        material: new THREE.MeshPhysicalMaterial({ map: dirt_dark, flatShading: true, envMapIntensity: Dome.ENV_INTENSITY }),
      },
      {
        key: 'dirt_light',
        material: new THREE.MeshPhysicalMaterial({ map: dirt_light, flatShading: true, envMapIntensity: Dome.ENV_INTENSITY }),
      },
    ]);

    this.meshBuilder.updateGlobally(mesh => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

    const end = performance.now();
    console.log(`Tile initialization took ${end - start} ms`);
    return this;
  }

  generateOnPos(position: THREE.Vector3) {
    const newHex = this.generateHexagon(position.y, { x: position.x, y: position.z });
    const height = position.y;

    switch (true) {
      case height < World.MAX_HEIGHT * 0.15:
        this.meshBuilder.addGeometry('sand', newHex);
        break;
      case height < World.MAX_HEIGHT * 0.25:
        this.meshBuilder.addGeometry('grass', newHex);
        break;
      case height < World.MAX_HEIGHT * 0.4:
        this.meshBuilder.addGeometry('dirt_light', newHex);
        break;
      case height < World.MAX_HEIGHT * 0.5:
        this.meshBuilder.addGeometry('dirt_dark', newHex);
        break;
      default:
        this.meshBuilder.addGeometry('stone', newHex);
    }
  }

  reset() {
    this.meshBuilder.resetGeometry();
  }

  getGenerated(): THREE.Group {
    return new THREE.Group().add(...this.meshBuilder.getMeshes());
  }

  private generateHexagon(height: number, position: THREE.Vec2) {
    const hex = new THREE.CylinderGeometry(1, 1, height, 6, 1, false);

    hex.translate(position.x, height * 0.5, position.y);

    return hex;
  }
}
