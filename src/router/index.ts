import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import MapPage from '@/views/MapPage.vue';
import EventsPage from '@/views/EventsPage.vue';
import FairPage from '@/views/FairPage.vue';
import HomePage from '@/views/HomePage.vue';
import Tabs from '@/Tabs.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/home'
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: 'home'
      },
      {
        path: 'home',
        component: HomePage
      },
      {
        path: 'map',
        component: MapPage,
      },
      {
        path: 'events',
        component: EventsPage,
      },
      {
        path: 'fair',
        component: FairPage,
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
