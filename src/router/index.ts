import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/HomePage.vue'),
    meta: {
      title: 'Home',
      showInMenu: false,
      menuOrder: 5
    }
  },
  {
    path: '/fairgrounds',
    component: () => import('@/views/fairgrounds/FairgroundsHomePage.vue'),
    meta: {
      title: 'Home',
      showInMenu: true,
      menuOrder: 1
    }
  },
  {
    path: '/fairgrounds/featured-event',
    component: () => import('@/views/fairgrounds/FairgroundsHomePage.vue'),
    meta: {
      title: 'Featured Event',
      showInMenu: false
    }
  },
  {
    path: '/fairgrounds/upcoming-events',
    component: () => import('@/views/fairgrounds/UpcomingEventsPage.vue'),
    meta: {
      title: 'Upcoming Events',
      showInMenu: true,
      menuOrder: 2
    }
  },
  {
    path: '/fairgrounds/upcoming-events/:id',
    component: () => import('@/views/fairgrounds/UpcomingEventDetailPage.vue'),
    meta: {
      title: 'Upcoming Event Detail',
      showInMenu: false
    }
  },
  {
    path: '/fairgrounds/venues',
    component: () => import('@/views/fairgrounds/VenuesPage.vue'),
    meta: {
      title: 'Venues',
      showInMenu: true,
      menuOrder: 3
    }
  },
  {
    path: '/fairgrounds/venues/:id',
    component: () => import('@/views/fairgrounds/VenueDetailPage.vue'),
    meta: {
      title: 'Venue Detail',
      showInMenu: false
    }
  },
  {
    path: '/fairgrounds/rental-opportunity',
    component: () => import('@/views/fairgrounds/RentalOpportunityPage.vue'),
    meta: {
      title: 'Rental Opportunity',
      showInMenu: true,
      menuOrder: 3
    }
  },
  {
    path: '/fair',
    component: () => import('@/views/fair/FairHomePage.vue'),
    meta: {
      title: 'Home',
      showInMenu: true,
      menuOrder: 1
    }
  },
  // {
  //   path: '/fair/tickets',
  //   component: () => import('@/views/fair/TicketsPage.vue'),
  //   meta: {
  //     title: 'Buy Tickets',
  //     showInMenu: true,
  //     menuOrder: 2
  //   }
  // },
  {
    path: '/fair/map',
    component: () => import('@/views/fair/MapPage.vue'),
    meta: {
      title: 'Fair Finder Interactive Map',
      showInMenu: true,
      menuOrder: 3,
      subLoader: true,
    }
  },
  {
    path: '/fair/schedule',
    component: () => import('@/views/fair/DailySchedulePage.vue'),
    meta: {
      title: 'Daily Schedule',
      showInMenu: true,
      menuOrder: 4
    }
  },
  {
    path: '/fair/schedule/favorites',
    name: 'event-favorites',
    component: () => import('@/views/fair/EventFavoritesPage.vue'),
    meta: {
      title: 'Event Favorites',
      // showInMenu: true,
      // menuOrder: 4
    }
  },
  {
    path: '/fair/music',
    component: () => import('@/views/fair/MusicPage.vue'),
    meta: {
      title: 'Chevrolet Music Series',
      showInMenu: true,
      menuOrder: 5
    }
  },
  {
    path: '/fair/music/:id',
    component: () => import('@/views/fair/MusicDetailPage.vue'),
    meta: {
      title: 'Music Detail',
      showInMenu: false,
      menuOrder: 6
    }
  },
  {
    path: '/fair/updates',
    name: 'updates',
    component: () => import('@/views/fair/UpdatesPage.vue'),
    meta: {
      title: 'Real-Time Updates',
      showInMenu: true,
      menuOrder: 6
    }
  },
  {
    path: '/fair/games',
    component: () => import('@/views/fair/GamesPage.vue'),
    meta: {
      title: 'Activities & Ag Facts',
      showInMenu: true,
      menuOrder: 7
    }
  },
  {
    path: '/fair/plan-your-visit',
    component: () => import('@/views/fair/PlanVisitPage.vue'),
    meta: {
      title: 'Plan Your Visit',
      showInMenu: true,
      menuOrder: 8
    }
  },
  {
    path: '/fair/directions',
    component: () => import('@/views/fair/DirectionsPage.vue'),
    meta: {
      title: 'Directions',
      showInMenu: false
    }
  },
  {
    path: '/fair/parking',
    component: () => import('@/views/fair/ParkingPage.vue'),
    meta: {
      title: 'Directions',
      showInMenu: false
    }
  },
  {
    path: '/fair/faq',
    component: () => import('@/views/fair/FAQPage.vue'),
    meta: {
      title: 'Directions',
      showInMenu: false
    }
  },
  {
    path: '/fair/news',
    component: () => import('@/views/fair/NewsPage.vue'),
    meta: {
      title: 'News',
      showInMenu: true,
      menuOrder: 9
    }
  },
  {
    path: '/fair/news/:id',
    component: () => import('@/views/fair/NewsDetailPage.vue'),
    meta: {
      title: 'News Detail',
      showInMenu: false,
      subLoader: true,
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   const swipeDisabledRoutes = ['/fair/map'];

//   const isSwipeDisabled = swipeDisabledRoutes.includes(to.path);

//   const ionRouter = document.querySelector('ion-router-outlet');

//   if (ionRouter) {
//     // @ts-ignore
//     ionRouter.swipeHandler = isSwipeDisabled ? null : true;
//   }

//   next();
// });

router.afterEach((to) => {
  const html = document.documentElement

  const fairClass = 'site--fair';
  const fairgroundsClass = 'site--fairgrounds';

  if (to.path.startsWith('/fairgrounds')) {
    html.classList.add(fairgroundsClass);
    html.classList.remove(fairClass);
  } else if (to.path.startsWith('/fair')) {
    html.classList.add(fairClass);
    html.classList.remove(fairgroundsClass);
  } else {
    html.classList.remove(fairClass);
    html.classList.remove(fairgroundsClass);
  }
});

export default router
