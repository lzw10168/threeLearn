import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, sizes } from '../../utils/utils';
import {
  doorAlphaTexture,
  doorColorTexture,
  genuGeometry,
  tick,
} from './utils';

// Canvas
// 法线网格材质(MeshNormalMaterial)
// 一种把法向量映射到RGB颜色的材质。
// 可用于调试法线
// https://threejs.org/docs/index.html?q=MeshNormalMaterial#api/zh/materials/MeshNormalMaterial

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    const material = new THREE.MeshNormalMaterial({
      // wireframe: true,
      flatShading: true, // 平滑着色,
    });

    const { sphere, plane, torus } = genuGeometry(material);

    scene.add(sphere, plane, torus);

    // Size

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100,
    );
    camera.position.set(0, 0, 2);

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
      plane,
      torus,
      stats,
    });
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
