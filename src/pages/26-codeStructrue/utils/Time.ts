import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
  start: number;

  current: number;

  elapsed: number;
  // 将包含自上一帧以来花费了多少时间。我们默认将其设置为 16，这接近于 60fps 下两帧之间的毫秒数。
  delta: number;

  constructor() {
    super();

    // Setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger('tick');

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
