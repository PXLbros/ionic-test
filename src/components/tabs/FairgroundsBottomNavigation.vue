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
import HomeIcon from '@/components/icons/HomeIcon.vue';
import StartIcon from '@/components/icons/StartIcon.vue';
import MapIcon from '@/components/icons/MapIcon.vue';
import CalendarIcon from '@/components/icons/CalendarIcon.vue';
import PinIcon from '@/components/icons/PinIcon.vue';

const fairgroundsTabs = ref([
  {
    path: '/',
    label: 'Start',
    icon: StartIcon
  },
  {
    path: '/fairgrounds',
    label: 'Home',
    icon: HomeIcon
  },
  {
    path: '/fair/map',
    label: 'Map',
    icon: MapIcon
  },
  {
    path: '/fairgrounds/upcoming-events',
    label: 'Events',
    icon: CalendarIcon
  },
  {
    path: '/fairgrounds/venues',
    label: 'Venues',
    icon: PinIcon
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
