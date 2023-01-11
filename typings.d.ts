import '@umijs/max/typings';
declare module '*.jpg'

// 属性“webkitExitFullscreen”在类型“Document”上不存在。你是否指的是“exitFullscreen”?ts(2551)
// 声明document.webkitExitFullscreen
declare interface Document {
  webkitExitFullscreen: any;
  webkitFullscreenElement: any;

}
declare interface HTMLCanvasElement {
  HTMLCanvasElement: HTMLCanvasElement;
  webkitRequestFullscreen: any;
}
