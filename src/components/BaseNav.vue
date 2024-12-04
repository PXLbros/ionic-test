<!-- components/base/BaseNavMenu.vue -->
<template>
  <div>
    <!-- Main Navbar -->
    <ion-header>
      <ion-toolbar :style="{ '--background': toolbarBackground }">
        <div class="nav-container">
          <img 
            :src="logoSrc" 
            :alt="logoAlt" 
            class="header-side logo"
          >
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
            <span>×</span>
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
              <button class="enable-btn">Enable</button>
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

            <!-- Social Links -->
            <div class="social-links">
              <h3>FOLLOW US</h3>
              <div class="social-icons">
                <a href="#" class="social-icon"><ion-icon :icon="logoInstagram" size="large"></ion-icon></a>
                <a href="#" class="social-icon"><ion-icon :icon="logoFacebook" size="large"></ion-icon></a>
                <a href="#" class="social-icon"><ion-icon :icon="logoX" size="large"></ion-icon></a>
                <a href="#" class="social-icon"><ion-icon :icon="logoTiktok" size="large"></ion-icon></a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { IonToolbar, IonHeader, IonIcon } from '@ionic/vue';
import { logoFacebook, logoInstagram, logoTiktok, logoX } from 'ionicons/icons';

const props = defineProps<{
  type: 'fair' | 'fairgrounds'
  toolbarBackground: string
  menuBackground: string
  logoSrc: string
  logoAlt: string
}>();

const router = useRouter();
const isMenuOpen = ref(false);

const oppositeSection = computed(() => {
  if (props.type === 'fair') {
    return {
      path: '/fairgrounds',
      title: 'Fairgrounds'
    };
  } else {
    return {
      path: '/fair',
      title: 'Fair'
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
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh; // Changed to viewport height
    background: linear-gradient(180deg, #7323B4 0%, #540F8C 100%);
    transition: transform 0.3s ease;
    pointer-events: auto;
    overflow-y: auto;
    z-index: 10000; // Ensure menu is above overlay
    
    &.is-open {
      transform: translateX(-100%);
    }
  }
  
  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    padding-top: 40px;
    background: #48027FE5;
  }
  
  .nav-logo {
    height: 40px;
  }
  
  .close-button {
    background: none;
    border: none;
    color: black;
    font-size: 36px;
    padding: 0px 0px;
    cursor: pointer;
  }
  
  .nav-links {
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-height: calc(100vh - 100px); // Changed to viewport height
    justify-content: space-between;
  }
  
  .nav-link {
    color: #343434;
    text-decoration: none;
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    line-height: 56px;
    font-weight: 500;
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
    margin: 20px 0;
  }
  
  .secondary-links {
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
  
  .social-links {
    margin-top: 40px;
    text-align: center;
  
    h3 {
      color: #343434;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 20px;
    }
  
    .social-icons {
      display: flex;
      justify-content: center;
      gap: 20px;
  
      .social-icon {
        background: transparent;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #343434;
        text-decoration: none;
      }
    }
  }
  </style>