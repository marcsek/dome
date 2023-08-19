import * as THREE from 'three';

export class CompileObservable {
  private static instance: CompileObservable;

  observsers: ((data: THREE.Object3D[]) => void)[];

  private constructor() {
    this.observsers = [];
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new CompileObservable();
    }

    return this.instance;
  }

  subscribe(func: (data: THREE.Object3D[]) => void) {
    this.observsers.push(func);
  }

  precompile(data: THREE.Object3D | THREE.Object3D[]) {
    const onlyArray = Array.isArray(data) ? data : [data];
    this.observsers.forEach(observer => observer(onlyArray));
  }
}
