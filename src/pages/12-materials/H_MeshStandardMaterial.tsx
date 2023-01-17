import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, sizes } from '../../utils/utils';
import { doorAlphaTexture } from './utils/index';
import {
  doorHeightTexture,
  doorMetalnessTexture,
  doorNormalTexture,
  doorRoughnessTexture,
} from './utils/index';
import {
  doorAmbientOcclusionTexture,
  doorColorTexture,
  genuGeometry,
  gradientTexture,
  tick,
} from './utils';

/**
 * 
 *  MeshStandardMaterial使用基于物理的渲染原理。是的，我们正在谈论我们在纹理课程中看到的 PBR。与MeshLambertMaterial和MeshPhongMaterial 一样，它支持灯光，但具有更逼真的算法和更好的参数，如粗糙度和金属度。
    之所以称为“标准”，是因为 PBR 正在成为许多软件、引擎和库中的标准。这个想法是用真实的参数获得真实的结果，无论您使用何种技术，您都应该得到非常相似的结果：
 */

function Index() {
  const material = new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture, //doorAmbientOcclusionTexture
    aoMapIntensity: 1, // 环境遮挡强度
    //（displacementMap 置换贴图，也叫移位贴图）可以改变模型对象的几何形状，因此在提供最真实的效果的同时也会大幅增加渲染性能的开销
    displacementMap: doorHeightTexture, // 位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位
    displacementScale: 0.05,
    // metalness: 0.4, // 金属度
    // roughness: 0.5, // 粗糙度
    metalnessMap: doorMetalnessTexture, // 金属度贴图
    roughnessMap: doorRoughnessTexture, // 粗糙度贴图
    // http://www.yanhuangxueyuan.com/doc/Three.js/normalMap.html
    // 用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照。
    normalMap: doorNormalTexture,
    normalScale: new THREE.Vector2(1, 3), // 属性可以调节深浅程度
    transparent: true, // 支持透明度
    // alphaMap: doorAlphaTexture, // door透明度贴图 （黑色：完全透明；白色：完全不透明）。 默认值为null。
  });
  // debug ui
  const gui = new dat.GUI();
  gui.add(material, 'metalness').min(0).max(1).step(0.0001);
  gui.add(material, 'roughness').min(0).max(1).step(0.0001);
  gui.add(material, 'aoMapIntensity').min(0).max(1).step(0.0001);
  gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);

  // Scene
  const scene = new THREE.Scene();

  const { sphere, plane, torus } = genuGeometry(material);
  sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2),
  );
  plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2),
  );
  torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2),
  );
  scene.add(sphere, plane, torus);

  // camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.set(0, 0, 2);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 0.9);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(pointLight);

  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    listenResize(sizes, camera, renderer);

    // Clock
    const clock = new THREE.Clock();
    // Animations
    tick({
      clock,
      renderer,
      scene,
      camera,
      controls,
      sphere,
      plane,
      torus,
      stats,
    });
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
