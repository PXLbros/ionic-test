<!-- components/fairgrounds/FairgroundsNavMenu.vue -->
<template>
    <BaseNavMenu
      type="fairgrounds"
      toolbarBackground="#19262D"
      menuBackground="#19262D"
      :logoSrc="fairgroundsLogo"
      logoAlt="Fairgrounds Logo"
    />
  </template>

  <script setup lang="ts">
  import BaseNavMenu from './BaseNav.vue';
  import fairgroundsLogo from '@/imgs/svg/fairgrounds-dark.svg';
  </script>
