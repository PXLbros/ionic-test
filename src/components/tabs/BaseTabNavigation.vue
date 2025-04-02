<!-- components/tabs/BaseTabNavigation.vue -->
<template>
  <div class="tab-navigation">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tab-item"
      :class="{ active: isActive(tab.path) }"
    >
      <div class="tab-icon">
        <img v-if="typeof tab.icon === 'string'" :src="tab.icon" :alt="tab.label">
        <component v-else :is="tab.icon"></component>
      </div>
      <div class="tab-label">{{ tab.label }}</div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, watch, onMounted } from 'vue';

const props = defineProps<{
  tabs: Array<{
    path: string;
    label: string;
    icon: any;
  }>;
}>();

const route = useRoute();

// Improved active state detection to properly match routes
const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }

  // For section home pages
  if (path === '/fair' || path === '/fairgrounds') {
    return route.path === path;
  }

  // For nested routes
  return route.path.startsWith(path);
};

// Log the tab paths for debugging
onMounted(() => {
  console.log('Tab navigation mounted with paths:', props.tabs.map(tab => ({
    path: tab.path,
    icon: typeof tab.icon === 'string' ? tab.icon : 'Imported icon'
  })));
});

// Watch for route changes for debugging
watch(() => route.path, (newPath) => {
  console.log('Route changed to:', newPath);
}, { immediate: true });
</script>

<style scoped lang="scss">
.tab-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10vh;
  background: rgba(255, 255, 255, 0.844);
  --webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 0px 5px 15px;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #666;
  height: 100%;
  transition: all 0.2s ease;

  &.active {
    color: #007AFF;

    .tab-icon img {
      transform: scale(1.1);
    }

    .tab-label {
      font-weight: 600;
    }
  }
}

.tab-icon {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    transition: transform 0.2s ease;
  }
}

.tab-label {
  font-size: 12px;
  font-weight: 500;
  color: currentColor;
  text-align: center;
}
</style>
