<!-- components/fairgrounds/FairgroundsNavMenu.vue -->
<template>
    <BaseNavMenu
      type="fairgrounds"
      toolbarBackground="#2B4C7E"
      menuBackground="linear-gradient(180deg, #2B4C7E 0%, #1A3050 100%)"
      :logoSrc="fairgroundsLogo"
      logoAlt="Fairgrounds Logo"
    />
  </template>
  
  <script setup lang="ts">
  import BaseNavMenu from './BaseNav.vue';
  import fairgroundsLogo from '@/imgs/svg/fairgrounds-dark.svg';
  </script>