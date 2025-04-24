<!-- components/fairgrounds/FairgroundsBottomNavigation.vue -->
<template>
  <BaseTabNavigation :tabs="fairgroundsTabs" />
</template>

<script setup lang="ts">
import BaseTabNavigation from '../Tabs/BaseTabNavigation.vue';
import HomeIcon from '@/components/Icons/HomeIcon.vue';
import StartIcon from '@/components/Icons/StartIcon.vue';
import MapIcon from '@/components/Icons/MapIcon.vue';
import CalendarIcon from '@/components/Icons/CalendarIcon.vue';
import PinIcon from '@/components/Icons/PinIcon.vue';

const fairgroundsTabs = ref([
  {
    path: '/',
    label: 'Start',
    icon: markRaw(StartIcon)
  },
  {
    path: '/fairgrounds',
    label: 'Home',
    icon: markRaw(HomeIcon)
  },
  {
    path: '/fair/map',
    label: 'Map',
    icon: markRaw(MapIcon)
  },
  {
    path: '/fairgrounds/upcoming-events',
    label: 'Events',
    icon: markRaw(CalendarIcon)
  },
  {
    path: '/fairgrounds/venues',
    label: 'Venues',
    icon: markRaw(PinIcon)
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
