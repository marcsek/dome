import * as THREE from 'three';
import { PropsGenerator } from '../WorldGenerators/PropsGenerator';
import { World } from '../World';
import { Noise } from '../utils/Noise';
import { TileGenerator } from '../WorldGenerators/TileGenerator';

self.onmessage = async () => {
  const GENERATOR_PIPE = [TileGenerator, PropsGenerator];

  const generators = await Promise.all(GENERATOR_PIPE.map(async gen => await new gen().init()));

  for (let x = -World.MESH_SIZE / 2; x < World.MESH_SIZE / 2; x++) {
    for (let y = -World.MESH_SIZE / 2; y < World.MESH_SIZE / 2; y++) {
      const position = tileToPos({ x, y });

      if (Math.ceil(position.length()) > World.MESH_SIZE / Math.sqrt(2)) continue;

      const height = generateHeight({ x, y });

      generators.forEach(gen => gen.generateOnPos(new THREE.Vector3(position.x, height, position.y)));
    }
  }

  self.postMessage([...generators.map(gen => gen.getGenerated().children)]);
};

function generateHeight({ x, y }: THREE.Vec2) {
  let noise = Noise.perlinNoise((x + World.MESH_SIZE) * 0.2, (y + World.MESH_SIZE) * 0.2);
  noise = (noise * 10) ** 2.25;

  return noise / 10;
}

function tileToPos(tile: THREE.Vec2) {
  return new THREE.Vector2((tile.x + (tile.y % 2) * 0.5) * 1.77, tile.y * 1.535);
}
