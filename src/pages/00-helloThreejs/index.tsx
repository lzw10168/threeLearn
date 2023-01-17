import { useEffect } from 'react';
import * as THREE from 'three';

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;
    const scene = new THREE.Scene(); // 创建场景

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
      }),
    );
    scene.add(cube);

    const camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000);
    camera.position.set(1, 1, 5);
    scene.add(camera); // 相机加入场景
    camera.lookAt(cube.position); // 相机视点设置为cube

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    renderer.render(scene, camera); // 使用渲染器渲染这个场景
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
