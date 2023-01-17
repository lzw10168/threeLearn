import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import stats from '../../utils/stats';
import { listenResize, dbClkfullScreen } from '../../utils/utils';

// Canvas

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    // Object
    // const geometry = new THREE.BufferGeometry();

    // const vertices = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]);

    // geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // Create an empty BufferGeometry
    const geometry = new THREE.BufferGeometry();

    // Create 50 triangles (450 values)
    const count = 50;
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 4;
    }

    // Create the attribute and name it 'position'
    const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
    geometry.setAttribute('position', positionsAttribute);
    // const geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3);
    // const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x607d8b,
      wireframe: true,
    });
    const triangle = new THREE.Mesh(geometry, material);
    scene.add(triangle);

    // Size
    const sizes = {
      width: window.innerWidth - 340,
      height: window.innerHeight - 100,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      1,
      100,
    );
    camera.position.set(0, 0, 3);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    // controls.enabled = false

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    dbClkfullScreen(canvas);
    listenResize(sizes, camera, renderer);

    // Animations
    const tick = () => {
      stats.begin();

      controls.update();
      // Render
      renderer.render(scene, camera);
      stats.end();
      requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
