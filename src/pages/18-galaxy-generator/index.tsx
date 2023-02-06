import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, dbClkfullScreen, sizes } from '../../utils/utils';
// galaxy generator // 星系生成器

// Canvas
const parameters = {
  count: 10000,
  size: 0.01,
  radius: 5,
  // 分支
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
};

function Index() {
  useEffect(() => {
    const axes = new THREE.AxesHelper(6);
    // 将坐标轴添加到场景中
    // Scene
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();
    scene.add(axes);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100,
    );
    camera.position.set(4, 5, 4);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.zoomSpeed = 0.3;
    controls.autoRotateSpeed = 0.7;
    controls.autoRotate = true;

    let geometry: THREE.BufferGeometry;
    let material: THREE.PointsMaterial;
    let points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
    let colors = new Float32Array(parameters.count * 3);
    const generatorGalaxy = () => {
      if (points) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
      }
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle =
          ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        const randomX =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;

        const randomY =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;

        const randomZ =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;

        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] =
          Math.sin(branchAngle + spinAngle) * radius + randomZ;
      }
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      );

      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true, // 大小衰减
        // 粒子不会覆盖任何其他武器
        depthWrite: false, // 深度写入
        blending: THREE.AdditiveBlending, // 混合模式
        // 允许粒子的颜色从纹理中获取
        vertexColors: true,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
      // console.log(positions);
    };

    generatorGalaxy();

    // const cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(3, 3, 3),
    //   new THREE.MeshBasicMaterial({ color: 'red' }),
    // );
    // cube.position.set(4, 0, 0);
    // scene.add(cube);
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

    gui
      .add(parameters, 'count', 100, 100000, 100)
      .onFinishChange(generatorGalaxy);
    gui
      .add(parameters, 'size', 0.001, 0.1, 0.001)
      .onFinishChange(generatorGalaxy);
    gui
      .add(parameters, 'radius', 0.01, 20, 0.01)
      .onFinishChange(generatorGalaxy);
    gui.add(parameters, 'branches', 2, 20, 1).onFinishChange(generatorGalaxy);
    gui.add(parameters, 'spin', -5, 5, 0.001).onFinishChange(generatorGalaxy);
    gui
      .add(parameters, 'randomness', 0, 2, 0.001)
      .onFinishChange(generatorGalaxy);
    gui
      .add(parameters, 'randomnessPower', 1, 10, 0.001)
      .onFinishChange(generatorGalaxy);
    gui.addColor(parameters, 'insideColor').onFinishChange(generatorGalaxy);
    gui.addColor(parameters, 'outsideColor').onFinishChange(generatorGalaxy);
    gui.close();
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
