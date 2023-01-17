import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import gsap from 'gsap';
import { listenResize, sizes } from '../../utils/utils';
import {
  doorAlphaTexture,
  envMapTexture,
  getRandomEnvMap,
} from './utils/index';
import {
  doorHeightTexture,
  doorMetalnessTexture,
  doorNormalTexture,
  doorRoughnessTexture,
} from './utils/index';
import {
  doorAmbientOcclusionTexture,
  doorColorTexture,
  genuGeometry,
  gradientTexture,
  tick,
} from './utils';

/**
 * 
 *  MeshStandardMaterial使用基于物理的渲染原理。是的，我们正在谈论我们在纹理课程中看到的 PBR。与MeshLambertMaterial和MeshPhongMaterial 一样，它支持灯光，但具有更逼真的算法和更好的参数，如粗糙度和金属度。
    之所以称为“标准”，是因为 PBR 正在成为许多软件、引擎和库中的标准。这个想法是用真实的参数获得真实的结果，无论您使用何种技术，您都应该得到非常相似的结果：
 */

function Index() {
  const material = new THREE.MeshStandardMaterial({
    metalness: 0.8,
    roughness: 0,
    envMap: envMapTexture,
  });

  // Scene
  const scene = new THREE.Scene();

  const { sphere, plane, torus } = genuGeometry(material);
  // 创建一个正方体
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

  scene.add(sphere, cube, torus);

  // debug
  const debugObj = {
    changeEnv() {
      material.envMap = getRandomEnvMap();
      material.needsUpdate = true;
    },
  };
  const gui = new dat.GUI();
  gui.add(debugObj, 'changeEnv'); // function

  // camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.set(0, 0, 2);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 0.9);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(pointLight);

  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    listenResize(sizes, camera, renderer);

    // Clock
    const clock = new THREE.Clock();
    // Animations
    tick({
      clock,
      renderer,
      scene,
      camera,
      controls,
      sphere,
      plane: cube,
      torus,
      stats,
    });
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
