import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, sizes } from '../../utils/utils';
import { genuGeometry, matcapTexture1, matcapTexture2, tick } from './utils';

// 如果MeshDepthMaterial 接近相机的值， MeshDepthMaterial将简单地将几何体着色为白色，如果它接近相机的near值，则为黑色far：
// https://threejs.org/docs/index.html#api/en/materials/MeshDepthMaterial

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    const material = new THREE.MeshMatcapMaterial({});

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
