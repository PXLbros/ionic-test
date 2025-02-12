<!-- components/fairgrounds/FairgroundsNavMenu.vue -->
<template>
    <BaseNavMenu
      type="fairgrounds"
      toolbarBackground="#0077c8"
      menuBackground="linear-gradient(180deg, #0077c8 0%, #0077c8 100%)"
      :logoSrc="fairgroundsLogo"
      logoAlt="Fairgrounds Logo"
    />
  </template>

  <script setup lang="ts">
  import BaseNavMenu from './BaseNav.vue';
  import fairgroundsLogo from '@/imgs/svg/fairgrounds-dark.svg';
  </script>
