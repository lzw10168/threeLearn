import { sizes } from '@/utils/utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';


export default function setup(canvas: HTMLElement | undefined) {
  // Camera
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    20,
    sizes.width / sizes.height,
    0.1,
    10000,
  );
  camera.position.set(5, 50, 150);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.zoomSpeed = 0.3;
  controls.target.set(5, 10, 0);


  /**
     * Light
     */
  const directionLight = new THREE.DirectionalLight('#ffffff', 1);
  directionLight.castShadow = true;
  directionLight.shadow.camera.top = 50;
  directionLight.shadow.camera.right = 50;
  directionLight.shadow.camera.bottom = -50;
  directionLight.shadow.camera.left = -50;
  directionLight.shadow.camera.near = 1;
  directionLight.shadow.camera.far = 200;
  directionLight.shadow.mapSize.set(2048, 2048);
  const directionalLightCameraHelper = new THREE.CameraHelper(
    directionLight.shadow.camera,
  );
  directionalLightCameraHelper.visible = false;
  scene.add(directionalLightCameraHelper);

  directionLight.position.set(-50, 80, 60);
  scene.add(directionLight);

  const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 3);
  scene.add(ambientLight);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return {
    scene,
    camera,
    controls,
    renderer
  }
}
