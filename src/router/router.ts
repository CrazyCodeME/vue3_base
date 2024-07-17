import { Layout } from '@/layout';
const routes = [
  {
    path: '/',
    name: 'root',
    redirect: () => {
      return '/';
    },
    component: Layout,
    children: [
      {
        path: '/',
        component: () => import('@/views/system/index.vue'),
      },
    ],
  },
];
export default routes;
