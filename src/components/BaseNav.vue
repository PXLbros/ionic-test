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
            <router-link 
              v-for="route in filteredRoutes" 
              :key="route.path"
              :to="route.path"
              class="nav-link"
              @click="closeMenu"
            >
              {{ route.meta?.title }}
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { IonToolbar, IonHeader } from '@ionic/vue';
  
  const props = defineProps<{
    type: 'fair' | 'fairgrounds'
    toolbarBackground: string
    menuBackground: string
    logoSrc: string
    logoAlt: string
  }>();
  
  const router = useRouter();
  const isMenuOpen = ref(false);
  
  const filteredRoutes = computed(() => {
    return router.options.routes.filter(route => {
        // Always include the home route
        if (route.path === '/') {
        return true;
        }

        // Split the path into segments
        const pathSegments = route.path.split('/').filter(Boolean);
        
        if (props.type === 'fair') {
        // Only include routes where the first segment is exactly 'fair'
        return pathSegments[0] === 'fair';
        } else {
        // Only include routes where the first segment is exactly 'fairgrounds'
        return pathSegments[0] === 'fairgrounds';
        }
    });
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
    right: -290px;
    width: 290px;
    height: 100vh; // Changed to viewport height
    background: linear-gradient(180deg, #7323B4 0%, #540F8C 100%);
    transition: transform 0.3s ease;
    pointer-events: auto;
    overflow-y: auto;
    z-index: 10000; // Ensure menu is above overlay
    
    &.is-open {
      transform: translateX(-290px);
    }
  }
  
  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    padding-top: 30px;
    background: #48027FE5;
  }
  
  .nav-logo {
    height: 40px;
  }
  
  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 28px;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .nav-links {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  
  .nav-link {
    color: white;
    text-decoration: none;
    font-family: 'Pally', sans-serif;
    font-size: 18px;
    padding: 15px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
  
    &.router-link-active {
      color: #FFF1AF;
    }
  }
  </style>