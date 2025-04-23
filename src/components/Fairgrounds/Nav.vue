<!-- components/fairgrounds/FairgroundsNavMenu.vue -->
<template>
  <BaseNav
    type="fairgrounds"
    toolbarBackground="#19262D"
    menuBackground="#19262D"
    :logoSrc="fairgroundsLightLogo"
    logoAlt="Fairgrounds Logo"
    headerVisible
    :title="props.title"
    :relative="props.relative"
  />
  </template>

  <script setup lang="ts">
  import BaseNav from '@/components/BaseNav.vue';
  import fairgroundsLightLogo from '@/imgs/svg/fg-light.svg'

  const props = withDefaults(defineProps<{
    title?: string;
    relative?: boolean;
  }>(), {
    title: '',
    relative: false,
  });
  </script>
