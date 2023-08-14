export abstract class WorldGenerator {
  abstract init(): Promise<this>;
  abstract generateOnPos(position: THREE.Vector3): void;
  abstract getGenerated(): THREE.Group;
}
