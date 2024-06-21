const routes = [
  {
    path: '/login',
    component: () => import('@/system/login.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/system/404.vue'),
  },
];
export default routes;
