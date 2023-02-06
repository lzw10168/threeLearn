import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, dbClkfullScreen, sizes } from '../../utils/utils';

// Canvas

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    /**
     * Particles
     */
    // geometry
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
    // 圆环
    const torusGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

    // material
    // size控制所有粒子大小的
    // sizeAttenuation用于指定远距离粒子是否应小于近距离粒子的
    const pointMaterial = new THREE.PointsMaterial({
      size: 0.02,
      sizeAttenuation: true,
    });

    const sphereParticles = new THREE.Points(sphereGeometry, pointMaterial);
    const cubeParticles = new THREE.Points(cubeGeometry, pointMaterial);
    const torusParticles = new THREE.Points(torusGeometry, pointMaterial);
    sphereParticles.position.x = -2;
    cubeParticles.position.x = 0;
    torusParticles.position.x = 2;
    scene.add(sphereParticles, cubeParticles, torusParticles);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.4);
    scene.add(ambientLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100,
    );
    camera.position.set(0, 0, 3);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    // controls.autoRotateSpeed = 0.2
    controls.zoomSpeed = 0.3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    listenResize(sizes, camera, renderer);
    dbClkfullScreen(document.body);

    // Animations
    const tick = () => {
      stats.begin();

      controls.update();
      pointMaterial.needsUpdate = true;

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
    gui.add(pointMaterial, 'size', 0.01, 0.1, 0.001);
    gui.add(pointMaterial, 'sizeAttenuation');
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
