import { dbClkfullScreen } from '@/utils/utils';
import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import stats from '../../utils/stats';

// Canvas

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    // Object
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x607d8b,
      }),
    );
    scene.add(cube);

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

    window.addEventListener('resize', () => {
      // update sizes
      sizes.width = window.innerWidth - 340;
      sizes.height = window.innerHeight - 100;

      // update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

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
