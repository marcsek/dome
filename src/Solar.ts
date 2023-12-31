import * as THREE from 'three';
import { ModelGroup } from './ModelGroup';
import { clamp, oscilate, wrap } from './utils/Math';
import { World } from './World';
import { Dome } from './Dome';
const moonUrl = new URL('/public/models/moon.gltf', import.meta.url).href;
const baseUrl = new URL('/public/models/base.gltf', import.meta.url).href;

export class Solar {
  private skyColor: THREE.Color;
  private centerPoint: THREE.Group;
  private rotatePoint: THREE.Group;
  private sunLight: THREE.PointLight;
  private moonLight: THREE.PointLight;

  private readonly DAY_COLOR = new THREE.Color('#d1b26b');
  private readonly NIGHT_COLOR = new THREE.Color('#101010');
  private readonly SUN_COLOR = new THREE.Color('#FDB813');
  private readonly MOON_COLOR = new THREE.Color('#f5e38a');

  constructor() {
    this.centerPoint = new THREE.Group();
    this.rotatePoint = new THREE.Group();
    this.sunLight = new THREE.PointLight();
    this.moonLight = new THREE.PointLight();
    this.skyColor = this.DAY_COLOR;
  }

  async init() {
    const start = performance.now();

    const sunGeo = new THREE.SphereGeometry(1, 12, 12);
    const sunMat = new THREE.MeshStandardMaterial({
      toneMapped: false,
      emissive: this.SUN_COLOR,
      color: this.SUN_COLOR,
      emissiveIntensity: 10,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    const sunLight = new THREE.PointLight(this.SUN_COLOR, 5, 1000, 0.2);
    sunLight.add(sunMesh);
    //sunLight.position.set(10, 20, 10);
    sunLight.position.set(World.MESH_SIZE / Math.sqrt(2) + 3, 0, 0);
    sunLight.castShadow = true;

    const moon = await new ModelGroup().load(moonUrl);
    console.log(moon);
    moon.setMaterial(prev => new THREE.MeshPhysicalMaterial({ ...prev, toneMapped: false, emissiveIntensity: 1.5 }));

    const base = await new ModelGroup().load(baseUrl);
    base.setMaterial(prev => new THREE.MeshPhysicalMaterial({ ...prev, envMapIntensity: Dome.ENV_INTENSITY }));
    base.modifyMeshAtt(mesh => (mesh.receiveShadow = true));
    base.getGeo().forEach(g => {
      g.scale(26, 25, 26);
      g.translate(0, 10, 0);
    });

    const moonLight = new THREE.PointLight(this.MOON_COLOR, 1.5, 1000, 0.2);
    moonLight.add(...moon.getMesh());
    //moonLight.position.set(10, 20, 10);
    moonLight.position.set(-World.MESH_SIZE / Math.sqrt(2) - 3, 0, 0);
    moonLight.castShadow = true;

    this.sunLight = sunLight;
    this.moonLight = moonLight;
    this.rotatePoint.add(sunLight, moonLight);
    this.centerPoint.add(this.rotatePoint, ...base.getMesh());

    const end = performance.now();
    console.log(`Solar initialization took ${end - start} ms`);
  }

  getObjectToRender() {
    return this.centerPoint;
  }

  getSkyColor() {
    return this.skyColor;
  }

  update(time: number) {
    const speed = 4;
    const increment = speed * (time / 10000);

    this.rotatePoint.rotation.z = Math.PI;
    //this.centerPoint.rotation.z = -Math.PI / 3;
    this.skyColor = this.NIGHT_COLOR;

    this.moonLight.intensity = clamp(0, 1, oscilate(increment - 1, -1, 1)) * 1.5;
    this.sunLight.intensity = clamp(0, 1, oscilate(increment + 1, -1, 1)) * 5;
    this.rotatePoint.rotation.z = wrap(increment / 4, 0, 1) * Math.PI * 2;
    this.skyColor = new THREE.Color().lerpColors(this.NIGHT_COLOR, this.DAY_COLOR, clamp(0, 1, oscilate(increment + 1, -1, 1)));
  }
}
