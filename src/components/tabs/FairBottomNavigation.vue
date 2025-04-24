<template>
  <BaseTabNavigation :tabs="fairTabs" />
</template>

<script setup lang="ts">
import BaseTabNavigation from '../tabs/BaseTabNavigation.vue';
import HomeIcon from '@/components/icons/HomeIcon.vue';
import StartIcon from '@/components/icons/StartIcon.vue';
import MapIcon from '@/components/icons/MapIcon.vue';
import ScheduleIcon from '@/components/icons/ScheduleIcon.vue';
import TicketsIcon from '@/components/icons/TicketsIcon.vue';
import { useLogger } from '@/composables/useLogger';

const props = withDefaults(defineProps<{
  hamburgerMenuBaseNav?: any;
}>(), {
  hamburgerMenuBaseNav: null
});

const logger = useLogger();

const openMenu = () => {
  const baseNav = props.hamburgerMenuBaseNav;
  if (baseNav && typeof baseNav.openMenu === 'function') {
    baseNav.openMenu();
  } else {
    logger.warn('hamburgerMenuBaseNav is not ready or missing openMenu');
  }
};

const fairTabs = ref([
  {
    path: '/',
    label: 'Start',
    icon: markRaw(StartIcon)
  },
  {
    path: '/fair',
    label: 'Home',
    icon: markRaw(HomeIcon)
  },
  {
    path: '/fair/map',
    label: 'Map',
    icon: markRaw(MapIcon)
  },
  {
    path: '/fair/schedule',
    label: 'Schedule',
    icon: markRaw(ScheduleIcon)
  },
  {
    label: 'Menu',
    icon: markRaw(TicketsIcon),
    onClick: openMenu,
  },
]);
</script>

<style scoped lang="scss">
:deep(.tab-navigation) {
  background: #098944;
}

:deep(.tab-item) {
  color: #999999;

  .tab-icon svg path {
    fill: #999999;
  }

  &.active {
    color: #007AFF;

    .tab-icon svg path {
      fill: #007AFF;
    }
  }
}
</style>
