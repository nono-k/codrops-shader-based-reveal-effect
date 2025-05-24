import * as THREE from 'three';
// eslint-disable-next-line import/no-unresolved
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';

import img1 from './images/textureupscaled.webp';

export default class Sketch {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xeeeeee, 1)

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 1;

    this.clock = new THREE.Clock();

    this.controls = new OrbitControls(this.camera, this.canvas);

    this.init();
    this.onResize();
  }

  init() {
    this.settings();
    this.createMesh();
    this.addEvents();
  }

  settings() {
    this.PARAMS = {
      percentage: 1.0,
    }
    this.pane = new Pane();
    this.pane.addBinding(
      this.PARAMS, 'percentage',
      { min: 0.0, max: 1.0, step: 0.01 }
    );
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(0.4, 0.6, 32, 32);
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        uTime: { value: 0.0 },
        uProgress: { value: 1.0 },
        uTexture: { value: new THREE.TextureLoader().load(img1) },
      },
      // wireframe: true,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  addEvents() {
    window.requestAnimationFrame(this.run.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  run() {
    requestAnimationFrame(this.run.bind(this));
    this.render();
  }

  render() {
    this.material.uniforms.uTime.value = this.clock.getElapsedTime();
    this.material.uniforms.uProgress.value = this.PARAMS.percentage;
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h);
  }
}

new Sketch(document.querySelector('#canvas'))

