import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as dat from 'lil-gui';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
// import imagesLoaded from "https://cdn.skypack.dev/imagesloaded@4.1.4";
import { Maku, MakuGroup, Scroller, getScreenFov } from 'maku.js';

const imagesLoaded = new THREE.ImageLoader();
const calcAspect = (el: HTMLElement) => el.clientWidth / el.clientHeight;

const getNormalizedMousePos = (e: MouseEvent | Touch) => {
  return {
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: -(e.clientY / window.innerHeight) * 2 + 1,
  };
};

const preloadImages = (sel = 'img') => {
  return new Promise((resolve) => {
    imagesLoaded.load(sel, resolve);
  });
};

class MouseTracker {
  mousePos: THREE.Vector2;
  mouseSpeed: number;
  constructor() {
    this.mousePos = new THREE.Vector2(0, 0);
    this.mouseSpeed = 0;
  }
  // 追踪鼠标位置
  trackMousePos() {
    window.addEventListener('mousemove', (e) => {
      this.setMousePos(e);
    });
    window.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        this.setMousePos(e.touches[0]);
      },
      { passive: false },
    );
    window.addEventListener('touchmove', (e: TouchEvent) => {
      this.setMousePos(e.touches[0]);
    });
  }
  // 设置鼠标位置
  setMousePos(e: MouseEvent | Touch) {
    const { x, y } = getNormalizedMousePos(e);
    this.mousePos.x = x;
    this.mousePos.y = y;
  }
  // 追踪鼠标速度
  trackMouseSpeed() {
    // https://stackoverflow.com/questions/6417036/track-mouse-speed-with-js
    let lastMouseX = -1;
    let lastMouseY = -1;
    let mouseSpeed = 0;
    window.addEventListener('mousemove', (e) => {
      const mousex = e.pageX;
      const mousey = e.pageY;
      if (lastMouseX > -1) {
        mouseSpeed = Math.max(
          Math.abs(mousex - lastMouseX),
          Math.abs(mousey - lastMouseY),
        );
        this.mouseSpeed = mouseSpeed / 100;
      }
      lastMouseX = mousex;
      lastMouseY = mousey;
    });
    document.addEventListener('mouseleave', () => {
      this.mouseSpeed = 0;
    });
  }
}

const particleExplodeVertexShader = `
vec4 permute(vec4 x){return mod(((x*34.)+1.)*x,289.);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}

float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    
    // First corner
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    
    // Other corners
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    
    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1=x0-i1+1.*C.xxx;
    vec3 x2=x0-i2+2.*C.xxx;
    vec3 x3=x0-1.+3.*C.xxx;
    
    // Permutations
    i=mod(i,289.);
    vec4 p=permute(permute(permute(
                i.z+vec4(0.,i1.z,i2.z,1.))
                +i.y+vec4(0.,i1.y,i2.y,1.))
                +i.x+vec4(0.,i1.x,i2.x,1.));
                
                // Gradients
                // ( N*N points uniformly over a square, mapped onto an octahedron.)
                float n_=1./7.;// N=7
                vec3 ns=n_*D.wyz-D.xzx;
                
                vec4 j=p-49.*floor(p*ns.z*ns.z);//  mod(p,N*N)
                
                vec4 x_=floor(j*ns.z);
                vec4 y_=floor(j-7.*x_);// mod(j,N)
                
                vec4 x=x_*ns.x+ns.yyyy;
                vec4 y=y_*ns.x+ns.yyyy;
                vec4 h=1.-abs(x)-abs(y);
                
                vec4 b0=vec4(x.xy,y.xy);
                vec4 b1=vec4(x.zw,y.zw);
                
                vec4 s0=floor(b0)*2.+1.;
                vec4 s1=floor(b1)*2.+1.;
                vec4 sh=-step(h,vec4(0.));
                
                vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
                vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
                
                vec3 p0=vec3(a0.xy,h.x);
                vec3 p1=vec3(a0.zw,h.y);
                vec3 p2=vec3(a1.xy,h.z);
                vec3 p3=vec3(a1.zw,h.w);
                
                //Normalise gradients
                vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
                p0*=norm.x;
                p1*=norm.y;
                p2*=norm.z;
                p3*=norm.w;
                
                // Mix final noise value
                vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
                m=m*m;
                return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),
                dot(p2,x2),dot(p3,x3)));
            }
            
            vec3 snoiseVec3(vec3 x){
                return vec3(snoise(vec3(x)*2.-1.),
                snoise(vec3(x.y-19.1,x.z+33.4,x.x+47.2))*2.-1.,
                snoise(vec3(x.z+74.2,x.x-124.5,x.y+99.4)*2.-1.)
            );
        }
        
        vec3 curlNoise(vec3 p){
            const float e=.1;
            vec3 dx=vec3(e,0.,0.);
            vec3 dy=vec3(0.,e,0.);
            vec3 dz=vec3(0.,0.,e);
            
            vec3 p_x0=snoiseVec3(p-dx);
            vec3 p_x1=snoiseVec3(p+dx);
            vec3 p_y0=snoiseVec3(p-dy);
            vec3 p_y1=snoiseVec3(p+dy);
            vec3 p_z0=snoiseVec3(p-dz);
            vec3 p_z1=snoiseVec3(p+dz);
            
            float x=p_y1.z-p_y0.z-p_z1.y+p_z0.y;
            float y=p_z1.x-p_z0.x-p_x1.z+p_x0.z;
            float z=p_x1.y-p_x0.y-p_y1.x+p_y0.x;
            
            const float divisor=1./(2.*e);
            return normalize(vec3(x,y,z)*divisor);
        }
        
        uniform float uTime;
        uniform float uProgress;
        varying vec2 vUv;
        
        void main(){
            vec3 noise=curlNoise(vec3(position.x*.02,position.y*.008,uTime*.05));
            vec3 distortion=vec3(position.x*2.,position.y,1.)*noise*uProgress;
            vec3 newPos=position+distortion;
            vec4 modelPosition=modelMatrix*vec4(newPos,1.);
            vec4 viewPosition=viewMatrix*modelPosition;
            vec4 projectedPosition=projectionMatrix*viewPosition;
            gl_Position=projectedPosition;
            gl_PointSize=2.;
            
            vUv=uv;
        }
`;

const particleExplodeFragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
    vec4 color=texture2D(uTexture,vUv);
    if(color.r<.1&&color.g<.1&&color.b<.1){
        discard;
    }
    gl_FragColor=color;
}
`;

class Base {
  debug: boolean;
  container: HTMLElement | null;
  perspectiveCameraParams: PerspectiveCameraParams;
  orthographicCameraParams: OrthographicCameraParams;
  cameraPosition: THREE.Vector3;
  lookAtPosition: THREE.Vector3;
  rendererParams: THREE.WebGLRendererParameters;
  mouseTracker: MouseTracker;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  stats: Stats;
  shaderMaterial: THREE.ShaderMaterial;
  composer: EffectComposer;
  constructor(sel: string, debug = false) {
    this.debug = debug;
    this.container = document.querySelector(sel);
    this.perspectiveCameraParams = {
      fov: 75,
      near: 0.1,
      far: 100,
    };
    this.orthographicCameraParams = {
      zoom: 2,
      near: -100,
      far: 1000,
    };
    this.cameraPosition = new THREE.Vector3(0, 3, 10);
    this.lookAtPosition = new THREE.Vector3(0, 0, 0);
    this.rendererParams = {
      alpha: true,
      antialias: true,
    };
    this.mouseTracker = new MouseTracker();
  }
  // 初始化
  init() {
    this.createScene();
    this.createPerspectiveCamera();
    this.createRenderer();
    this.createMesh({});
    this.createLight();
    this.createOrbitControls();
    this.createDebugUI();
    this.addListeners();
    this.setLoop();
  }
  // 创建场景
  createScene() {
    const scene = new THREE.Scene();
    this.scene = scene;
  }
  // 创建透视相机
  createPerspectiveCamera() {
    const { perspectiveCameraParams, cameraPosition, lookAtPosition } = this;
    const { fov, near, far } = perspectiveCameraParams;
    const aspect = calcAspect(this.container);
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.copy(cameraPosition);
    camera.lookAt(lookAtPosition);
    this.camera = camera;
  }
  // 创建正交相机
  createOrthographicCamera() {
    const { orthographicCameraParams, cameraPosition, lookAtPosition } = this;
    const { left, right, top, bottom, near, far } = orthographicCameraParams;
    const camera = new THREE.OrthographicCamera(
      left,
      right,
      top,
      bottom,
      near,
      far,
    );
    camera.position.copy(cameraPosition);
    camera.lookAt(lookAtPosition);
    this.camera = camera;
  }
  // 更新正交相机参数
  updateOrthographicCameraParams() {
    const { container } = this;
    const { zoom, near, far } = this.orthographicCameraParams;
    const aspect = calcAspect(container);
    this.orthographicCameraParams = {
      left: -zoom * aspect,
      right: zoom * aspect,
      top: zoom,
      bottom: -zoom,
      near,
      far,
      zoom,
    };
  }
  // 创建渲染
  createRenderer() {
    const { rendererParams } = this;
    const renderer = new THREE.WebGLRenderer(rendererParams);
    renderer.setClearColor(0x000000, 0);
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;
    this.resizeRendererToDisplaySize();
  }
  // 调整渲染器尺寸
  resizeRendererToDisplaySize() {
    const { renderer } = this;
    renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  // 创建网格
  createMesh(
    meshObject: MeshObject,
    container: THREE.Scene | THREE.Mesh = this.scene,
  ) {
    const {
      geometry = new THREE.BoxGeometry(1, 1, 1),
      material = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d9dfc8'),
      }),
      position = new THREE.Vector3(0, 0, 0),
    } = meshObject;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    container.add(mesh);
    return mesh;
  }
  // 创建光源
  createLight() {
    const dirLight = new THREE.DirectionalLight(
      new THREE.Color('#ffffff'),
      0.5,
    );
    dirLight.position.set(0, 50, 0);
    this.scene.add(dirLight);
    const ambiLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.4);
    this.scene.add(ambiLight);
  }
  // 创建轨道控制
  createOrbitControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    const { lookAtPosition } = this;
    controls.target.copy(lookAtPosition);
    controls.update();
    this.controls = controls;
  }
  // 创建调试UI
  createDebugUI() {
    const axisHelper = new THREE.AxesHelper();
    this.scene.add(axisHelper);
    const stats = Stats();
    this.container.appendChild(stats.dom);
    this.stats = stats;
  }
  // 监听事件
  addListeners() {
    this.onResize();
  }
  // 监听画面缩放
  onResize() {
    window.addEventListener('resize', (e) => {
      const aspect = calcAspect(this.container);
      const camera = this.camera as THREE.PerspectiveCamera;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      this.resizeRendererToDisplaySize();
      if (this.shaderMaterial) {
        this.shaderMaterial.uniforms.uResolution.value.x = window.innerWidth;
        this.shaderMaterial.uniforms.uResolution.value.y = window.innerHeight;
      }
    });
  }
  // 动画
  update() {
    console.log('animation');
  }
  // 渲染
  setLoop() {
    this.renderer.setAnimationLoop(() => {
      this.update();
      if (this.controls) {
        this.controls.update();
      }
      if (this.stats) {
        this.stats.update();
      }
      if (this.composer) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    });
  }
}

class ParticleExplode extends Base {
  clock!: THREE.Clock;
  particleExplodeMaterial!: THREE.ShaderMaterial;
  params!: any;
  bloomPass!: UnrealBloomPass;
  image!: HTMLImageElement;
  maku!: Maku;
  isOpen!: boolean;
  constructor(sel: string, debug: boolean) {
    super(sel, debug);
    this.clock = new THREE.Clock();
    this.cameraPosition = new THREE.Vector3(0, 0, 1500);
    const fov = getScreenFov(this.cameraPosition.z);
    this.perspectiveCameraParams = {
      fov,
      near: 0.1,
      far: 5000,
    };
    this.image = document.querySelector('img')!;
    this.params = {
      exposure: 1,
      bloomStrength: 0,
      bloomThreshold: 0,
      bloomRadius: 0,
    };
    this.isOpen = false;
  }
  // 初始化
  async init() {
    this.createScene();
    this.createPerspectiveCamera();
    this.createRenderer();
    this.createParticleExplodeMaterial();
    await preloadImages();
    this.createMaku();
    this.createPostprocessingEffect();
    this.createClickEffect();
    this.createLight();
    this.mouseTracker.trackMousePos();
    this.createOrbitControls();
    // this.createDebugPanel();
    this.addListeners();
    this.setLoop();
  }
  // 创建材质
  createParticleExplodeMaterial() {
    const particleExplodeMaterial = new THREE.ShaderMaterial({
      vertexShader: particleExplodeVertexShader,
      fragmentShader: particleExplodeFragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {
          value: 0,
        },
        uMouse: {
          value: new THREE.Vector2(0, 0),
        },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uProgress: {
          value: 0,
        },
        uTexture: {
          value: null,
        },
      },
    });
    this.particleExplodeMaterial = particleExplodeMaterial;
  }
  // 创建点
  createMaku() {
    const { image, particleExplodeMaterial, scene } = this;
    const maku = new Maku(image, particleExplodeMaterial, scene, {
      meshType: 'points',
      segments: {
        width: 128,
        height: 128,
      },
    });
    maku.setPosition();
    this.maku = maku;
  }
  // 创建后期特效
  createPostprocessingEffect() {
    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85,
    );
    bloomPass.threshold = this.params.bloomThreshold;
    bloomPass.strength = this.params.bloomStrength;
    bloomPass.radius = this.params.bloomRadius;
    this.bloomPass = bloomPass;
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
  }
  // 创建点击效果
  createClickEffect() {
    const material = this.maku.mesh.material as any;
    this.maku.el.addEventListener('click', () => {
      if (!this.isOpen) {
        gsap.to(material.uniforms.uProgress, {
          value: 3,
          duration: 1,
        });
        this.isOpen = true;
      } else {
        gsap.to(material.uniforms.uProgress, {
          value: 0,
          duration: 1,
        });
        this.isOpen = false;
      }
    });
  }
  // 动画
  update() {
    const elapsedTime = this.clock.getElapsedTime();
    const mousePos = this.mouseTracker.mousePos;
    if (this.maku) {
      const material = this.maku.mesh.material as any;
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uMouse.value = mousePos;
    }
    this.bloomPass.strength = this.params.bloomStrength;
  }
  // 创建调试面板
  createDebugPanel() {
    const gui = new dat.GUI();
    const material = this.maku.mesh.material as any;
    const uniforms = material.uniforms;
    const params = this.params;
    gui
      .add(uniforms.uProgress, 'value')
      .min(0)
      .max(3)
      .step(0.01)
      .name('progress');
    gui.add(params, 'bloomStrength').min(0).max(10).step(0.01);
  }
}

const start = () => {
  const particleExplode = new ParticleExplode('.particle-explode', false);
  particleExplode.init();
};

start();
