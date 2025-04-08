<template>
  <BaseNavMenu
    type="fair"
    toolbarBackground="#098944"
    menuBackground="linear-gradient(180deg, #098944 0%, #098944 100%)"
    :logoSrc="fairLogo"
    logoAlt="NYSF Logo"
  />
</template>

<script setup lang="ts">
import BaseNavMenu from './BaseNav.vue';
import fairLogo from '@/imgs/svg/fair-logo-light.svg';
</script>
