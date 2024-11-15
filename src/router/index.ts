import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';



const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/HomePage.vue'),
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/fairgrounds',
    component: () => import('@/views/FairPage.vue'),
    meta: {
      title: 'Fairgrounds'
    }
  },
  {
    path: '/fair',
    component: () => import('@/views/FairPage.vue'),
    meta: {
      title: 'New York State Fair'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
