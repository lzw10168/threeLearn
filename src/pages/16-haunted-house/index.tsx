import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, dbClkfullScreen, sizes } from '../../utils/utils';
import { cloneDeep } from 'lodash-es';
import {
  graveAmbientOcclusionTexture,
  graveColorTexture,
  graveHeightTexture,
  graveNormalTexture,
  graveRoughnessTexture,
} from './texture';
import {
  baseAmbientOcclusionTexture,
  baseColorTexture,
  baseHeightTexture,
  baseNormalTexture,
  baseRoughnessTexture,
  brickAmbientOcclusionTexture,
  brickColorTexture,
  brickHeightTexture,
  brickNormalTexture,
  brickRoughnessTexture,
  doorAlphaTexture,
  doorAmbientOcclusionTexture,
  doorColorTexture,
  doorHeightTexture,
  doorMetalnessTexture,
  doorNormalTexture,
  doorRoughnessTexture,
  floorAmbientOcclusionTexture,
  floorColorTexture,
  floorHeightTexture,
  floorNormalTexture,
  floorRoughnessTexture,
} from './texture';
const gui = new dat.GUI();

function genFloor() {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({
      map: floorColorTexture,
      aoMap: floorAmbientOcclusionTexture, // 环境遮挡贴图, 用于模拟光照的阴影，会在黑色区域产生阴影，白色区域不会产生阴影
      displacementMap: floorHeightTexture, // 凹凸感 位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位
      displacementScale: 0.1, // 位移纹理的缩放值
      normalMap: floorNormalTexture, // 法线贴图
      roughnessMap: floorRoughnessTexture, // 粗糙度贴图
    }),
  );
  floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2),
  );
  floor.rotation.set(-Math.PI / 2, 0, 0);
  floor.position.set(0, 0, 0);
  floor.receiveShadow = true;
  return floor;
}

function genHouse() {
  const house = new THREE.Group();
  return house;
}

function genBase() {
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 1, 4.4),
    new THREE.MeshStandardMaterial({
      // color: '#ac8e82',
      map: baseColorTexture,
      aoMap: baseAmbientOcclusionTexture, // 环境遮挡贴图, 用于模拟光照的阴影，会在黑色区域产生阴影，白色区域不会产生阴影
      displacementMap: baseHeightTexture, // 凹凸感 位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位
      displacementScale: 0.01, // 位移纹理的缩放值
      normalMap: baseNormalTexture, // 法线贴图
      roughnessMap: baseRoughnessTexture, // 粗糙度贴图
    }),
  );
  base.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(base.geometry.attributes.uv.array, 2),
  );
  return base;
}

function genWall() {
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4, 200, 200),
    new THREE.MeshStandardMaterial({
      // 线条
      // wireframe: true,
      map: brickColorTexture,
      aoMap: brickAmbientOcclusionTexture, // 环境遮挡贴图, 用于模拟光照的阴影，会在黑色区域产生阴影，白色区域不会产生阴影
      displacementMap: brickHeightTexture, // 凹凸感 位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位
      displacementScale: 0.001, // 位移纹理的缩放值
      normalMap: brickNormalTexture,
      roughnessMap: brickRoughnessTexture,
    }),
  );
  walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2),
  );
  walls.position.y = 1.5;
  walls.castShadow = true;
  return walls;
}

function genRoof() {
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 8),
    new THREE.MeshStandardMaterial({ color: '#b35f45' }),
  );
  // 不直接写3.5, 3是墙壁的高度, 0.5因为 锥体是1单位高（我们需要将它移动到其高度的一半）。
  roof.position.y = 3 + 0.5;
  roof.rotation.y = Math.PI / 4;
  return roof;
}

function genCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.set(7, 1.8, 8);
  return camera;
}

function genDoor() {
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
      // color: '#aa7b7b',
      map: doorColorTexture, // 门的颜色贴图
      transparent: true, // 支持透明度
      alphaMap: doorAlphaTexture, // 透明度贴图 （黑色：完全透明；白色：完全不透明）。 默认值为null。
      aoMap: doorAmbientOcclusionTexture, // 环境遮挡贴图
      displacementMap: doorHeightTexture, // 凹凸感 位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位
      displacementScale: 0.08, // 位移纹理的缩放值
      normalMap: doorNormalTexture, // 用于创建法线贴图的纹理。让光线方式更真实. RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照。
      normalScale: new THREE.Vector2(1, 4), // 属性可以调节深浅程度
      metalnessMap: doorMetalnessTexture, // 金属度贴图
      roughnessMap: doorRoughnessTexture, // 粗糙度贴图
    }),
  );
  // 该aoMap属性（字面意思是“环境遮挡贴图”）将在纹理较暗的地方添加阴影。为了让它起作用，您必须添加我们所说的第二组 UV（有助于在几何体上定位纹理的坐标）。
  door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2),
  );
  door.position.y = 1.5;
  // 但我们还添加了0.01单元。如果您不添加这个小值，您将遇到我们在上一课中看到的称为 z-fighting 的错误。当您有两张脸在同一位置（或非常接近）时，
  // 就会发生 Z-fighting。GPU 不知道哪一个比另一个更近，你会看到一些奇怪的视觉像素争斗。
  door.position.z = 2 + 0.001;
  console.log('door: ', door);
  return door;
}

function genBushes() {
  const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
  const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });
  const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.2);

  const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);

  const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.position.set(-0.8, 0.1, 2.2);

  const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.position.set(-1, 0.05, 2.6);

  bush1.castShadow = true;
  bush2.castShadow = true;
  bush3.castShadow = true;
  bush4.castShadow = true;
  return [bush1, bush2, bush3, bush4];
}

