<template>
  <BaseTabNavigation :tabs="fairTabs" />
</template>

<script setup lang="ts">
import BaseTabNavigation from '../Tabs/BaseTabNavigation.vue';
import HomeIcon from '@/components/Icons/HomeIcon.vue';
import StartIcon from '@/components/Icons/StartIcon.vue';
import MapIcon from '@/components/Icons/MapIcon.vue';
import ScheduleIcon from '@/components/Icons/ScheduleIcon.vue';
import MenuIcon from '@/components/Icons/MenuIcon.vue';

const emit = defineEmits(['tabClick']);

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
    icon: markRaw(MenuIcon),
    onClick: () => emit('tabClick', { id: 'hamburgerMenu' }),
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
