import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, dbClkfullScreen, sizes } from '../../utils/utils';

export default function setup(canvas: HTMLElement | undefined) {
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.set(-14, 10, 25);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.zoomSpeed = 0.3;
  controls.enableRotate = true;
  controls.autoRotateSpeed = 1;
  controls.autoRotate = true;
  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 0);

  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  scene.add(directionalLight);
  listenResize(sizes, camera, renderer);
  dbClkfullScreen(document.body);
  return {
    scene,
    camera,
    controls,
    renderer,
  };
}
