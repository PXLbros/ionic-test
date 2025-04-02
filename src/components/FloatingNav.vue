<template>

  <div :id="sectionId" class="menu-button">
    <svg class="menu-icon" @click="openMenu" width="33" height="20" viewBox="0 0 33 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.85 18.6957C14.85 17.9826 15.411 17.3913 16.0875 17.3913H31.7625C32.439 17.3913 33 17.9826 33 18.6957C33 19.4087 32.439 20 31.7625 20H16.0875C15.411 20 14.85 19.4087 14.85 18.6957ZM0 10C0 9.28696 0.561 8.69565 1.2375 8.69565H31.7625C32.439 8.69565 33 9.28696 33 10C33 10.713 32.439 11.3043 31.7625 11.3043H1.2375C0.561 11.3043 0 10.713 0 10ZM6.6 1.30435C6.6 0.591304 7.161 0 7.8375 0H31.7625C32.439 0 33 0.591304 33 1.30435C33 2.01739 32.439 2.6087 31.7625 2.6087H7.8375C7.161 2.6087 6.6 2.01739 6.6 1.30435Z"/>
    </svg>
  </div>
  <!-- Slide-out Menu -->
  <div :id="sectionId" class="nav-wrapper" :class="{ 'is-open': isMenuOpen }">
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
        <SocialIcons :type="type" :social-data="dataStore.data.nysfairWebsite.social" />
      </nav>
    </div>
  </div>

</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { closeCircleOutline } from 'ionicons/icons';

const props = defineProps<{
  type: 'fair' | 'fairgrounds'
  toolbarBackground: string
  menuBackground: string
  logoSrc?: string
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

// ID based on the type
const sectionId = props.type === 'fair' ? 'fair' : 'fairgrounds';

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

.menu-button {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 10;
  background-color: #098944;
  padding: 25px 20px;
  border-bottom-left-radius: 10px;
  padding-top: 40px;

  svg {
    fill: #F4E8AB;
  }
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
  margin-right: 0px;
  color: #F4E8AB;
  fill: #F4E8AB;
}

#fairgrounds .menu-icon {
  color: #FFD100;
  fill: #FFD100;
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
  padding-top: 90px;
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

  // fairgrounds specific active state
  #fairgrounds &.router-link-active {
    color: #FDD252;
    font-weight: 500;
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

#fairgrounds .secondary-links .notifications {
  color: #FFF;
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
