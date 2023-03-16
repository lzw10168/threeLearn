import { useEffect } from 'react';
/* eslint-disable no-param-reassign */
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import stats from '../../utils/stats';
import { listenResize, dbClkfullScreen } from '../../utils/utils';

// Canvas

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    // Gui
    const gui = new dat.GUI();

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
    camera.position.set(4, 4, 15);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.zoomSpeed = 0.3;

    /**
     * Objects
     */
    // material
    const material = new THREE.MeshStandardMaterial();

    // sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 16),
      material,
    );
    sphere.position.setY(1);
    sphere.castShadow = true;
    scene.add(sphere);

    // plane
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material);
    plane.rotateX(-Math.PI / 2);
    plane.receiveShadow = true;
    scene.add(plane);

    /**
     * Light
     */
    const directionLight = new THREE.DirectionalLight();
    directionLight.castShadow = true;
    directionLight.position.set(5, 5, 6);
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color('#ffffff'),
      0.3,
    );
    scene.add(ambientLight, directionLight);

    const directionLightHelper = new THREE.DirectionalLightHelper(
      directionLight,
      2,
    );
    directionLightHelper.visible = false;
    scene.add(directionLightHelper);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      // antialias: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // applyForce从空间中的指定点（不一定在Body的表面）向Body施加一个力，就像风一直将所有东西推一点点，对多米诺骨牌的小而突然的推力或更大的突然力到让愤怒的小鸟跳向敌人的城堡。
    // applyImpulse与applyForce类似，但它不是增加会导致速度变化的力，而是直接应用于速度。
    // applyLocalForce与applyForce相同，但坐标是Body的局部坐标（意味着它将是Body0, 0, 0的中心）。
    // applyLocalImpulse与applyImpulse相同，但坐标是Body的局部坐标。
    // Because using "force" methods will result in velocity changes, let's not use "impulse" methods
    /**
     * Physics
     */
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.8,
        restitution: 0.7,
      },
    );
    world.addContactMaterial(defaultContactMaterial);

    const sphereShape = new CANNON.Sphere(1);
    const sphereBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 4, 0),
      shape: sphereShape,
      material: defaultMaterial,
    });
    world.addBody(sphereBody);
    // 施加外力
    // sphereBody.applyForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0, 0, 0));

    const guiObj = {
      drop() {
        sphereBody.position = new CANNON.Vec3(0, 4, 0);
      },
      CannonDebugger: false,
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
    const cannonMeshes: THREE.Mesh[] = [];
    const cannonDebugger = CannonDebugger(scene, world, {
      onInit(body, mesh) {
        mesh.visible = false;
        cannonMeshes.push(mesh);
      },
    });
    gui
      .add(guiObj, 'CannonDebugger')
      .name('CannonDebugger mesh visible')
      .onChange((value: boolean) => {
        if (value) {
          cannonMeshes.forEach((item) => {
            item.visible = true;
          });
        } else {
          cannonMeshes.forEach((item) => {
            item.visible = false;
          });
        }
      });

    // Animations
    let oldElapsedTime = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      stats.begin();
      controls.update();
      world.fixedStep();
      cannonDebugger.update(); // Update the CannonDebugger meshes

      // Now let's use the applyForce(...) to apply some wind. Because the wind is permanent, we should apply this force to each frame before updating the World. To correctly apply this force, the point should be the sphereBody.position:

      sphereBody.applyForce(new CANNON.Vec3(0.5, 0, 0), sphereBody.position);

      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElapsedTime;
      oldElapsedTime = elapsedTime;

      world.step(1 / 60, deltaTime, 3);
      // @ts-ignore
      sphere.position.copy(sphereBody.position);
      // @ts-ignore
      sphere.quaternion.copy(sphereBody.quaternion);

      // Render
      renderer.render(scene, camera);
      stats.end();
      requestAnimationFrame(tick);
    };

    tick();

    listenResize(sizes, camera, renderer);
    dbClkfullScreen(document.documentElement);

    /**
     * Debug
     */

    gui.add(controls, 'autoRotate');
    gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01);
    gui.add(material, 'wireframe');
    gui
      .add(directionLightHelper, 'visible')
      .name('directionLightHelper visible');

    gui.add(guiObj, 'drop');
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
