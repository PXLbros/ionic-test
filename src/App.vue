<template>
  <ion-app>
    <Loader v-if="dataStore.isInitiallyLoading" />

    <div v-if="dataStore.loadError" class="load-error">
      {{ dataStore.loadError }}
    </div>

    <ion-router-outlet
      v-if="!dataStore.isInitiallyLoading && !dataStore.loadError && dataStore.data"
      ref="routerOutlet"
    />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { fetchData } from '@/services/api';
import Loader from '@/components/Loader.vue';
import { useLogger } from '@/composables/useLogger';

const dataStore = useDataStore();
const logger = useLogger();

const routerOutlet = ref<InstanceType<typeof IonRouterOutlet> | null>(null);
const router = useRouter();

const swipeDisabledRoutes = ['/fair/map'];

onMounted(async () => {
  await fetchData();
});

// Store the original swipeHandler to restore it later
let originalSwipeHandler: any = null;

watch(
  () => router.currentRoute.value.fullPath,
  (path) => {
    const outletElement = routerOutlet.value?.$el as HTMLIonRouterOutletElement;

    if (!outletElement) {
      return;
    }

    if (swipeDisabledRoutes.includes(path)) {
      if (!originalSwipeHandler && outletElement.swipeHandler) {
        originalSwipeHandler = outletElement.swipeHandler;
      }

      outletElement.swipeHandler = undefined;

      logger.info('Disabled swiping');
    } else {
      if (originalSwipeHandler) {
        outletElement.swipeHandler = originalSwipeHandler;

        logger.info('Enabled swiping');
      }
    }
  },
  { immediate: true },
);
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
