<template>
  <div class="loader">
    Loading...
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  color: #000;
  z-index: 99999;
}
</style>
