import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, dbClkfullScreen, sizes } from '../../utils/utils';

export default function setup() {
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;
  const scene = new THREE.Scene();
  //  setUp
  // Camera
  // Group
  const cameraGroup = new THREE.Group();
  scene.add(cameraGroup);

  // Base camera
  const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.z = 6;
  cameraGroup.add(camera);
  camera.position.set(0, 0, 5.5);
  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,

    // antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  // scene.add(ambientLight);

  /**
   * Lights
   */
  const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
  directionalLight.position.set(1, 1, 0);
  scene.add(directionalLight);
  return {
    scene,
    camera,
    cameraGroup,
    canvas,
    // controls,
    renderer,
  };
}