function genDoorLight() {
  const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
  doorLight.position.set(0, 2.7, 2.7);
  doorLight.castShadow = true;
  doorLight.shadow.mapSize.width = 256;
  doorLight.shadow.mapSize.height = 256;
  doorLight.shadow.camera.far = 7;
  return doorLight;
}

function genGraves() {
  //
  const graves = new THREE.Group();
  const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveAmbientOcclusionTexture,
    displacementMap: graveHeightTexture,
    normalMap: graveNormalTexture,
    roughnessMap: graveRoughnessTexture,
  });
  // 在房子周围放置墓碑
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, 0.4, z);
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true;
    grave.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(grave.geometry.attributes.uv.array, 2),
    );
    graves.add(grave);
  }

  return graves;
}

function genAmbientLight() {
  return new THREE.AmbientLight('#b9d5ff', 0.8);
}

function genDirectionalLight() {
  const directionalLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
  directionalLight.position.set(1, 0.75, 0);
  directionalLight.shadow.mapSize.width = 256;
  directionalLight.shadow.mapSize.height = 256;
  directionalLight.shadow.camera.far = 15;
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 256;
  directionalLight.shadow.mapSize.height = 256;
  directionalLight.shadow.camera.far = 15;
  return directionalLight;
}

function genGhost() {
  const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
  const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
  const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
  ghost1.position.set(0.5, 2, 2.5);
  ghost2.position.set(-0.5, 2, 2.5);
  ghost3.position.set(0.5, 2, -2.5);
  ghost1.castShadow = true;
  ghost2.castShadow = true;
  ghost3.castShadow = true;
  [ghost1, ghost2, ghost3].forEach((ghost) => {
    ghost.shadow.mapSize.width = 256;
    ghost.shadow.mapSize.height = 256;
    ghost.shadow.camera.far = 7;
  });
  return [ghost1, ghost2, ghost3];
}

function moveGhosts(ghosts: THREE.PointLight[], elapsedTime: number) {
  const [ghost1, ghost2, ghost3] = ghosts;
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
}

function genControls(camera: THREE.Camera, canvas: HTMLElement | undefined) {
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.2;
  controls.maxDistance = 20;
  controls.minDistance = 4;
  controls.zoomSpeed = 0.3;
  controls.maxPolarAngle = 87 * (Math.PI / 180);
  return controls;
}

function genGhostSound() {
  const listener = new THREE.AudioListener();
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('./assets/sounds/creepy.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });
  const ghostSound = new THREE.PositionalAudio(listener);
  const ghostSoundLoader = new THREE.AudioLoader();
  ghostSoundLoader.load('./assets/sounds/horror-ghost-14.wav', (buffer) => {
    ghostSound.setBuffer(buffer);
    ghostSound.setRefDistance(20);
    ghostSound.setLoop(true);
    ghostSound.setVolume(0.6);
    ghostSound.play();
  });
  const guiObj = {
    soundOff() {
      sound.pause();
      // soundPositional.pause()
      ghostSound.pause();
    },
    soundOn() {
      sound.play();
      // soundPositional.play()
      ghostSound.play();
    },
  };
  gui.add(guiObj, 'soundOff');
  gui.add(guiObj, 'soundOn');
  return ghostSound;
}

function genRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  // 但我们可以看到坟墓和黑色背景之间有一条清晰的切口。
  // 要解决这个问题，我们必须更改 的清晰颜色renderer并使用与雾相同的颜色。在实例化之后执行此操作renderer：
  renderer.setClearColor('#262837');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}

function Index() {
  // 创建坐标轴
  const axes = new THREE.AxesHelper(6);
  // 将坐标轴添加到场景中
  // Scene
  const scene = new THREE.Scene();
  scene.add(axes);
  // ground plane, house基础布局
  const floor = genFloor();
  const house = genHouse();
  scene.add(house, floor);

  // base 基础
  const base = genBase();
  house.add(base);

  // Walls 墙壁
  const walls = genWall();

  // Roof 顶部
  const roof = genRoof();

  // Door 门
  const door = genDoor();

  // Bushes 灌木丛
  const bushes = genBushes();

  // Graves 墓碑
  const graves = genGraves();

  // DoorLight 门灯
  const doorLight = genDoorLight();

  house.add(walls, roof, door, ...bushes, graves);
  house.add(doorLight);

  // Ghosts 幽灵音效
  const ghostSound = genGhostSound();

  // Ghosts 幽灵
  const ghosts = genGhost();
  ghosts[0].add(ghostSound);
  house.add(...ghosts);

  // Lights
  const ambientLight = genAmbientLight();
  const directionalLight = genDirectionalLight();
  scene.add(ambientLight, directionalLight);

  // Fog 雾化效果
  // 第一个参数是color，第二个参数是near（雾开始离相机多远），第三个参数是far（雾从相机多远开始完全不透明）。
  const fog = new THREE.Fog('#262837', 1, 15);
  scene.fog = fog;

  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Camera
    const camera = genCamera();

    const controls = genControls(camera, canvas);

    const renderer = genRenderer(canvas);

    listenResize(sizes, camera, renderer);
    const clock = new THREE.Clock();

    const tick = () => {
      stats.begin();

      const elapsedTime = clock.getElapsedTime();
      moveGhosts(ghosts, elapsedTime);
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

    gui.add(controls, 'autoRotate');
    gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01);

    return () => {
      window.removeEventListener('resize', () => {});
      // 卸载renderer
      renderer.dispose();
      gui.destroy();
    };
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
