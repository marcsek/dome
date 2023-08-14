import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js';

export abstract class App {
  protected renderer: THREE.WebGLRenderer;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected oControls: OrbitControls;
  protected pmrem: THREE.PMREMGenerator;
  protected stats: Stats;
  isPlaying = false;

  constructor(parentElement: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    parentElement.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 30, 50);

    this.oControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.oControls.listenToKeyEvents(window);
    this.oControls.enableDamping = true;

    this.pmrem = new THREE.PMREMGenerator(this.renderer);

    this.stats = new Stats();
    parentElement.appendChild(this.stats.dom);

    this.renderer.setAnimationLoop(this.animationLoop.bind(this));

    this.initWindowResizer();
  }

  abstract update(time: number): void;

  private animationLoop(time: number) {
    if (this.isPlaying) {
      this.stats.begin();

      this.update(time);
      this.oControls.update();
      this.renderer.render(this.scene, this.camera);

      this.stats.end();
    }
  }

  private initWindowResizer() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
