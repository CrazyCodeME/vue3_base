import { createRouter, createWebHistory } from 'vue-router';
import routes from './router';
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from) => {
  if (!localStorage.getItem('token') && to.meta.auth) {
    // 此路由需要授权，请检查是否已登录
    // 如果没有，则重定向到登录页面
    return {
      path: '/login',
      // 保存我们所在的位置，以便以后再来
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
