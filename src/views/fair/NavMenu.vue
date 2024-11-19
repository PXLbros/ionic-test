<!-- NavMenu.vue -->
<template>
    <div>
      <!-- Main Navbar -->
      <ion-header>
        <ion-toolbar>
          <div class="nav-container">
            <img 
              src="/src/imgs/svg/fair-logo-light.svg" 
              alt="NYSF Logo" 
              class="header-side"
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
        
        <div class="nav-menu" :class="{ 'is-open': isMenuOpen }">
          <div class="nav-header">
            <img 
              src="/src/imgs/svg/fair-logo-light.svg" 
              alt="NYSF Logo" 
              class="nav-logo"
            >
            <button class="close-button" @click="closeMenu">
              <span>×</span>
            </button>
          </div>
          
          <nav class="nav-links">
            <router-link 
              v-for="route in routes" 
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { IonToolbar, IonHeader } from '@ionic/vue';
  
  const router = useRouter();
  const routes = router.options.routes;
  const isMenuOpen = ref(false);
  
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
    --background: #48027FE5;
  }
  
  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-side {
    padding: 5px 25px 10px 25px;
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