import * as THREE from 'three';
import Playground from '../Playground';

export default class Fox {
  playground: Playground;

  scene: THREE.Scene;

  resource: any;

  model: any;

  animation: {
    play: (name: any) => void;
    actions: Record<string, THREE.AnimationAction>;
    mixer: THREE.AnimationMixer | null;
    action: THREE.AnimationAction | null;
  } = {
    mixer: null,
    action: null,
    actions: {},
    play: (name: any) => {},
  };

  constructor() {
    this.playground = new Playground();
    this.scene = this.playground.scene;
    this.resource = this.playground.resources.items.foxModel;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    this.model.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        // eslint-disable-next-line no-param-reassign
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    console.log(this.resource);

    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.actions = {};

    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0],
    );
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1],
    );
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2],
    );
    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;
    };
  }

  update() {
    if (this.animation.mixer) {
      this.animation.mixer.update(this.playground.time.delta * 0.001);
    }
  }
}
