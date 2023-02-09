import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, dbClkfullScreen } from '../../utils/utils';
import setup from './setup';

// Canvas
// raycaster  光线投射器

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    const { camera, scene, controls, renderer } = setup(canvas);

    /**
     * Objects
     */
    const object1 = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: '#B71C1C' }),
    );
    object1.position.setX(-4);
    const object2 = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: '#B71C1C' }),
    );
    const object3 = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: '#B71C1C' }),
    );
    object3.position.setX(4);

    scene.add(object1, object2, object3);

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial(),
    );
    cube.position.setY(-8);
    scene.add(cube);

    const directionLight = new THREE.DirectionalLight();
    directionLight.position.set(1, 1, 1);
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color('#ffffff'),
      0.3,
    );
    scene.add(ambientLight, directionLight);

    const directionLightHelper = new THREE.DirectionalLightHelper(
      directionLight,
      2,
    );
    scene.add(directionLightHelper);

    /**
     * Raycaster 光线投射器
     */
    const raycaster = new THREE.Raycaster();
    const rayOrigin = new THREE.Vector3(-6, 0, 0);
    const rayDirections = new THREE.Vector3(10, 0, 0);
    rayDirections.normalize();
    raycaster.set(rayOrigin, rayDirections);

    const arrowHelper = new THREE.ArrowHelper(
      raycaster.ray.direction,
      raycaster.ray.origin,
      15,
      0xff0000,
      1,
      0.5,
    );
    scene.add(arrowHelper);

    // Animations
    const clock = new THREE.Clock();
    const tick = () => {
      stats.begin();

      const elapsedTime = clock.getElapsedTime();
      object1.position.setY(Math.sin(elapsedTime * 2) * 2);
      object2.position.setY(Math.sin(elapsedTime * 1.5) * 2);
      object3.position.setY(Math.sin(elapsedTime * 3) * 2);

      const objectsToTest = [object1, object2, object3];
      // 拿到有交集的物体
      const intersects = raycaster.intersectObjects(objectsToTest);

      objectsToTest.forEach((item) => {
        item.material.color.set('#B71C1C');
      });

      intersects.forEach((item: any) => {
        item.object.material.color.set('#F9A825');
      });

      controls.update();

      // Render
      renderer.render(scene, camera);
      stats.end();
      requestAnimationFrame(tick);
    };

    tick();

    /**
     * Debug
     */
    const gui = new dat.GUI();

    gui.add(controls, 'autoRotate');
    gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01);
    gui.add(arrowHelper, 'visible').name('arrowHelper visible');
    gui
      .add(directionLightHelper, 'visible')
      .name('directionLightHelper visible');
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
