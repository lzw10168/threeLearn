import * as dat from 'dat.gui';
import Playground from './Playground';

export default class Debug {
  gui: dat.GUI;
  active: boolean;
  playground: Playground;
  debugActionFloder: dat.GUI;
  debugEnvFloder: dat.GUI;

  constructor() {
    this.playground = new Playground();
    this.active = window.location.hash === '#debug';
    if (!this.active) {
      return;
    }

    this.gui = new dat.GUI();
    this.debugActionFloder = this.gui.addFolder('Fox');
    this.debugEnvFloder = this.gui.addFolder('Environment');
    this.playground.resources.on('ready', () => {
      this.initAction();
      this.initEnv();
    });
  }

  initAction() {
    const debugObject = {
      playIdle: () => {
        this.playground.world.fox.animation.play('idle');
      },
      playWalking: () => {
        this.playground.world.fox.animation.play('walking');
      },
      playRunning: () => {
        this.playground.world.fox.animation.play('running');
      },
    };
    this.debugActionFloder.add(debugObject, 'playIdle');
    this.debugActionFloder.add(debugObject, 'playWalking');
    this.debugActionFloder.add(debugObject, 'playRunning');
  }

  initEnv() {
    const env = this.playground.world.environment;
    this.debugEnvFloder
      .add(env.environmentMap, 'intensity')
      .name('envMapIntensity')
      .min(0)
      .max(4)
      .step(0.001)
      .onChange(
        this.playground.world.environment.environmentMap.updateMaterials,
      );
    this.debugEnvFloder
      .add(env.sunLight, 'intensity')
      .name('sunLightIntensity')
      .min(0)
      .max(10)
      .step(0.001);

    this.debugEnvFloder
      .add(env.sunLight.position, 'x')
      .name('sunLightX')
      .min(-5)
      .max(5)
      .step(0.001);

    this.debugEnvFloder
      .add(env.sunLight.position, 'y')
      .name('sunLightY')
      .min(-5)
      .max(5)
      .step(0.001);

    this.debugEnvFloder
      .add(env.sunLight.position, 'z')
      .name('sunLightZ')
      .min(-5)
      .max(5)
      .step(0.001);
  }
}
