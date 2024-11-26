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
    component: () => import('@/views/fairgrounds/FairgroundsPage.vue'),
    meta: {
      title: 'Fairgrounds'
    }
  },
  {
    path: '/fairgrounds/featured-event',
    component: () => import('@/views/fairgrounds/FairgroundsPage.vue'),
    meta: {
      title: 'Featured Event'
    }
  },
  {
    path: '/fair',
    component: () => import('@/views/fair/FairPage.vue'),
    meta: {
      title: 'New York State Fair'
    }
  },
  {
    path: '/fair/tickets',
    component: () => import('@/views/fair/TicketsPage.vue'),
    meta: {
      title: 'Tickets'
    }
  },
  {
    path: '/fair/map',
    component: () => import('@/views/fair/MapPage.vue'),
    meta: {
      title: 'Interactive Map'
    }
  },
  {
    path: '/fair/schedule',
    component: () => import('@/views/fair/DailySchedulePage.vue'),
    meta: {
      title: 'Schedule'
    }
  },
  {
    path: '/fair/music',
    component: () => import('@/views/fair/MusicPage.vue'),
    meta: {
      title: 'Music'
    }
  },
  {
    path: '/fair/updates',
    component: () => import('@/views/fair/UpdatesPage.vue'),
    meta: {
      title: 'Updates'
    }
  },
  {
    path: '/fair/games',
    component: () => import('@/views/fair/GamesPage.vue'),
    meta: {
      title: 'Games'
    }
  },
  {
    path: '/fair/plan-your-visit',
    component: () => import('@/views/fair/PlanVisitPage.vue'),
    meta: {
      title: 'Plan Your Visit'
    }
  },
  {
    path: '/fair/directions',
    component: () => import('@/views/fair/DirectionsPage.vue'),
    meta: {
      title: 'Directions'
    }
  },
  {
    path: '/fair/news',
    component: () => import('@/views/fair/NewsPage.vue'),
    meta: {
      title: 'News'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
