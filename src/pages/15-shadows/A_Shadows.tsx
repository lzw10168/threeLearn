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
    // Scene
    const scene = new THREE.Scene();

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial();
    // 金属度
    material.metalness = 0;
    // 粗糙度
    material.roughness = 0.4;

    // Objects
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      material,
    );
    // 投射阴影
    sphere.castShadow = true;

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    plane.rotation.set(-Math.PI / 2, 0, 0);
    plane.position.set(0, -0.65, 0);
    // 接收阴影
    plane.receiveShadow = true;

    scene.add(sphere, plane);

    /**
     * Lights
     * 只有以下类型的灯光支持阴影： 点光源, 聚光灯, 定向光
     */
    // 环境光
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.4);
    scene.add(ambientLight);

    // 平行光
    const directionalLight = new THREE.DirectionalLight('#ffffaa', 0.5);
    directionalLight.position.set(1, 0.75, 0);
    directionalLight.castShadow = true;
    // 至于我们的渲染，我们需要指定一个大小。默认情况下，由于性能问题，它是512x512。我们可以将它设置为1024x1024(必须是512的整数倍)，这样我们就可以看到更多的细节。
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    // 必须定义 anear和 a far。它不会真正提高阴影的质量，但它可能会修复您看不到阴影或阴影突然被裁剪的错误。
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 5;
    // 使用、right、bottom和left属性控制相机在每一侧可以看到的距离
    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.right = 2;
    directionalLight.shadow.camera.bottom = -2;
    directionalLight.shadow.camera.left = -2;
    // 为了使阴影更柔和，我们可以使用一个radius属性。这是一个值，它会在阴影边缘周围创建一个模糊区域。这个值越大，阴影就越柔和。
    directionalLight.shadow.radius = 10;
    scene.add(directionalLight);
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
    );
    scene.add(directionalLightHelper);

    const directionalLightCameraHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera,
    );
    scene.add(directionalLightCameraHelper);

    // 聚光灯-----------
    const spotLight = new THREE.SpotLight(
      0x78ff00,
      0.5,
      10,
      Math.PI * 0.1,
      0.25,
      1,
    );
    spotLight.distance = 6;
    spotLight.position.set(0, 2, 2);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    spotLight.shadow.camera.fov = 30;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 6;
    spotLight.shadow.radius = 10;
    scene.add(spotLight);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    const spotLightCameraHelper = new THREE.CameraHelper(
      spotLight.shadow.camera,
    );
    scene.add(spotLightCameraHelper);

    // 聚光灯end-----------

    // 点光源start--------------

    const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
    pointLight.position.set(-1, 1, 0);
    pointLight.castShadow = true;
    pointLight.shadow.radius = 10;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 4;
    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(pointLightHelper);

    const pointLightCameraHelper = new THREE.CameraHelper(
      pointLight.shadow.camera,
    );
    scene.add(pointLightCameraHelper);

    // 点光源end--------------
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
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

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

    /**
     * 可以将不同类型的算法应用于阴影贴图：
      THREE.BasicShadowMap 非常高效但质量很差
      THREE.PCFShadowMap 性能较差但边缘更平滑
      THREE.PCFSoftShadowMap 性能较差但边缘更柔和
      三.VSMShadowMap 性能较低，约束较多，可能会产生意想不到的结果
      要更改它，请更新renderer.shadowMap.type属性。默认是THREE.PCFShadowMap，但您可以使用THREE.PCFSoftShadowMap以获得更好的质量。

      与radius 二选一
     */
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;

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
        directionalLightCameraHelper.visible = visible;
      })
      .listen();
    directionalLightFolder
      .add(directionalLightHelper, 'visible')
      .name('helper visible')
      .listen();
    directionalLightFolder
      .add(directionalLightCameraHelper, 'visible')
      .name('camera helper visible')
      .listen();
    directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.001);

    const spotLightFolder = gui.addFolder('SpotLight');
    spotLightFolder
      .add(spotLight, 'visible')
      .onChange((visible: boolean) => {
        spotLightHelper.visible = visible;
        spotLightCameraHelper.visible = visible;
      })
      .listen();
    spotLightFolder
      .add(spotLightHelper, 'visible')
      .name('helper visible')
      .listen();
    spotLightFolder
      .add(spotLightCameraHelper, 'visible')
      .name('camera helper visible')
      .listen();
    spotLightFolder.add(spotLight, 'intensity', 0, 5, 0.001);
    spotLightFolder.add(spotLight, 'distance', 0, 20, 0.001);
    spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.001);
    spotLightFolder.add(spotLight, 'penumbra', 0, 1, 0.001);
    spotLightFolder.add(spotLight, 'decay', 0, 10, 0.001);

    const pointLightFolder = gui.addFolder('PointLight');
    pointLightFolder
      .add(pointLight, 'visible')
      .onChange((visible: boolean) => {
        pointLightHelper.visible = visible;
        pointLightCameraHelper.visible = visible;
      })
      .listen();
    pointLightFolder
      .add(pointLightHelper, 'visible')
      .name('helper visible')
      .listen();
    pointLightFolder
      .add(pointLightCameraHelper, 'visible')
      .name('camera helper visible')
      .listen();
    pointLightFolder.add(pointLight, 'distance', 0, 100, 0.00001);
    pointLightFolder.add(pointLight, 'decay', 0, 10, 0.00001);

    const guiObj = {
      turnOffAllLights() {
        ambientLight.visible = false;
        directionalLight.visible = false;
        directionalLightHelper.visible = false;
        directionalLightCameraHelper.visible = false;
        pointLight.visible = false;
        pointLightHelper.visible = false;
        pointLightCameraHelper.visible = false;
        spotLight.visible = false;
        spotLightHelper.visible = false;
        spotLightCameraHelper.visible = false;
      },
      turnOnAllLights() {
        ambientLight.visible = true;
        directionalLight.visible = true;
        directionalLightHelper.visible = true;
        directionalLightCameraHelper.visible = true;
        pointLight.visible = true;
        pointLightHelper.visible = true;
        pointLightCameraHelper.visible = true;
        spotLight.visible = true;
        spotLightHelper.visible = true;
        spotLightCameraHelper.visible = true;
      },
      hideAllHelpers() {
        directionalLightHelper.visible = false;
        directionalLightCameraHelper.visible = false;
        pointLightHelper.visible = false;
        pointLightCameraHelper.visible = false;
        spotLightHelper.visible = false;
        spotLightCameraHelper.visible = false;
      },
      showAllHelpers() {
        directionalLightHelper.visible = true;
        directionalLightCameraHelper.visible = true;
        pointLightHelper.visible = true;
        pointLightCameraHelper.visible = true;
        spotLightHelper.visible = true;
        spotLightCameraHelper.visible = true;
      },
    };

    guiObj.hideAllHelpers();

    gui.add(guiObj, 'turnOffAllLights');
    gui.add(guiObj, 'turnOnAllLights');
    gui.add(guiObj, 'hideAllHelpers');
    gui.add(guiObj, 'showAllHelpers');
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
