import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ThreePerf } from 'three-perf';
import Stats from 'stats.js';

let start = 0;
let firstRender = true;

const log = () => {
  if (firstRender) {
    const end = performance.now();
    console.log(`Time to first render ${end - start} ms`);
  }
  firstRender = false;
};

export abstract class App {
  protected renderer: THREE.WebGLRenderer;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected oControls: OrbitControls;
  protected pmrem: THREE.PMREMGenerator;
  protected stats: Stats;
  protected perfStat: ThreePerf;
  protected effectComposer: EffectComposer;
  isPlaying = false;

  constructor(parentElement: HTMLElement) {
    start = performance.now();
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

    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.addPass(new RenderPass(this.scene, this.camera));

    this.stats = new Stats();
    //    parentElement.appendChild(this.stats.dom);

    this.perfStat = new ThreePerf({ anchorX: 'left', anchorY: 'top', renderer: this.renderer, domElement: parentElement });

    this.renderer.setAnimationLoop(this.animationLoop.bind(this));

    this.initWindowResizer();
  }

  abstract update(time: number): void;

  private animationLoop(time: number) {
    if (this.isPlaying) {
      this.perfStat.begin();

      this.update(time);
      this.oControls.update();

      this.effectComposer.render();
      log();

      this.perfStat.end();
    }
  }

  private initWindowResizer() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.effectComposer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
