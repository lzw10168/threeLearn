import { useEffect } from 'react';
/* eslint-disable no-param-reassign */
import * as THREE from 'three';

import * as dat from 'lil-gui';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import stats from '../../utils/stats';
import { listenResize, sizes } from '../../utils/utils';
import getMinifyPicColor from './picCanvas';
import setup from './setup';

/**
 * cannon-es 的初步使用, 认识 cannon-es 的基本概念
 *
 */

// Canvas

function Index() {
  useEffect(() => {
    const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

    // Scene
    const { scene, camera, controls, renderer } = setup(canvas);

    // Gui
    const gui = new dat.GUI();

    // material
    const material = new THREE.MeshStandardMaterial({
      metalness: 0.4,
      roughness: 0.5,
      color: '#E8F5E9',
    });

    // plane
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), material);
    plane.rotateX(-Math.PI / 2);
    plane.receiveShadow = true;
    scene.add(plane);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 16),
      material,
    );
    sphere.position.setY(15);
    sphere.castShadow = true;
    // change the sphere's color
    sphere.material.color.set(0xa7a49d);
    scene.add(sphere);

    // Cannon world
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    //Create a sphere for the cannon
    const sphereShape = new CANNON.Sphere(1);
    // 创建一个身体, 并指定质量和位置
    const sphereBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 15, 0),
      shape: sphereShape,
    });
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    // To make a Body static, set its mass to 0:
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    world.addBody(sphereBody);
    world.addBody(floorBody);
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5,
    );
    const clock = new THREE.Clock();
    let oldElapsedTime = 0;
    // Animations
    const tick = () => {
      stats.begin();
      controls.update();
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElapsedTime;
      oldElapsedTime = elapsedTime;
      world.step(1 / 60, deltaTime, 3);
      sphere.position.copy(sphereBody.position);

      // world.fixedStep();
      // cannonDebugger.update(); // Update the CannonDebugger meshes

      // objectsToUpdate.forEach((object) => {
      //   // @ts-ignore
      //   object.mesh.position.copy(object.body.position);
      //   // @ts-ignore
      //   object.mesh.quaternion.copy(object.body.quaternion);
      // });

      // Render
      renderer.render(scene, camera);
      stats.end();
      requestAnimationFrame(tick);
    };

    tick();

    listenResize(sizes, camera, renderer);

    /**
     * Debug
     */
    // gui.add(directionLightHelper, 'visible').name('directionLightHelper visible')
    // gui.add(directionalLightCameraHelper, 'visible').name('directionalLightCameraHelper visible')

    // gui.add(guiObj, 'start');
  }, []);

  return <canvas id="mainCanvas" className="webgl"></canvas>;
}
export default Index;
