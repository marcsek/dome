import { App } from './App';
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { World } from './World';
import { TileGenerator } from './WorldGenerators/TileGenerator';
import { PropsGenerator } from './WorldGenerators/PropsGenerator';
import { Solar } from './Solar';
import { WorldGenerator } from './WorldGenerator';
import { Noise } from './utils/Noise';

export class Dome extends App {
  world: World;
  solar: Solar;
  generators: WorldGenerator[];

  static readonly ENV_INTENSITY = 0.13;
  private readonly GENERATOR_PIPE = [TileGenerator, PropsGenerator];

  constructor(parentElement: HTMLElement) {
    super(parentElement);

    this.world = new World();
    this.solar = new Solar();
    this.generators = [];
  }

  async setup() {
    const envMapTexture = await new RGBELoader().setDataType(THREE.FloatType).loadAsync('/public/env/sm_envmap.hdr');
    const envMap = this.pmrem.fromEquirectangular(envMapTexture).texture;
    this.scene.environment = envMap;

    this.effectComposer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.2, 0.5, 1));

    this.generators = await Promise.all(this.GENERATOR_PIPE.map(async gen => await new gen().init()));

    this.world.generateWorld(this.generators);
    await this.solar.init();

    this.scene.add(this.world.world, this.solar.getObjectToRender());
  }

  regenerateWorld() {
    Noise.resetPerlin();
    this.scene.remove(this.world.world);
    this.generators.forEach(gen => gen.reset());
    this.world.reset();
    this.world.generateWorld(this.generators);
    this.scene.add(this.world.world);
  }

  update(time: number): void {
    this.solar.update(time);
    this.scene.background = this.solar.getSkyColor();
  }
}
