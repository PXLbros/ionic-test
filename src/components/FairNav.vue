<!-- components/fair/FairNavMenu.vue -->
<template>
    <BaseNavMenu
      type="fair"
      toolbarBackground="#530D8C"
      menuBackground="linear-gradient(180deg, #ffffff 0%, #ffffff 100%)"
      :logoSrc="fairLogo"
      logoAlt="NYSF Logo"
    />
  </template>
  
  <script setup lang="ts">
  import BaseNavMenu from './BaseNav.vue';
  import fairLogo from '@/imgs/svg/fair-logo-light.svg';
  </script> 

  <style scoped lang="scss">

  
</style>