import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter {
  width: number

  height: number

  pixelRatio: number

  constructor() {
    super()

    // Setup
    this.width = window.innerWidth - 340
    this.height = window.innerHeight - 100
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Resize event
    window.addEventListener('resize', () => {
      this.width = window.innerWidth - 340
      this.height = window.innerHeight - 100
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)
      this.trigger('resize')
    })
  }
}
