import { useEffect } from 'react';
/* eslint-disable no-param-reassign */
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import stats from '../../utils/stats';
import { listenResize } from '../../utils/utils';
import { matcapTexture4 } from '../12-materials/utils';

// Canvas

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    // Gui
    const gui = new dat.GUI();
    const guiObj = {
      CannonDebugger: false,
      createSphere() {},
      createBox() {},
      reset() {},
    };
    let cannonDebuggerVisible = false;

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
    camera.position.set(4, 4, 12);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.zoomSpeed = 0.3;
    controls.autoRotate = true;
    controls.target = new THREE.Vector3(0, 3, 0);

    /**
     * Objects
     */
    // material
    const material = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: matcapTexture4,
      envMapIntensity: 0.5,
    });

    // plane
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      new THREE.MeshStandardMaterial({
        color: '#607D8B',
      }),
    );
    plane.rotateX(-Math.PI / 2);
    plane.receiveShadow = true;
    scene.add(plane);

    /**
     * Light
     */
    const directionLight = new THREE.DirectionalLight();
    directionLight.castShadow = true;
    directionLight.position.set(5, 5, 6);
    directionLight.shadow.camera.near = 1;
    directionLight.shadow.camera.far = 20;
    directionLight.shadow.camera.top = 10;
    directionLight.shadow.camera.right = 10;
    directionLight.shadow.camera.bottom = -10;
    directionLight.shadow.camera.left = -10;

    const directionLightHelper = new THREE.DirectionalLightHelper(
      directionLight,
      2,
    );
    directionLightHelper.visible = false;
    scene.add(directionLightHelper);

    const directionalLightCameraHelper = new THREE.CameraHelper(
      directionLight.shadow.camera,
    );
    directionalLightCameraHelper.visible = false;
    scene.add(directionalLightCameraHelper);

    const ambientLight = new THREE.AmbientLight(
      new THREE.Color('#ffffff'),
      0.3,
    );
    scene.add(ambientLight, directionLight);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    /**
     * Sounds
     */
    const hitSound = new Audio('../assets/sounds/hit.mp3');
    const playHitSound = (collision: { contact: CANNON.ContactEquation }) => {
      // 冲击力度
      const impactStrength = collision.contact.getImpactVelocityAlongNormal();
      console.log('impactStrength: ', impactStrength);
      if (impactStrength > 1.5) {
        // For even more realism, we can add some randomness to the sound volume:
        hitSound.volume = Math.random();
        // 声音重置
        hitSound.currentTime = 0;
        hitSound.play();
      }
    };

    /**
     * Physics
     */
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    // 默认的 broadphase 是NaiveBroadphase，我建议你切换到SAPBroadphase。使用这个 broadphase 最终会产生不会发生碰撞的错误，但这种情况很少见，并且它涉及到做一些事情，比如非常快速地移动物体。
    world.broadphase = new CANNON.SAPBroadphase(world);
    // 当Body速度变得非常慢时（在您看不到它移动的点），Body可能会睡着并且不会被测试，除非通过代码对其施加足够的力或者如果另一个Body击中它。要激活此功能，只需将allowSleep属性设置为trueon the World：
    world.allowSleep = true;

    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.3,
        restitution: 0.6,
      },
    );
    world.addContactMaterial(defaultContactMaterial);

    /**
     * Utils
     */
    const objectsToUpdate: Array<{
      mesh: THREE.Mesh;
      body: CANNON.Body;
    }> = [];
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const createSphere = (radius: number, position: THREE.Vector3) => {
      // Three.js mesh
      const mesh = new THREE.Mesh(sphereGeometry, material);
      mesh.castShadow = true;
      mesh.scale.set(radius, radius, radius);
      mesh.position.copy(position);
      scene.add(mesh);

      // Cannon body
      const shape = new CANNON.Sphere(radius);
      const body = new CANNON.Body({
        mass: 1,
        shape,
        material: defaultMaterial,
      });
      // @ts-ignore
      body.position.copy(position);
      world.addBody(body);
      objectsToUpdate.push({
        mesh,
        body,
      });
      body.addEventListener('collide', playHitSound);
    };
    guiObj.createSphere = () => {
      createSphere(
        Math.random(),
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          5,
          (Math.random() - 0.5) * 8,
        ),
      );
    };

    // Boxes
    const boxGeometry = new THREE.BoxGeometry();
    const createBoxes = (
      width: number,
      height: number,
      depth: number,
      position: THREE.Vector3,
    ) => {
      // Three.js mesh
      const mesh = new THREE.Mesh(boxGeometry, material);
      mesh.castShadow = true;
      mesh.scale.set(width, height, depth);
      mesh.position.copy(position);
      scene.add(mesh);

      // Cannon body
      const shape = new CANNON.Box(
        new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5),
      );
      const body = new CANNON.Body({
        mass: 1,
        shape,
        material: defaultMaterial,
      });
      // @ts-ignore
      body.position.copy(position);
      world.addBody(body);
      objectsToUpdate.push({
        mesh,
        body,
      });
      body.addEventListener('collide', playHitSound);
    };
    guiObj.createBox = () => {
      createBoxes(
        Math.random(),
        Math.random(),
        Math.random(),
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          5,
          (Math.random() - 0.5) * 8,
        ),
      );
    };

    guiObj.reset = () => {
      objectsToUpdate.forEach((object) => {
        // Remove body
        object.body.removeEventListener('collide', playHitSound);
        world.removeBody(object.body);
        // Remove mesh
        scene.remove(object.mesh);
      });
      objectsToUpdate.splice(0, objectsToUpdate.length);
    };

    // floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: floorShape,
      material: defaultMaterial,
    });
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2,
    );
    world.addBody(floorBody);

    // cannonDebugger
    const cannonDebugger = CannonDebugger(scene, world, {
      onInit(body, mesh) {
        mesh.visible = cannonDebuggerVisible;
      },
    });

    // Animations
    const tick = () => {
      stats.begin();
      controls.update();
      world.fixedStep();
      cannonDebugger.update(); // Update the CannonDebugger meshes

      objectsToUpdate.forEach((object) => {
        // @ts-ignore
        object.mesh.position.copy(object.body.position);
        // @ts-ignore
        object.mesh.quaternion.copy(object.body.quaternion);
      });

      // Render
      renderer.render(scene, camera);
      stats.end();
      requestAnimationFrame(tick);
    };

    tick();

    listenResize(sizes, camera, renderer);
    // dbClkfullScreen(document.documentElement)

    /**
     * Debug
     */
    gui.add(guiObj, 'reset');
    gui.add(controls, 'autoRotate');
    // gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)
    gui.add(material, 'wireframe');
    gui
      .add(directionLightHelper, 'visible')
      .name('directionLightHelper visible')
      .onChange((v: boolean) => {
        directionalLightCameraHelper.visible = v;
      });
    gui
      .add(guiObj, 'CannonDebugger')
      .name('CannonDebugger mesh visible')
      .onChange((value: boolean) => {
        cannonDebuggerVisible = value;
      });
    gui.add(guiObj, 'createSphere');
    gui.add(guiObj, 'createBox');
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
