<template>
  <ion-app>
    <Loader v-if="dataStore.isLoading" />

    <div v-if="dataStore.loadError" class="load-error">
      {{ dataStore.loadError }}
    </div>

    <ion-router-outlet v-if="!dataStore.isLoading && !dataStore.loadError && dataStore.data" swipeGesture="false" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { fetchData } from '@/services/api';
import Loader from '@/components/Loader.vue';

const dataStore = useDataStore();

onMounted(async () => {
  await fetchData();
});
</script>

<style lang="scss" scoped>
.load-error {
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
