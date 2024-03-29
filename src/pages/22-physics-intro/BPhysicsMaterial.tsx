import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import CANNON from 'cannon';
import stats from '../../utils/stats';
import { listenResize, dbClkfullScreen } from '../../utils/utils';

/**
 * Contact material 关于材料的学习
 *
 */
// Canvas

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

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

    /**
     * Physics
     */
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    const concreteMaterial = new CANNON.Material('concrete'); // 混凝土
    const plasticMaterial = new CANNON.Material('plastic'); // 塑料
    const concretePlasticContactMaterial = new CANNON.ContactMaterial(
      concreteMaterial,
      plasticMaterial,
      {
        friction: 0.1,
        restitution: 1,
      },
    );
    const defaultMaterial = new CANNON.Material('default');
    // 创建一个ContactMaterial。它是两种材质的组合，包含对象发生碰撞时的属性。
    // friction系数（摩擦多少）和restitution系数（弹跳多少）——两者的默认值为0.3.
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      },
    );
    world.addContactMaterial(defaultContactMaterial);
    world.addContactMaterial(concretePlasticContactMaterial);
    // 可以通过world.defaultContactMaterial来设置默认的ContactMaterial。 这样，如果你没有为两个材质指定ContactMaterial，它们就会使用默认的ContactMaterial。
    world.defaultContactMaterial = defaultContactMaterial;
    const sphereShape = new CANNON.Sphere(1);
    const sphereBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 4, 0),
      shape: sphereShape,
      material: defaultMaterial,
    });
    world.addBody(sphereBody);

    // floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.material = defaultMaterial;
    floorBody.addShape(floorShape);
    world.addBody(floorBody);
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2,
    );

    // Animations
    const clock = new THREE.Clock();
    let oldElapsedTime = 0;
    const tick = () => {
      stats.begin();
      controls.update();

      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElapsedTime;
      oldElapsedTime = elapsedTime;

      world.step(1 / 60, deltaTime, 3);

      // @ts-ignore
      sphere.position.copy(sphereBody.position);

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
    const gui = new dat.GUI();
    gui.add(controls, 'autoRotate');
    gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01);
    gui.add(material, 'wireframe');
    gui
      .add(directionLightHelper, 'visible')
      .name('directionLightHelper visible');
    const guiObj = {
      drop() {
        sphereBody.position = new CANNON.Vec3(0, 4, 0);
      },
    };
    gui.add(guiObj, 'drop');
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
