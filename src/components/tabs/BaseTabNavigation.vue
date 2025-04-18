<template>
  <div class="tab-navigation">
    <component
      v-for="tab in props.tabs"
      :key="tab.path"
      :is="isExternal(tab.path) ? 'a' : 'router-link'"
      :to="!isExternal(tab.path) ? tab.path : undefined"
      :href="isExternal(tab.path) ? tab.path : undefined"
      class="tab-item"
      :class="{ active: isActive(tab.path) }"
      v-bind="isExternal(tab.path) ? externalLinkAttrs : {}"
    >
      <div class="tab-icon">
        <img v-if="typeof tab.icon === 'string'" :src="tab.icon" :alt="tab.label">
        <component v-else :is="tab.icon" />
      </div>
      <div class="tab-label">{{ tab.label }}</div>
    </component>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const props = defineProps<{
  tabs: Array<{
    path: string;
    label: string;
    icon: any;
  }>;
}>();

const route = useRoute();

const isExternal = (path: string): boolean => {
  return /^(http|https):\/\//.test(path);
};

const isActive = (path: string): boolean => {
  if (isExternal(path)) {
    return false;
  }

  if (path === '/') {
    return route.path === '/';
  }

  if (path === '/fair' || path === '/fairgrounds') {
    return route.path === path;
  }

  return route.path.startsWith(path);
};

// Static attributes for external links
const externalLinkAttrs = {
  target: '_blank',
  rel: 'noopener noreferrer'
};
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
