import { useEffect } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import stats from '../../utils/stats';
import { listenResize, sizes } from '../../utils/utils';
import { genuGeometry, gradientTexture, tick } from './utils';

// MeshToonMaterial在属性方面类似于MeshLambertMaterial，但具有卡通风格：

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const scene = new THREE.Scene();

    /**
     * 如果您对此进行测试，您会发现卡通效果不再起作用。那是因为我们使用的渐变纹理很小，并且该纹理的像素是混合的。是的，就像我们在纹理课程中看到的那样，这是minFilter,magFilter和的问题。mipmapping
      要解决这个问题，我们可以简单地将minFilterand更改magFilter为THREE.NearestFilter.
      使用THREE.NearestFilter意味着我们没有使用 mip 映射，我们可以通过以下方式停用它gradientTexture.generateMipmaps = false：
     */
    gradientTexture.minFilter = THREE.NearestFilter;
    gradientTexture.magFilter = THREE.NearestFilter;
    gradientTexture.generateMipmaps = false;
    const material = new THREE.MeshToonMaterial({
      gradientMap: gradientTexture,
    });

    const { sphere, plane, torus } = genuGeometry(material);

    scene.add(sphere, plane, torus);

    // Size

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100,
    );
    camera.position.set(0, 0, 2);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    listenResize(sizes, camera, renderer);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(pointLight);

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
