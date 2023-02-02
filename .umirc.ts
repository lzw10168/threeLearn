import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'three learn',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    // {
    //   name: '权限演示',
    //   path: '/access',
    //   component: './Access',
    // },
    // {
    //   name: ' CRUD 示例',
    //   path: '/table',
    //   component: './Table',
    // },
    {
      name: '00-helloThreejs',
      path: '/00-helloThreejs',
      component: './00-helloThreejs',
    },
    {
      name: '06-animation',
      path: '/06-animation',
      component: './06-animation',
    },
    { name: '07-camera', path: '/07-camera', component: './07-camera' },
    {
      name: '08-fullscreenAndResizing',
      path: '/08-fullscreenAndResizing',
      component: './08-fullscreenAndResizing',
    },
    {
      name: '09-geometry',
      path: '/09-geometry',
      component: './09-geometry',
    },
    {
      name: '10-debugUI',
      path: '/10-debugUI',
      component: './10-debugUI',
    },
    {
      name: '11-textures',
      path: '/11-textures',
      component: './11-textures',
    },
    {
      name: '12-materials',
      path: '/12',
      routes: [
        {
          name: 'MeshBasicMaterial',
          path: '/12/mesh-basic-material',
          component: './12-materials/A_MeshBasicMaterial',
        },
        {
          name: 'MeshNormalMaterial',
          path: '/12/mesh-normal-material',
          component: './12-materials/B_MeshNormalMaterial',
        },
        {
          name: 'MeshMatcapMaterial',
          path: '/12/mesh-matcap-material',
          component: './12-materials/C_MeshMatcapMaterial',
        },
        {
          name: 'MeshDepthMaterial',
          path: '/12/mesh-depth-material',
          component: './12-materials/D_MeshDepthMaterial',
        },
        {
          name: 'MeshLambertMaterial',
          path: '/12/mesh-lambert-material',
          component: './12-materials/E_MeshLambertMaterial',
        },
        {
          name: 'MeshPhongMaterial',
          path: '/12/mesh-phong-material',
          component: './12-materials/F_MeshPhongMaterial',
        },
        {
          name: 'MeshToonMaterial',
          path: '/12/mesh-toon-material',
          component: './12-materials/G_MeshToonMaterial',
        },
        {
          name: 'MeshStandardMaterial',
          path: '/12/mesh-standard-material',
          component: './12-materials/H_MeshStandardMaterial',
        },
        {
          name: 'EnvironmentMap',
          path: '/12/environment-map',
          component: './12-materials/I_EnvironmentMap',
        },
      ],
    },
    { name: '13-3DText', path: '/13-3DText', component: './13-3DText' },
    { name: '14-lights', path: '/14-lights', component: './14-lights' },
    {
      name: '15-shadows',
      path: '/15',
      routes: [
        {
          name: 'shadow',
          path: '/15/shadow',
          component: './15-shadows/A_Shadows',
        },
        {
          name: 'shadowsBaking',
          path: '/15/shadowsBaking',
          component: './15-shadows/B_ShadowsBaking',
        },
        {
          name: 'shadowsBakingSimulation',
          path: '/15/shadowsBakingSimulation',
          component: './15-shadows/C_ShadowsBakingSimulation',
        },
      ],
    },
    {
      name: '17-haunted-house',
      path: '/17-haunted-house',
      component: './17-haunted-house',
    },
    {
      name: '18-particles',
      path: '/18-particles',
      component: './18-particles',
    },
    {
      name: '18-particlesAnimation',
      path: '/18-particlesAnimation',
      component: './18-particlesAnimation',
    },
    {
      name: '18-particlesCustomGeometry',
      path: '/18-particlesCustomGeometry',
      component: './18-particlesCustomGeometry',
    },
    {
      name: '19-galaxy-generator',
      path: '/19-galaxy-generator',
      component: './19-galaxy-generator',
    },
    {
      name: '20-raycaster',
      path: '/20-raycaster',
      component: './20-raycaster',
    },
    {
      name: '20-raycaster-mouse',
      path: '/20-raycaster-mouse',
      component: './20-raycaster-mouse',
    },
    {
      name: '20-raycaster-mouse2',
      path: '/20-raycaster-mouse2',
      component: './20-raycaster-mouse2',
    },
    {
      name: '21-scrollBasedAnimation',
      path: '/21-scrollBasedAnimation',
      component: './21-scrollBasedAnimation',
    },
    {
      name: '22-dominoes',
      path: '/22-dominoes',
      component: './22-dominoes',
    },
    {
      name: '22-physics',
      path: '/22-physics',
      component: './22-physics',
    },
    {
      name: '22-physics-cannon-es',
      path: '/22-physics-cannon-es',
      component: './22-physics-cannon-es',
    },
    {
      name: '22-physics-multi',
      path: '/22-physics-multi',
      component: './22-physics-multi',
    },
    {
      name: '23-importModels',
      path: '/23-importModels',
      component: './23-importModels',
    },
    {
      name: '23-importModelsAnimation',
      path: '/23-importModelsAnimation',
      component: './23-importModelsAnimation',
    },
    {
      name: '24-customModelsWithBlender',
      path: '/24-customModelsWithBlender',
      component: './24-customModelsWithBlender',
    },
    {
      name: '25-realisticRender',
      path: '/25-realisticRender',
      component: './25-realisticRender',
    },
    {
      name: '25-realisticRenderBurger',
      path: '/25-realisticRenderBurger',
      component: './25-realisticRenderBurger',
    },
    {
      name: '26-codeStructrue',
      path: '/26-codeStructrue',
      component: './26-codeStructrue',
    },
    {
      name: 'ScreenShot',
      path: '/screenshot',
      component: './ScreenShot',
    },
  ],
  npmClient: 'pnpm',
});
