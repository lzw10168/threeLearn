import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, dbClkfullScreen, sizes } from '../../utils/utils';
import setup from './setup';

// Canvas

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;
    // 获取canvas到屏幕左边的宽度
    const canvasLeft = canvas.getBoundingClientRect().left;
    const canvasTop = canvas.getBoundingClientRect().top;
    const { camera, scene, controls, renderer } = setup(canvas);

    const ballNumInRow = 5;

    const cubeGroup = new THREE.Group();
    for (let k = 0; k < ballNumInRow; k += 1) {
      const planeGroup = new THREE.Group();
      for (let j = 0; j < ballNumInRow; j += 1) {
        const rowGroup = new THREE.Group();
        for (let i = 0; i < ballNumInRow; i += 1) {
          const object = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshStandardMaterial({ color: '#fff' }),
          );
          object.position.setX(i * 2);
          object.name = 'ball';
          rowGroup.add(object);
        }
        rowGroup.position.setZ(j * 2);
        planeGroup.add(rowGroup);
      }
      planeGroup.position.setY(k * 2);
      cubeGroup.add(planeGroup);
    }

    cubeGroup.position.set(
      -ballNumInRow / 2 - 1.5,
      -ballNumInRow / 2 - 1.5,
      -ballNumInRow / 2 - 1.5,
    );

    scene.add(cubeGroup);

    const objectsToTest: THREE.Mesh[] = [];
    // 遍历所有的球体
    cubeGroup.traverse((obj: THREE.Mesh) => {
      if (obj.type === 'Mesh') {
        objectsToTest.push(obj);
      }
    });

    // 正方体
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial(),
    );
    cube.position.setY(-13);
    scene.add(cube);

    const directionLight = new THREE.DirectionalLight(
      new THREE.Color('#ffffff'),
      0.6,
    );
    directionLight.position.set(6, 6, 6);
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color('#ffffff'),
      0.4,
    );
    scene.add(ambientLight, directionLight);

    const directionLightHelper = new THREE.DirectionalLightHelper(
      directionLight,
      2,
    );
    scene.add(directionLightHelper);

    /**
     * Raycaster
     */
    const raycaster = new THREE.Raycaster();
    let arrowHelper: THREE.Object3D<THREE.Event> | THREE.ArrowHelper | null =
      null;
    /**
     * Mouse
     */
    const mouse: {
      x: number | null;
      y: number | null;
    } = { x: null, y: null };
    // 不能使用以像素为单位的基本原生 JavaScript 坐标。需要一个在水平轴和垂直轴上都从-1到的值，+1当鼠标向上移动时，垂直坐标为正。

    // 这就是 WebGL 的工作原理，它与裁剪空间之类的东西有关，但我们不需要理解那些复杂的概念。
    // 鼠标在页面左上角：-1 / 1
    // 鼠标在页面左下方：-1 / - 1
    // 鼠标垂直居中，水平居右：1 / 0
    // 鼠标在页面中央：0 / 0
    window.addEventListener('mousemove', (event) => {
      mouse.x = ((event.clientX - canvasLeft) / sizes.width) * 2 - 1;
      mouse.y = -((event.clientY - canvasTop) / sizes.height) * 2 + 1;
    });

    window.addEventListener('touchmove', (event) => {
      const { clientX, clientY } = event.touches[0];
      mouse.x = ((clientX - canvasLeft) / sizes.width) * 2 - 1;
      mouse.y = -((clientY - canvasTop) / sizes.height) * 2 + 1;
    });

    // Animations
    const tick = () => {
      // console.log(mouse);

      stats.begin();

      if (mouse.x && mouse.y) {
        raycaster.setFromCamera({ x: mouse.x, y: mouse.y }, camera);
      }

      const intersects: THREE.Intersection<
        THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
      >[] = raycaster.intersectObjects(objectsToTest);

      if (
        JSON.stringify(intersects[0]?.object.material.color) ===
        JSON.stringify(new THREE.Color(0xffffff))
      ) {
        // 如果你想测试玩家前面是否有墙，你可以测试distance. 如果要更改对象的颜色可以更新object的材质。如果你想在冲击点上显示爆炸，你可以在该point位置创建这个爆炸。
        // console.log(intersects[0]);
        // distance：射线原点和碰撞点之间的距离。
        // face：几何体的哪个面被光线击中。
        // faceIndex: 那个面的索引。
        // object: 碰撞涉及什么对象。
        // point：碰撞在 3D 空间中的确切位置的Vector3。
        // uv：该几何体中的 UV 坐标。
        console.log(mouse);

        intersects[0]?.object.material.color.set(
          new THREE.Color(Math.random(), Math.random(), Math.random()),
        );
        // 移除
        intersects[0]?.object.parent?.remove(intersects[0]?.object);
        // 制作爆炸
      }

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

    gui.add(controls, 'enableRotate');
    gui.add(controls, 'autoRotate');
    gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01);
    gui
      .add(directionLightHelper, 'visible')
      .name('directionLightHelper visible');
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
