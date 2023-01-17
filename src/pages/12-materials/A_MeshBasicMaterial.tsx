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

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;
    const gui = new dat.GUI();

    // Scene
    const scene = new THREE.Scene();

    const material = new THREE.MeshBasicMaterial({
      map: doorColorTexture, // 纹理贴图
      color: new THREE.Color('#ffffff'), // 颜色
      // wireframe: true, // 线框
      transparent: true,
      // opacity: 0.5, // 属性控制透明度, transparent 必须为 true
      alphaMap: doorAlphaTexture, // 控制纹理贴图的透明度
      side: THREE.DoubleSide, // 双面渲染, 增加性能消耗
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
    /**
     * Debug
     */

    gui.add(material, 'metalness')?.min(0).max(1).step(0.0001);
    gui.add(material, 'roughness')?.min(0).max(1).step(0.0001);
    gui.add(material, 'aoMapIntensity')?.min(0).max(1).step(0.0001);
    gui.add(material, 'displacementScale')?.min(0).max(0.1).step(0.0001);
    gui.add(material, 'shininess ')?.min(0).max(100).step(0.0001);
    gui.add(material, 'wireframe');
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
