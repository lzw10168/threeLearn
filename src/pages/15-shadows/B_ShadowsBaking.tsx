/**
 * @description: B_ShadowsBaking 烘焙阴影
 * 阴影贴图是静态的，如果球体或灯光移动，阴影也不会
 */
import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize } from '../../utils/utils';

// Canvas

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    // Texture
    const textureLoader = new THREE.TextureLoader();
    const bakedShadow = textureLoader.load(
      '../assets/textures/bakedShadow.jpg',
    );

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial();
    material.metalness = 0;
    material.roughness = 0.4;

    // Objects
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      material,
    );
    // sphere.castShadow = true;
    //map: bakedShadow 不是动态的，如果球体或灯光移动，阴影也不会
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshBasicMaterial({
        map: bakedShadow,
      }),
    );
    plane.rotation.set(-Math.PI / 2, 0, 0);
    plane.position.set(0, -0.5, 0);
    // plane.receiveShadow = true;

    scene.add(sphere, plane);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('#ffffaa', 0.5);
    directionalLight.position.set(1, 0.75, 1);
    // directionalLight.castShadow = true;
    scene.add(directionalLight);

    // console.log(directionalLight.shadow)

    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
    );
    scene.add(directionalLightHelper);

    // Size
    const sizes = {
      width: window.innerWidth - 340,
      height: window.innerHeight - 100,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100,
    );
    camera.position.set(1, 1, 2);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    // controls.enabled = false

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

    /**
     * Debug
     */
    const gui = new dat.GUI();

    const autoRotateFolder = gui.addFolder('AutoRotate');
    autoRotateFolder.add(controls, 'autoRotate');
    autoRotateFolder.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01);

    const meshFolder = gui.addFolder('Mesh');
    meshFolder.add(material, 'metalness', 0, 1, 0.0001);
    meshFolder.add(material, 'roughness', 0, 1, 0.0001);
    meshFolder.add(material, 'wireframe');

    const ambientLightFolder = gui.addFolder('AmbientLight');
    ambientLightFolder.add(ambientLight, 'visible').listen();
    ambientLightFolder.add(ambientLight, 'intensity', 0, 1, 0.001);

    const directionalLightFolder = gui.addFolder('DirectionalLight');
    directionalLightFolder
      .add(directionalLight, 'visible')
      .onChange((visible: boolean) => {
        directionalLightHelper.visible = visible;
        // directionalLightCameraHelper.visible = visible
      })
      .listen();
    directionalLightFolder
      .add(directionalLightHelper, 'visible')
      .name('helper visible')
      .listen();
    // directionalLightFolder
    //   .add(directionalLightCameraHelper, 'visible')
    //   .name('camera helper visible')
    //   .listen()
    directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.001);
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
