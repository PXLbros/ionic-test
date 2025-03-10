<!-- components/fair/FairBottomNavigation.vue -->
<template>
  <BaseTabNavigation :tabs="fairTabs" />
</template>

<script setup lang="ts">
import BaseTabNavigation from '../tabs/BaseTabNavigation.vue';
import { ref } from 'vue';
import startIcon from '@/imgs/svg/start.svg';
import homeIcon from '@/imgs/svg/home.svg';
import mapIcon from '@/imgs/svg/map.svg';
import scheduleIcon from '@/imgs/svg/calendar.svg';
import ticketIcon from '@/imgs/svg/ticket.svg';


const fairTabs = ref([
  {
    path: '/',
    label: 'Start',
    icon: startIcon
  },
  {
    path: '/fair',
    label: 'Home',
    icon: homeIcon
  },
  {
    path: '/fair/map',
    label: 'Map',
    icon: mapIcon
  },
  {
    path: '/fair/schedule',
    label: 'Schedule',
    icon: scheduleIcon
  },
  {
    path: '/fair/tickets',
    label: 'Tickets',
    icon: ticketIcon
  },
]);
</script>

<style scoped lang="scss">
:deep(.tab-navigation) {
  background: #098944;
}

:deep(.tab-item) {
  color: #999999;

  &.active {
    color: #007AFF;
  }
}
</style>
