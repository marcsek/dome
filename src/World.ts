import * as THREE from 'three';
import { Noise } from './utils/Noise';
import { WorldGenerator } from './WorldGenerator';

export class World {
  static readonly MESH_SIZE = 32;
  static readonly MAX_HEIGHT = 10 ** 1.25;

  world: THREE.Group;

  constructor() {
    this.world = new THREE.Group();
  }

  generateWorld(generators: WorldGenerator[]) {
    Noise.noiseDetail(8, 0.5);
    for (let x = -World.MESH_SIZE / 2; x < World.MESH_SIZE / 2; x++) {
      for (let y = -World.MESH_SIZE / 2; y < World.MESH_SIZE / 2; y++) {
        const position = this.tileToPos({ x, y });

        if (Math.ceil(position.length()) > World.MESH_SIZE / Math.sqrt(2)) continue;

        const height = this.generateHeight({ x, y });

        generators.forEach(gen => gen.generateOnPos(new THREE.Vector3(position.x, height, position.y)));
      }
    }
    this.world.add(...generators.map(gen => gen.getGenerated()));
  }

  private generateHeight({ x, y }: THREE.Vec2) {
    let noise = Noise.perlinNoise((x + World.MESH_SIZE) * 0.2, (y + World.MESH_SIZE) * 0.2);
    noise = (noise * 10) ** 2.25;

    return noise / 10;
  }

  private tileToPos(tile: THREE.Vec2) {
    return new THREE.Vector2((tile.x + (tile.y % 2) * 0.5) * 1.77, tile.y * 1.535);
  }
}
