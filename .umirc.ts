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
      name: '09-geometry2',
      path: '/09-geometry2',
      component: './09-geometry2',
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
      path: '/12-materials',
      component: './12-materials',
    },
    {
      name: '12-materialsEnvironmentMap',
      path: '/12-materialsEnvironmentMap',
      component: './12-materialsEnvironmentMap',
    },
    { name: '13-3DText', path: '/13-3DText', component: './13-3DText' },
    { name: '15-lights', path: '/15-lights', component: './15-lights' },
    {
      name: '16-shadows',
      path: '/16-shadows',
      component: './16-shadows',
    },
    {
      name: '16-shadows-baking',
      path: '/16-shadows-baking',
      component: './16-shadows-baking',
    },
    {
      name: '16-shadows-baking-simulation',
      path: '/16-shadows-baking-simulation',
      component: './16-shadows-baking-simulation',
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
  ],
  npmClient: 'pnpm',
});
