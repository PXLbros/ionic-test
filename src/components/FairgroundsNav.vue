<!-- components/fairgrounds/FairgroundsNavMenu.vue -->
<template>
    <BaseNavMenu
      type="fairgrounds"
      toolbarBackground="#19262D"
      menuBackground="#19262D"
      :logoSrc="fairgroundsLightLogo"
      logoAlt="Fairgrounds Logo"
    />
  </template>

  <script setup lang="ts">
  import BaseNavMenu from './BaseNav.vue';
  import fairgroundsLogo from '@/imgs/svg/fairgrounds-dark.svg';
  import fairgroundsLightLogo from '@/imgs/svg/fg-light.svg'
  </script>
