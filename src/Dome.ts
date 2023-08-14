import { App } from './App';
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { World } from './World';
import { TileGenerator } from './WorldGenerators/TileGenerator';
import { PropsGenerator } from './WorldGenerators/PropsGenerator';
import { Solar } from './Solar';

export class Dome extends App {
  world: World;
  solar: Solar;

  static readonly ENV_INTENSITY = 0.13;

  constructor(parentElement: HTMLElement) {
    super(parentElement);

    this.world = new World();
    this.solar = new Solar();

    this.addMeshesh();
  }

  async addMeshesh() {
    const envMapTexture = await new RGBELoader().setDataType(THREE.FloatType).loadAsync('/public/env/envmap.hdr');
    const envMap = this.pmrem.fromEquirectangular(envMapTexture).texture;
    this.scene.environment = envMap;

    const generatorPipe = [TileGenerator, PropsGenerator];

    this.world.generateWorld(await Promise.all(generatorPipe.map(async gen => await new gen().init())));
    await this.solar.init();

    this.scene.add(this.world.world, this.solar.getObjectToRender());
  }

  update(time: number): void {
    this.solar.update(time);
    this.scene.background = this.solar.getSkyColor();
  }
}
