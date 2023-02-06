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
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load(
      'https://gw.alicdn.com/imgextra/i3/O1CN01DO6Ed61QtcMKsVnK2_!!6000000002034-2-tps-56-56.png',
    );

    /**
     * Particles
     */
    // geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 20000;
    const positions = new Float32Array(count * 3); // 每个点由三个坐标值组成（x, y, z）
    const colors = new Float32Array(count * 3); // 每个颜色由三个rgb组成
    for (let i = 0; i < count * 3; i += 1) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3),
    );

    // material
    const pointMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
    });

    // pointMaterial.color = new THREE.Color('#ff88cc')
    // pointMaterial.map = particleTexture
    pointMaterial.alphaMap = particleTexture;
    pointMaterial.transparent = true;
    // 小余alphaTest的alpha值的像素将被丢弃
    // pointMaterial.alphaTest = 0.001
    // WebGL 会测试正在绘制的内容是否比已经绘制的内容更接近。这称为深度测试，可以停用.
    // 但如果您的场景中有其他对象或具有不同颜色的粒子，则停用深度测试可能会产生错误。粒子可能被绘制为好像它们在场景的其余部分之上。
    // pointMaterial.depthTest = false
    // 一般情况下，如果您的粒子是半透明的，则应禁用深度写入。这样，粒子将不会覆盖任何其他对象。
    pointMaterial.depthWrite = false;
    // 通过更改blending属性，我们可以告诉 WebGL 不仅要绘制像素，还要将该像素的颜色添加到已绘制像素的颜色中。这将具有看起来惊人的饱和效果。
    pointMaterial.blending = THREE.AdditiveBlending;
    // 激活这些顶点颜色，只需将vertexColors属性更改为true：
    pointMaterial.vertexColors = true;

    const particles = new THREE.Points(particlesGeometry, pointMaterial);
    scene.add(particles);

    // cube
    // const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial())
    // scene.add(cube)

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight('#ffffff', 1);
    scene.add(ambientLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100,
    );
    camera.position.set(2, 1.8, 2);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.autoRotateSpeed = 1;
    controls.zoomSpeed = 0.3;

    // const axesHelper = new THREE.AxesHelper(1)
    // scene.add(axesHelper)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      // antialias: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    listenResize(sizes, camera, renderer);
    dbClkfullScreen(document.body);

    // Animations
    const clock = new THREE.Clock();
    const tick = () => {
      stats.begin();

      const elapsedTime = clock.getElapsedTime();

      // particles.position.x = 0.1 * Math.sin(elapsedTime)

      for (let i = 0; i < count; i += 1) {
        const x = particlesGeometry.attributes.position.getX(i);
        particlesGeometry.attributes.position.setY(
          i,
          Math.sin(elapsedTime + x),
        );
        // console.log(Math.sin(elapsedTime + x));
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      controls.update();
      // pointMaterial.needsUpdate = true

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
    gui.close();
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
