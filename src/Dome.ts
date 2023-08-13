import { App } from './App';
import * as THREE from 'three';

export class Dome extends App {
  constructor(parentElement: HTMLElement) {
    super(parentElement);

    this.addMeshesh();
  }

  addMeshesh() {
    const sphere = new THREE.SphereGeometry(10, 20, 20);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this.scene.add(new THREE.Mesh(sphere, material));
  }
}
