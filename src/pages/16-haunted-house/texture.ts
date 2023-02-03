import * as THREE from 'three';

// 门纹理
export const textureLoader = new THREE.TextureLoader();
export const doorAlphaTexture = textureLoader.load(
  './assets/textures/door/alpha.jpg',
);
export const doorColorTexture = textureLoader.load(
  './assets/textures/door/color.jpg',
);
export const doorAmbientOcclusionTexture = textureLoader.load(
  './assets/textures/door/ambientOcclusion.jpg',
);
export const doorHeightTexture = textureLoader.load(
  './assets/textures/door/height.png',
);
export const doorNormalTexture = textureLoader.load(
  './assets/textures/door/normal.jpg',
);
export const doorMetalnessTexture = textureLoader.load(
  './assets/textures/door/metalness.jpg',
);
export const doorRoughnessTexture = textureLoader.load(
  './assets/textures/door/roughness.jpg',
);

// 砖块纹理
export const brickColorTexture = textureLoader.load(
  './assets/textures/brick/baseColor.jpg',
);
export const brickAmbientOcclusionTexture = textureLoader.load(
  './assets/textures/brick/ambientOcclusion.jpg',
);
export const brickHeightTexture = textureLoader.load(
  './assets/textures/brick/height.png',
);
export const brickNormalTexture = textureLoader.load(
  './assets/textures/brick/normal.jpg',
);
export const brickRoughnessTexture = textureLoader.load(
  './assets/textures/door2/roughness.jpg',
);
// 地基
export const baseColorTexture = textureLoader.load(
  './assets/textures/stone/baseColor.jpg',
);
export const baseAmbientOcclusionTexture = textureLoader.load(
  './assets/textures/stone/ambientOcclusion.jpg',
);
export const baseHeightTexture = textureLoader.load(
  './assets/textures/stone/height.png',
);
export const baseNormalTexture = textureLoader.load(
  './assets/textures/stone/normal.jpg',
);
export const baseRoughnessTexture = textureLoader.load(
  './assets/textures/stone/roughness.jpg',
);
baseColorTexture.repeat.set(3, 0.5);
baseAmbientOcclusionTexture.repeat.set(3, 0.5);
baseHeightTexture.repeat.set(3, 0.5);
baseNormalTexture.repeat.set(3, 0.5);
baseRoughnessTexture.repeat.set(3, 0.5);

// 更改wrapS和wrapT属性以激活重复
baseColorTexture.wrapS = THREE.RepeatWrapping;
baseAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
baseHeightTexture.wrapS = THREE.RepeatWrapping;
baseNormalTexture.wrapS = THREE.RepeatWrapping;
baseRoughnessTexture.wrapS = THREE.RepeatWrapping;

baseColorTexture.wrapT = THREE.RepeatWrapping;
baseAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
baseHeightTexture.wrapT = THREE.RepeatWrapping;
baseNormalTexture.wrapT = THREE.RepeatWrapping;
baseRoughnessTexture.wrapT = THREE.RepeatWrapping;
// 纹理太大了，重复一下
brickColorTexture.repeat.set(3, 3);
brickAmbientOcclusionTexture.repeat.set(3, 3);
brickHeightTexture.repeat.set(3, 3);
brickNormalTexture.repeat.set(3, 3);
brickRoughnessTexture.repeat.set(3, 3);

// 更改wrapS和wrapT属性以激活重复
brickColorTexture.wrapS = THREE.RepeatWrapping;
brickAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
brickHeightTexture.wrapS = THREE.RepeatWrapping;
brickNormalTexture.wrapS = THREE.RepeatWrapping;
brickRoughnessTexture.wrapS = THREE.RepeatWrapping;

brickColorTexture.wrapT = THREE.RepeatWrapping;
brickAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
brickHeightTexture.wrapT = THREE.RepeatWrapping;
brickNormalTexture.wrapT = THREE.RepeatWrapping;
brickRoughnessTexture.wrapT = THREE.RepeatWrapping;

export const floorColorTexture = textureLoader.load(
  './assets/textures/floor/baseColor.jpg',
);
export const floorAmbientOcclusionTexture = textureLoader.load(
  './assets/textures/floor/ambientOcclusion.jpg',
);
export const floorHeightTexture = textureLoader.load(
  './assets/textures/floor/height.png',
);
export const floorNormalTexture = textureLoader.load(
  './assets/textures/floor/normal.jpg',
);
export const floorRoughnessTexture = textureLoader.load(
  './assets/textures/door2/roughness.jpg',
);
floorColorTexture.repeat.set(10, 10);
floorAmbientOcclusionTexture.repeat.set(10, 10);
floorHeightTexture.repeat.set(10, 10);
floorNormalTexture.repeat.set(10, 10);
floorRoughnessTexture.repeat.set(10, 10);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
floorHeightTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorRoughnessTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
floorHeightTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorRoughnessTexture.wrapT = THREE.RepeatWrapping;

// 墓碑纹理

export const graveColorTexture = textureLoader.load(
  './assets/textures/Stone_Floor_004/color.png',
);
export const graveAmbientOcclusionTexture = textureLoader.load(
  './assets/textures/Stone_Floor_004/ambientOcclusion.png',
);
export const graveHeightTexture = textureLoader.load(
  './assets/textures/Stone_Floor_004/height.png',
);
export const graveNormalTexture = textureLoader.load(
  './assets/textures/Stone_Floor_004/normal.png',
);
export const graveRoughnessTexture = textureLoader.load(
  './assets/textures/Stone_Floor_004/roughness.png',
);
graveColorTexture.repeat.set(3, 3);
graveAmbientOcclusionTexture.repeat.set(3, 3);
graveHeightTexture.repeat.set(3, 3);
graveNormalTexture.repeat.set(3, 3);
graveRoughnessTexture.repeat.set(3, 3);

graveColorTexture.wrapS = THREE.RepeatWrapping;
graveAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
graveHeightTexture.wrapS = THREE.RepeatWrapping;
graveNormalTexture.wrapS = THREE.RepeatWrapping;
graveRoughnessTexture.wrapS = THREE.RepeatWrapping;

graveColorTexture.wrapT = THREE.RepeatWrapping;
graveAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
graveHeightTexture.wrapT = THREE.RepeatWrapping;
graveNormalTexture.wrapT = THREE.RepeatWrapping;
graveRoughnessTexture.wrapT = THREE.RepeatWrapping;
