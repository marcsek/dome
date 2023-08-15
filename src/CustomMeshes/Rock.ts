import { CustomMesh } from '../CustomMesh';
import * as THREE from 'three';
import { Dome } from '../Dome';

export class Rock extends CustomMesh {
  constructor(radius: number) {
    super();
    const rockGeo = new THREE.SphereGeometry(radius, 7, 7);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0xf3c4a6, flatShading: true, envMapIntensity: Dome.ENV_INTENSITY });
    const rock = new THREE.Mesh(rockGeo, rockMat);

    rock.castShadow = true;
    rock.receiveShadow = true;

    this.model.add(rock);
  }
}
