import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, sizes } from '../../utils/utils';
import { genuGeometry, tick } from './utils';

// MeshPhongMaterial与MeshLambertMaterial非常相似，但渲染更优秀，还可以看到几何体表面的光反射：
// MeshPhongMaterial的性能不如MeshLambertMaterial, 但是 不是很重要.
function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    const material = new THREE.MeshPhongMaterial({
      shininess: 100, // 光泽度
      specular: 0x1188ff, // 镜面高光的颜色
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

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(pointLight);

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
