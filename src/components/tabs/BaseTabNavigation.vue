<template>
  <div class="tab-navigation">
    <component
      v-for="tab in formattedTabs"
      :key="tab.path || tab.label"
      :is="tab.onClick ? 'a' : tab.isExternal ? 'a' : 'router-link'"
      :to="!tab.onClick && !tab.isExternal ? tab.path : undefined"
      :href="!tab.onClick && tab.isExternal ? tab.path : undefined"
      class="tab-item"
      :class="{ active: tab.isActive }"
      v-bind="tab.linkAttrs"
      @click="tab.onClick ? tab.onClick() : undefined"
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
import appConfig from '@/config/app';
import { computed } from 'vue';

interface Tab {
  path?: string;
  label: string;
  icon: any;
  onClick?: () => void;
}

const props = defineProps<{
  tabs: Array<Tab>;
}>();

const route = useRoute();

const isExternal = (path: string): boolean => {
  return /^(http|https):\/\//.test(path);
};

const isActive = (tab: Tab): boolean => {
  const path = tab.path || '';

  if (tab.onClick) {
    return false;
  } else if (isExternal(path)) {
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

const formattedTabs = computed(() =>
  props.tabs.map((tab) => ({
    ...tab,
    isExternal: isExternal(tab.path || ''),
    isActive: isActive(tab),
    linkAttrs: tab.onClick
      ? {}
      : tab.path && isExternal(tab.path)
      ? externalLinkAttrs
      : {}
  }))
);
</script>

<style scoped lang="scss">
.tab-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: v-bind('appConfig.bottomBar.height');
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
