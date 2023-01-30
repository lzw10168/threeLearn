import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize } from '../../utils/utils';

/** 性能排行
最低成本：
  环境光
  半球光
中等成本：
  定向光
  点光源
高成本：
  聚光灯
  矩形区域光
*/

// Canvas
function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;
    const gui = new dat.GUI();

    // Scene
    const scene = new THREE.Scene();

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial();
    material.metalness = 0;
    material.roughness = 0.4;

    // gui
    const meshFolder = gui.addFolder('Mesh');
    meshFolder.add(material, 'metalness', 0, 1, 0.0001);
    meshFolder.add(material, 'roughness', 0, 1, 0.0001);
    meshFolder.add(material, 'wireframe');
    // Objects
    // 球
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      material,
    );
    sphere.position.set(-1.5, 0, 0);

    // 立方体
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 0.75),
      material,
    );

    // 圆环
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 32, 64),
      material,
    );
    torus.position.set(1.5, 0, 0);

    // 平面
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    plane.rotation.set(-Math.PI / 2, 0, 0);
    plane.position.set(0, -0.65, 0);

    scene.add(sphere, cube, torus, plane);

    /**
     * Lights环境光
     */
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    scene.add(ambientLight);

    // gui
    const ambientLightFolder = gui.addFolder('AmbientLight-环境光');
    ambientLightFolder.add(ambientLight, 'visible').listen();
    ambientLightFolder.add(ambientLight, 'intensity', 0, 1, 0.001);

    // ----------------------------------------------
    /**
     * DirectionalLight将具有类似太阳的效果，就好像太阳光线平行传播一样。第一个参数是color，第二个参数是intensity：
     */
    const directionalLight = new THREE.DirectionalLight('#ffffaa', 0.5);
    // 默认情况光线来自上方。使用position要更改它，
    directionalLight.position.set(1, 0.25, 0);
    // directionalLight.visible = false;
    // 光的距离暂时无关紧要。光线来自无限空间，平行于无限对面传播。
    scene.add(directionalLight);

    // DirectionalLightHelper是一个辅助工具，它可以帮助我们查看方向光的方向和范围。它接受一个DirectionalLight作为参数：
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
    );
    directionalLightHelper.visible = false;
    scene.add(directionalLightHelper);
    // gui
    const directionalLightFolder = gui.addFolder(
      'DirectionalLight-平行光(太阳光)',
    );
    directionalLightFolder
      .add(directionalLight, 'visible')
      .onChange((visible: boolean) => {
        directionalLightHelper.visible = visible;
      })
      .listen();
    directionalLightFolder
      .add(directionalLightHelper, 'visible')
      .name('helper visible')
      .listen();
    directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.001);

    // ----------------------------------------------

    // ----------------------------------------------
    /**
     * HemisphereLight与AmbientLight相似，但天空的颜色与地面的颜色不同。面向天空的面将被一种颜色照亮，而另一种颜色将照亮面向地面的面。
     * 第一个参数是color对应天空的颜色，第二个参数是groundColor，第三个参数是intensity：
     */
    const hemisphereLight = new THREE.HemisphereLight(
      '#B71C1C',
      '#004D40',
      0.6,
    );
    hemisphereLight.visible = false;
    scene.add(hemisphereLight);

    // HemisphereLightHelper是一个辅助工具，它可以帮助我们查看半球光的方向和范围。它接受一个HemisphereLight作为参数：
    const hemisphereLightHelper = new THREE.HemisphereLightHelper(
      hemisphereLight,
      2,
    );
    hemisphereLightHelper.visible = false;
    scene.add(hemisphereLightHelper);

    // gui
    const hemisphereLightFolder = gui.addFolder('HemisphereLight-半球光');
    hemisphereLightFolder
      .add(hemisphereLight, 'visible')
      .onChange((visible: boolean) => {
        hemisphereLightHelper.visible = visible;
      })
      .listen();
    hemisphereLightFolder
      .add(hemisphereLightHelper, 'visible')
      .name('helper visible')
      .listen();
    hemisphereLightFolder.add(hemisphereLight, 'intensity', 0, 1, 0.001);
    // ----------------------------------------------

    // ----------------------------------------------
    /**
     * PointLight是一个点光源，它会向所有方向发射光线，直到它达到光线的最大距离。
     * 第一个参数是color，第二个参数是intensity，第三个参数是distance，第四个参数是decay：
     * 默认情况下，光强度不会衰减。distance但是您可以使用和decay属性控制淡入淡出的距离以及淡入淡出的速度
     */
    const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
    pointLight.position.set(1, 1, 1);
    pointLight.visible = false;

    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    pointLightHelper.visible = false;
    scene.add(pointLightHelper);

    // gui
    const pointLightFolder = gui.addFolder('PointLight-点光源');
    pointLightFolder
      .add(pointLight, 'visible')
      .onChange((visible: boolean) => {
        pointLightHelper.visible = visible;
      })
      .listen();
    pointLightFolder
      .add(pointLightHelper, 'visible')
      .name('helper visible')
      .listen();
    pointLightFolder.add(pointLight, 'distance', 0, 100, 0.00001);
    pointLightFolder.add(pointLight, 'decay', 0, 10, 0.00001);
    // ----------------------------------------------

    // ----------------------------------------------
    /**
     * RectAreaLight是一个矩形光源，它会向所有方向发射光线，直到它达到光线的最大距离。
     * RectAreaLight的工作方式类似于您在照片拍摄集中看到的大矩形灯。它是定向光和漫射光之间的混合。
     * 第一个参数是color，第二个参数是intensity，第三个参数是width矩形的，第四个参数是它的height：
     */
    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 10, 1, 1);
    rectAreaLight.position.set(-1.5, 0, 1.5);
    rectAreaLight.lookAt(new THREE.Vector3());
    rectAreaLight.visible = false;
    scene.add(rectAreaLight);

    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
    rectAreaLightHelper.visible = false;
    scene.add(rectAreaLightHelper);

    // gui
    const rectAreaLightFolder = gui.addFolder('RectAreaLight-矩形光源');
    rectAreaLightFolder
      .add(rectAreaLight, 'visible')
      .onChange((visible: boolean) => {
        rectAreaLightHelper.visible = visible;
      })
      .listen();
    rectAreaLightFolder
      .add(rectAreaLightHelper, 'visible')
      .name('helper visible')
      .listen();
    rectAreaLightFolder.add(rectAreaLight, 'intensity', 0, 80, 0.0001);
    rectAreaLightFolder.add(rectAreaLight, 'width', 0, 5, 0.0001);
    rectAreaLightFolder.add(rectAreaLight, 'height', 0, 5, 0.0001);

    // ----------------------------------------------
    /**
     * SpotLight是一个聚光灯，它会向所有方向发射光线，直到它达到光线的最大距离。
     * 就像手电筒一样工作。它是一个从一点开始并朝向一个方向的光锥。这里是它的参数列表：
     * color： 颜色
      intensity：强度
      distance：强度下降到的距离0
      angle: 光束有多大
      penumbra：光束轮廓的扩散程度
      decay：光线变暗的速度
     */
    const spotLight = new THREE.SpotLight(
      0x78ff00,
      0.5,
      10,
      Math.PI * 0.1,
      0.25,
      1,
    );
    spotLight.position.set(0, 2, 3);
    spotLight.visible = false;
    scene.add(spotLight);
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    spotLightHelper.visible = false;
    // SpotLight始终注视着那个对象target。
    scene.add(spotLight.target);
    scene.add(spotLightHelper);

    // gui
    const spotLightFolder = gui.addFolder('SpotLight-聚光灯');
    spotLightFolder
      .add(spotLight, 'visible')
      .onChange((visible: boolean) => {
        spotLightHelper.visible = visible;
      })
      .listen();
    spotLightFolder
      .add(spotLightHelper, 'visible')
      .name('helper visible')
      .listen();
    spotLightFolder.add(spotLight, 'intensity', 0, 5, 0.001);
    spotLightFolder.add(spotLight, 'distance', 0, 20, 0.001);
    spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.001);
    spotLightFolder.add(spotLight, 'penumbra', 0, 1, 0.001);
    spotLightFolder.add(spotLight, 'decay', 0, 10, 0.001);
    spotLightFolder
      .add(spotLight.target.position, 'x', -10, 10, 0.001)
      .name('target-x');

    // ----------------------------------------------
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
    // controls.autoRotate = true
    // controls.enabled = false

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
    const tick = () => {
      stats.begin();

      const elapsedTime = clock.getElapsedTime();

      // Update Objects
      sphere.rotation.y = 0.1 * elapsedTime;
      cube.rotation.y = 0.1 * elapsedTime;
      torus.rotation.y = 0.1 * elapsedTime;

      sphere.rotation.x = 0.15 * elapsedTime;
      cube.rotation.x = 0.15 * elapsedTime;
      torus.rotation.x = 0.15 * elapsedTime;

      controls.update();
      // spotLightHelper.update();

      // Render
      renderer.render(scene, camera);
      stats.end();
      requestAnimationFrame(tick);
    };

    tick();

    /**
     * Debug
     */

    const guiObj = {
      turnOffAllLights() {
        ambientLight.visible = false;
        directionalLight.visible = false;
        directionalLightHelper.visible = false;
        hemisphereLight.visible = false;
        hemisphereLightHelper.visible = false;
        pointLight.visible = false;
        pointLightHelper.visible = false;
        rectAreaLight.visible = false;
        rectAreaLightHelper.visible = false;
        spotLight.visible = false;
        spotLightHelper.visible = false;
      },
      turnOnAllLights() {
        ambientLight.visible = true;
        directionalLight.visible = true;
        directionalLightHelper.visible = true;
        hemisphereLight.visible = true;
        hemisphereLightHelper.visible = true;
        pointLight.visible = true;
        pointLightHelper.visible = true;
        rectAreaLight.visible = true;
        rectAreaLightHelper.visible = true;
        spotLight.visible = true;
        spotLightHelper.visible = true;
      },
    };

    gui.add(guiObj, 'turnOffAllLights');
    gui.add(guiObj, 'turnOnAllLights');
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
