<!-- components/base/BaseNavMenu.vue -->
<template>
  <div class="base-nav">
    <!-- Main Navbar -->
    <ion-header>
      <ion-toolbar :style="{ '--background': toolbarBackground }">
        <div class="nav-container">
          <router-link :to="`/${type}`">
            <img
              :src="logoSrc"
              :alt="logoAlt"
              class="header-side logo"
            >
          </router-link>
          <img
            src="/src/imgs/svg/menu.svg"
            alt="menu-open"
            class="header-side menu-icon"
            @click="openMenu"
          >
        </div>
      </ion-toolbar>
    </ion-header>

    <!-- Slide-out Menu -->
    <div class="nav-wrapper" :class="{ 'is-open': isMenuOpen }">
      <div
        class="nav-overlay"
        :class="{ 'is-visible': isMenuOpen }"
        @click="closeMenu"
      ></div>

      <div class="nav-menu" :class="{ 'is-open': isMenuOpen }" :style="{ background: menuBackground }">
        <div class="nav-header" :style="{ background: toolbarBackground }">
          <img
            :src="logoSrc"
            :alt="logoAlt"
            class="nav-logo"
          >
          <button class="close-button" @click="closeMenu">
            <ion-icon :icon="closeCircleOutline"></ion-icon>
          </button>
        </div>

        <nav class="nav-links">
          <div class="primary-links">
            <!-- Cross-section navigation -->

            <!-- Regular navigation links -->
            <router-link
            v-for="route in mainNavLinks"
            :key="route.path"
            :to="route.path"
            class="nav-link"
            @click="closeMenu"
            >
            {{ route.meta?.title }}
          </router-link>

          <div class="section-switch">
            <router-link
              :to="oppositeSection.path"
              class="nav-link"
              @click="closeMenu"
            >
              {{ oppositeSection.title }}
            </router-link>
          </div>
          </div>

          <!-- Secondary Links -->
          <div class="secondary-links">
            <div class="separator"></div>
            <div class="notifications">
              <span>Notifications</span>
              <button class="enable-btn" @click="toggleNotifications">
                {{ notificationsButtonText }}
              </button>
            </div>

            <a href="#" class="nav-link secondary">Contact Us <span class="arrow">›</span></a>
            <a href="#" class="nav-link secondary">
              Terms of Service
              <span class="arrow">›</span>
            </a>
            <a href="#" class="nav-link secondary">
              Privacy Policy
              <span class="arrow">›</span>
            </a>

          </div>

          <!-- Social Links -->
          <SocialIcons :social-data="dataStore.data.nysfairWebsite.social" />
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { IonToolbar, IonHeader } from '@ionic/vue';
import { closeCircleOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';

const props = defineProps<{
  type: 'fair' | 'fairgrounds'
  toolbarBackground: string
  menuBackground: string
  logoSrc: string
  logoAlt: string
}>();

const appStore = useAppStore();
const dataStore = useDataStore();
const router = useRouter();
const isMenuOpen = ref(false);

const oppositeSection = computed(() => {
  if (props.type === 'fair') {
    return {
      path: '/fairgrounds',
      title: 'New York State Fairgrounds'
    };
  } else {
    return {
      path: '/fair',
      title: 'New York State Fair'
    };
  }
});

const mainNavLinks = computed(() => {
  return router.options.routes.filter(route => {
    if (!route.meta?.showInMenu) {
      return false;
    }

    if (route.path === '/') {
      return true;
    }

    const pathSegments = route.path.split('/').filter(Boolean);

    if (props.type === 'fair') {
      return pathSegments[0] === 'fair';
    } else {
      return pathSegments[0] === 'fairgrounds';
    }
  }).sort((a, b) => (Number(a.meta?.menuOrder) || 99) - (Number(b.meta?.menuOrder) || 99));
});

const openMenu = () => {
  isMenuOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};

const notificationsButtonText = computed(() => {
  return appStore.pushNotifications.permissionStatus === 'granted'
    ? 'Disable'
    : 'Enable';
});

const toggleNotifications = async () => {
  if (appStore.pushNotifications.permissionStatus === 'granted') {
    try {
      await appStore.disablePushNotifications();

      console.log('Notifications disabled successfully');
    } catch (error) {
      console.error('Error disabling notifications:', error);
    }
  } else {
    try {
      await appStore.enablePushNotifications();

      console.log('Notifications enabled successfully');
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  }
};
</script>

<style scoped lang="scss">
  ion-toolbar {
    --background: #49027fe9;
    -webkit-backdrop-filter: blur(7px);
    backdrop-filter: blur(7px);
  }

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

  }

  .header-side {
    padding: 0px 25px 10px 25px;
  }

  .logo {
    height: 60px;

  }

  .menu-icon {
    cursor: pointer;
  }

  .nav-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw; // Changed to viewport width
    height: 100vh; // Changed to viewport height
    pointer-events: none;
    z-index: 9999; // Increased z-index to ensure it's above everything
  }

  .nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw; // Changed to viewport width
    height: 100vh; // Changed to viewport height
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;

    &.is-visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .nav-menu {
    position: fixed;
    top: -100%;
    left: 0;
    // right: -100%;
    width: 100%;
    height: 95vh; // Changed to viewport height
    background: linear-gradient(180deg, #7323B4 0%, #540F8C 100%);
    transition: transform 0.3s ease;
    pointer-events: auto;
    overflow-y: auto;
    z-index: 10000; // Ensure menu is above overlay
    border-bottom-left-radius: 15px; /* Added rounded corners */
    border-bottom-right-radius: 15px; /* Added rounded corners */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Added shadow for better visual separation */

    &.is-open {
      // transform: translateX(-100%);
      transform: translateY(100%);
    }
  }

  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    // padding-top: 40px;
    padding-top: 80px;
    background: #48027FE5;
  }

  .nav-logo {
    height: 40px;
  }

  .close-button {
    background: none;
    border: none;
    color: #FDD252;
    font-size: 36px;
    padding: 0px 0px;
    cursor: pointer;
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    //padding: 20px;
    min-height: calc(100vh - 100px); // Changed to viewport height
    // min-height: calc(90vh - 100px); /* Adjusted for 90vh height */
    justify-content: space-between;

    .primary-links {
      padding: 20px;
    }
  }

  .nav-link {
    color: #FFF;
    text-decoration: none;
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    line-height: 45px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.secondary {
      font-size: 18px;
      line-height: 40px;
    }

    &:last-child {
      border-bottom: none;
    }

    &.router-link-active {
      color: #000000;
      font-weight: 500;
    }

    .arrow {
      font-size: 24px;
    }
  }

  .separator {
    height: 1px;
    background: rgba(20, 20, 20, 0.1);
    margin: 40px 0;
  }

  .secondary-links {
    padding: 0px 20px 30px 20px;


    .notifications {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      color: black;
      font-weight: 500;
      font-size: 20px;

      .enable-btn {
        background: none;
        border: none;
        color: #7323B4;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }
    }
  }
  </style>


