<!-- components/fairgrounds/FairgroundsBottomNavigation.vue -->
<template>
  <BaseTabNavigation :tabs="fairgroundsTabs" />
</template>

<script setup lang="ts">
import BaseTabNavigation from '../tabs/BaseTabNavigation.vue';
import { ref } from 'vue';
import startIcon from '@/imgs/svg/start.svg';
import homeIcon from '@/imgs/svg/home.svg';
import mapIcon from '@/imgs/svg/map.svg';
import scheduleIcon from '@/imgs/svg/calendar.svg';
import ticketIcon from '@/imgs/svg/ticket.svg';

const fairgroundsTabs = ref([
  {
    path: '/',
    label: 'Start',
    icon: startIcon
  },
  {
    path: '/fairgrounds',
    label: 'Home',
    icon: homeIcon
  },
  {
    path: '/fair/map',
    label: 'Map',
    icon: mapIcon
  },
  {
    path: '/fairgrounds/events',
    label: 'Events',
    icon: scheduleIcon
  },
  {
    path: '/fairgrounds/venues',
    label: 'Venues',
    icon: ticketIcon
  },
]);
</script>

<style scoped lang="scss">
:deep(.tab-navigation) {
  :deep(.tab-navigation) {
    background: #098944;
  }

  :deep(.tab-item) {
    color: #999999;

    &.active {
      color: #007AFF;
    }
  }
}
</style>
