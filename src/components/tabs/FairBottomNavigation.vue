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
import HomeIcon from '@/components/icons/HomeIcon.vue';
import StartIcon from '@/components/icons/StartIcon.vue';
import MapIcon from '@/components/icons/MapIcon.vue';
import ScheduleIcon from '@/components/icons/ScheduleIcon.vue';
import TicketsIcon from '@/components/icons/TicketsIcon.vue';



const fairTabs = ref([
  {
    path: '/',
    label: 'Start',
    icon: StartIcon
  },
  {
    path: '/fair',
    label: 'Home',
    icon: HomeIcon
  },
  {
    path: '/fair/map',
    label: 'Map',
    icon: MapIcon
  },
  {
    path: '/fair/schedule',
    label: 'Schedule',
    icon: ScheduleIcon
  },
  {
    path: '/fair/tickets',
    label: 'Tickets',
    icon: TicketsIcon
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
