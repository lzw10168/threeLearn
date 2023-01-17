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
    const sizes = {
      width: window.innerWidth - 340,
      height: window.innerHeight - 100,
    };
    // Object
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x607d8b,
      }),
    );
    scene.add(cube);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      1,
      100,
    );

    // const aspectRatio = sizes.width / sizes.height;
    // const camera = new THREE.OrthographicCamera(
    //   -1 * aspectRatio,
    //   1 * aspectRatio,
    //   1,
    //   -1,
    //   0.1,
    //   100,
    // );

    camera.position.set(0, 0, 3);
    camera.lookAt(cube.position);

    // const controls = new OrbitControls(camera, canvas);
    const controls = new OrbitControls(camera, canvas);

    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

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
