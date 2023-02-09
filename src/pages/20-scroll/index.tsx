import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, dbClkfullScreen, sizes } from '../../utils/utils';
import setup from './setup';
import './index.css';
import gsap from 'gsap';
function Index() {
  useEffect(() => {
    //  setUp
    const { scene, camera, renderer, cameraGroup } = setup();
    const gui = new dat.GUI();

    const parameters = { materialColor: 0xece4e4 };
    const objectsDistance = 4;
    // Texture
    const textureLoader = new THREE.TextureLoader();
    // 由 3 个像素组成，从暗到亮。默认情况下，WebGL 不会选择纹理上最近的像素，而是尝试对像素进行插值。
    // 对于我们的体验外观而言，这通常是个好主意，但在这种情况下，它会创建渐变而不是卡通效果
    // https://threejs.org/docs/index.html?q=mesh#api/en/materials/MeshToonMaterial
    const gradientTexture = textureLoader.load(
      './assets/textures/gradients/3.jpg',
    );
    gradientTexture.magFilter = THREE.NearestFilter;
    // Material
    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gradientTexture,
    });

    // Meshes
    const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2), material);

    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material,
    );
    mesh1.position.set(2, -objectsDistance * 0, 0);
    mesh2.position.set(-2, -objectsDistance * 1, 0);
    mesh3.position.set(2, -objectsDistance * 2, 0);
    const sectionMeshes = [mesh1, mesh2, mesh3];
    scene.add(mesh1, mesh2, mesh3);

    /**
     * Scroll
     */
    const content = document.querySelector('.content') as HTMLElement;
    let scrollY = content.scrollTop;
    let currentSection = -1;
    content.addEventListener('scroll', () => {
      scrollY = content.scrollTop;
      const newSection = Math.round(scrollY / sizes.height);

      if (newSection !== currentSection) {
        currentSection = newSection;
        gsap.to(sectionMeshes[currentSection].rotation, {
          duration: 1.5,
          ease: 'power2.inOut',
          x: '+=16',
          y: '+=13',
          z: '+=5.5',
        });
      }
    });

    /**
     * Cursor
     */
    const cursor = { x: 0, y: 0 };
    window.addEventListener('mousemove', (event) => {
      // 让一个值从0到1不如让一个值从-0.5到更好0.5。这样，我们就可以将它们直接添加到相机的位置中，而不需要做任何其他计算。
      cursor.x = event.clientX / sizes.width - 0.5;
      cursor.y = event.clientY / sizes.height - 0.5;
    });

    /**
     * particles
     *
     */
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] =
        objectsDistance * 0.5 -
        Math.random() * objectsDistance * sectionMeshes.length;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      color: parameters.materialColor,
      sizeAttenuation: true,
      size: 0.03,
    });
    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    /**
     * 触发旋转
     */

    const clock = new THREE.Clock();
    let previousTime = 0;
    const tick = () => {
      stats.begin();

      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      // Animate meshes
      for (const mesh of sectionMeshes) {
        mesh.rotation.x = deltaTime * 0.1;
        mesh.rotation.y = deltaTime * 0.12;
      }
      camera.position.y = (-scrollY / sizes.height) * objectsDistance;

      const parallaxX = cursor.x * 0.5;
      const parallaxY = -cursor.y * 0.5;
      cameraGroup.position.x +=
        (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
      cameraGroup.position.y +=
        (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
      // cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.1;
      // cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.1;
      // Render
      renderer.render(scene, camera);
      stats.end();
      requestAnimationFrame(tick);
    };

    tick();
    renderer.render(scene, camera);

    gui.addColor(parameters, 'materialColor').onChange(() => {
      material.color.set(parameters.materialColor);
      particlesMaterial.color.set(parameters.materialColor);
    });
  });
  return (
    <div className="container">
      <canvas id="mainCanvas" />
      <div className="content">
        <h1 className="section">MY PORTFOLIO</h1>
        <h1 className="section section2">CONTENT</h1>
        <h1 className="section">CONTACT ME</h1>
      </div>
    </div>
  );
}

export default Index;
