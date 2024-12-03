<!-- components/fairgrounds/FairgroundsNavMenu.vue -->
<template>
    <BaseNavMenu
      type="fairgrounds"
      toolbarBackground="#ffffff"
      menuBackground="linear-gradient(180deg, #ffffff 0%, #ffffff 100%)"
      :logoSrc="fairgroundsLogo"
      logoAlt="Fairgrounds Logo"
    />
  </template>
  
  <script setup lang="ts">
  import BaseNavMenu from './BaseNav.vue';
  import fairgroundsLogo from '@/imgs/svg/fairgrounds-dark.svg';
  </script>