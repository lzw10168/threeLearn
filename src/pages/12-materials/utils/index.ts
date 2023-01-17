import * as THREE from 'three';
export const textureLoader = new THREE.TextureLoader();
export const doorColorTexture = textureLoader.load(
  '../assets/textures/door/color.jpg',
);
export const doorAlphaTexture = textureLoader.load(
  '../assets/textures/door/alpha.jpg',
);
export const doorAmbientOcclusionTexture = textureLoader.load(
  '../assets/textures/door/ambientOcclusion.jpg',
);
export const doorHeightTexture = textureLoader.load(
  '../assets/textures/door/height.jpg',
);
export const doorNormalTexture = textureLoader.load(
  '../assets/textures/door/normal.jpg',
);
export const doorMetalnessTexture = textureLoader.load(
  '../assets/textures/door/metalness.jpg',
);
export const doorRoughnessTexture = textureLoader.load(
  '../assets/textures/door/roughness.jpg',
);
export const matcapTexture1 = textureLoader.load(
  '../assets/textures/matcaps/1.png',
);
export const matcapTexture2 = textureLoader.load(
  '../assets/textures/matcaps/2.png',
);
export const matcapTexture3 = textureLoader.load(
  '../assets/textures/matcaps/3.png',
);
export const matcapTexture4 = textureLoader.load(
  '../assets/textures/matcaps/4.png',
);
export const gradientTexture = textureLoader.load(
  '../assets/textures/gradients/3.jpg',
);

export const envMapTexture = new THREE.CubeTextureLoader()
  .setPath('../assets/textures/environmentMaps/2/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

export const getRandomEnvMap = () => {
  // 0-4
  const number = Math.floor(Math.random() * 5);
  const envMap = new THREE.CubeTextureLoader()
    .setPath(`../assets/textures/environmentMaps/${number}/`)
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
  return envMap;
};
// radius	否	该属性定义球体的半径，默认值是50
// widthSegments	否	该属性指定竖直方向上的分段数，段数越多，球体的表面越光滑，默认值是8，最小值是3
// heightSegments	否	该属性指定水平方向上的分段数，段数越多，球体的表面越光滑，默认值是6，最小值是2
// phiStart	否	该属性用来指定从x轴的什么位置开始绘制，取值范围是0到2*π，默认值0
// phiLength	否	该属性用来指定从phiStart开始画多少，默认2*π（画整球）
// thetaStart	否	该属性用来指定从y轴的什么位置开始绘制，取值范围是0到2*π，默认值0
// thetaLength	否	该属性用来指定从thetaStart开始画多少，默认2*π（画整球）
export const genuGeometry = (material: any) => {
  // 球
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material,
  );
  sphere.position.x = -1.5;

  // 平面
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material,
  );

  // 圆环
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material,
  );
  torus.position.x = 1.5;

  return { sphere, plane, torus };
};

export const tick = ({
  sphere,
  plane,
  torus,
  clock,
  stats,
  renderer,
  scene,
  camera,
  controls,
}: {
  sphere: any;
  plane: any;
  torus: any;
  clock: any;
  stats: any;
  renderer: any;
  scene: any;
  camera: any;
  controls: any;
}) => {
  const tick = () => {
    stats?.begin();

    const elapsedTime = clock.getElapsedTime();

    // Update Objects
    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    controls?.update();
    // Render
    renderer.render(scene, camera);
    stats?.end();
    requestAnimationFrame(tick);
  };

  tick();
};
