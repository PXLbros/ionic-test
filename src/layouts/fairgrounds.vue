<template>
  <ion-page id="layout">
    <ion-header>
      <ion-toolbar style="--background: #19262D; color: #FFFFFF;">
        <ion-buttons slot="start">
          <ion-back-button :default-href="backButtonHref" @click="goBack"></ion-back-button>
        </ion-buttons>

        <div class="header-container">
          <ion-title id="fg-bar-title">{{ title }}</ion-title>
        </div>

        <!-- Menu button on the right side if showMenuButton is true -->
        <ion-buttons class="menu-button" slot="end" v-if="showMenuButton">
          <ion-button @click="openMenu">
            <HamburgerIcon class="menu-icon" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Slide-out Menu -->
    <div class="nav-wrapper" :class="{ 'is-open': isMenuOpen }" v-if="showMenuButton">
      <div
        class="nav-overlay"
        :class="{ 'is-visible': isMenuOpen }"
        @click="closeMenu"
      ></div>

      <div class="nav-menu" :class="{ 'is-open': isMenuOpen }" style="background: #19262D;">
        <div class="nav-header" style="background: #19262D;">
          <img
            src="/src/imgs/svg/fg-light.svg"
            alt="Fairgrounds Logo"
            class="nav-logo"
          >
          <button class="close-button" @click="closeMenu">
            <ion-icon :icon="closeCircleOutline"></ion-icon>
          </button>
        </div>

        <nav class="nav-links">
          <div class="primary-links">
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
                to="/fair"
                class="nav-link"
                @click="closeMenu"
              >
                New York State Fair
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

          <SocialIcons type="fairgrounds" :social-data="dataStore.data.nysfairWebsite.social" />
        </nav>
      </div>
    </div>

    <ion-content :fullscreen="true">
      <slot />
    </ion-content>

    <FairgroundsBottomNavigation />

    <ion-toast
      :isOpen="appStore.toast.isOpen"
      :message="appStore.toast.message"
      :duration="appStore.toast.duration"
      position="bottom"
      @didDismiss="appStore.closeToast()"
    />
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonToast, IonButton, IonIcon } from '@ionic/vue';
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { useDataStore } from '@/stores/data';
import { closeCircleOutline } from 'ionicons/icons';
import SocialIcons from '@/components/SocialIcons.vue';
import { useRouter } from 'vue-router';
import FairgroundsBottomNavigation from '@/components/tabs/FairgroundsBottomNavigation.vue';
import HamburgerIcon from '@/components/icons/HamburgerIcon.vue';

const props = withDefaults(defineProps<{
  title: string;
  backButtonHref?: string;
  showMenuButton?: boolean;
}>(), {
  backButtonHref: '/fairgrounds',
  showMenuButton: false
});

const appStore = useAppStore();
const dataStore = useDataStore();
const router = useRouter();
const isMenuOpen = ref(false);

const mainNavLinks = computed(() => {
  return router.options.routes.filter(route => {
    if (!route.meta?.showInMenu) {
      return false;
    }

    if (route.path === '/') {
      return true;
    }

    const pathSegments = route.path.split('/').filter(Boolean);
    return pathSegments[0] === 'fairgrounds';
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
    } catch (error) {
      console.error('Error disabling notifications:', error);
    }
  } else {
    try {
      await appStore.enablePushNotifications();
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  }
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/fairgrounds');
  }
};
</script>

<style scoped lang="scss">
ion-toolbar {
  --background: #19262D;
  color: #FFFFFF;
  text-transform: uppercase;
}

.menu-icon {
  width: 24px;
  height: 24px;
  color: #FFD100;
  fill: #FFD100;
}

// Center the title container
.header-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none; // Allows clicking the back button
}

ion-title {
  position: relative;
  text-align: center;
  font-size: 24px;
  margin-top: 3px;
  padding: 0;
  width: auto;
  font-family: 'lalezar', sans-serif;
  font-weight: 800;
}

ion-back-button {
  color: #FFD100;
  position: relative; // Ensures it stays above the centered title
  z-index: 1;
}

/* Menu styles */
.nav-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
}

.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
  width: 100%;
  height: 95vh;
  background: #19262D;
  transition: transform 0.3s ease;
  pointer-events: auto;
  overflow-y: auto;
  z-index: 10000;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);

  &.is-open {
    transform: translateY(100%);
  }
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  padding-top: 90px;
  background: #19262D;
}

.nav-logo {
  height: 40px;
}

.close-button {
  background: none;
  border: none;
  color: #FFD100;
  font-size: 36px;
  padding: 0px 0px;
  cursor: pointer;
}

.nav-links {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 100px);
  justify-content: space-between;

  .primary-links {
    padding: 20px;
  }

  .secondary-links {
    padding: 0px 20px 30px 20px;
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
    color: #FDD252;
    font-weight: 500;
  }

  .arrow {
    font-size: 24px;
  }
}

.separator {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 40px 0;
}

.notifications {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  color: #FFFFFF;
  font-weight: 500;
  font-size: 20px;

  .enable-btn {
    background: none;
    border: none;
    color: #FDD252;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }
}

.menu-button {
  margin-right: 10px;
}
</style>
