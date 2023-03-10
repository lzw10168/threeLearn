import { useEffect } from 'react';
/* eslint-disable max-len */
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import stats from '../../utils/stats';
import { listenResize } from '../../utils/utils';

/**
 * Textures
 */

function Index() {
  useEffect(() => {
    const image = new Image();
    // image.src = './assets/textures/door/color.jpg'
    // const texture = new THREE.Texture(image)
    // image.onload = () => {
    //   texture.needsUpdate = true
    // }
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log(
        `Started loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`,
      );
    };
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(
        `Loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`,
      );
    };
    loadingManager.onLoad = () => {
      console.log('Loading complete!');
    };
    loadingManager.onError = (url) => {
      console.log(`There was an error loading ${url}`);
    };

    const textureLoader = new THREE.TextureLoader(loadingManager);
    // const colorTexture = textureLoader.load(
    //   'https://gw.alicdn.com/imgextra/i4/O1CN01Ow2oCS1m9kEL8DTpD_!!6000000004912-2-tps-16-16.png',
    // );
    const colorTexture = textureLoader.load(
      './assets/textures/TerrazzoSlab003/TerrazzoSlab003_COL_2K_METALNESS.png',
    );
    // const colorTexture = textureLoader.load(
    //   './assets/textures/door/color.jpg',
    // );
    // const alphaTexture = textureLoader.load('./assets/textures/door/alpha.jpg')
    // const ambientOcclusionTexture = textureLoader.load(
    //   './assets/textures/door/ambientOcclusion.jpg',
    // );
    // const heightTexture = textureLoader.load('./assets/textures/door/height.jpg')
    // const metalnessTexture = textureLoader.load(
    //   './assets/textures/door/metalness.jpg',
    // );
    // colorTexture.repeat.x = 3;
    // colorTexture.repeat.y = 3;
    // colorTexture.offset.x = 1;
    // colorTexture.offset.y = 1;
    // colorTexture.wrapS = THREE.MirroredRepeatWrapping;
    // colorTexture.wrapT = THREE.MirroredRepeatWrapping;

    // colorTexture.offset.x = 0.5
    // colorTexture.offset.y = 0

    // colorTexture.wrapS = THREE.RepeatWrapping;
    // colorTexture.wrapT = THREE.RepeatWrapping;
    colorTexture.center = new THREE.Vector2(0.5, 0.5);
    colorTexture.rotation = Math.PI / 4;

    colorTexture.magFilter = THREE.NearestFilter;
    colorTexture.generateMipmaps = false;

    // Canvas
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(1);
    // const geometry = new THREE.SphereGeometry(1, 32, 32);
    // const geometry = new THREE.ConeGeometry(1, 1, 32);
    // const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100);
    const material = new THREE.MeshBasicMaterial({
      // color: 0x607d8b,
      map: colorTexture,
    });
    // console.log(box.attributes.uv)

    // Object
    const cubeMesh = new THREE.Mesh(geometry, material);
    scene.add(cubeMesh);
    colorTexture.minFilter = THREE.NearestFilter;
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
    camera.position.set(0, 0, 2.6);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    // controls.enabled = false

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
