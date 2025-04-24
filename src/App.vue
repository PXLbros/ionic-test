<template>
  <ion-app>
    <Loader
      v-if="dataStore.isInitiallyLoading || dataStore.isLoading || (isSubLoaderRoute && appStore.subLoader.isActive)"
      :text="subLoaderMessage"
    />

    <div v-if="dataStore.loadError" class="load-error-container">
      <IconsLogo />

      <h1 class="load-error-title">
        Error
      </h1>

      <p class="load-error-message">
        {{ dataStore.loadError }}
      </p>

      <button class="btn btn--small btn--load-more" @click="fetchData">
        {{ retryButtonText }}
      </button>
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
import IconsLogo from '@/components/Icons/Logo.vue';

const appStore = useAppStore();
const dataStore = useDataStore();
const logger = useLogger();

const routerOutlet = ref<InstanceType<typeof IonRouterOutlet> | null>(null);
const router = useRouter();

const swipeDisabledRoutes = ['/fair/map'];
let originalSwipeHandler: any = null;

const retryButtonText = computed(() => {
  return dataStore.isLoading ? 'Retrying...' : 'Retry';
});

onMounted(async () => {
  await fetchData();
});

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

const subLoaderMessage = computed(() => appStore.subLoader.message);

const isSubLoaderRoute = computed(() => {
  return router.currentRoute.value.meta?.subLoader === true;
});

if (isSubLoaderRoute.value === true) {
  logger.debug('Activated sub loader');

  appStore.subLoader.isActive = true;
}
</script>

<style lang="scss" scoped>
.load-error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: appColor(nysfair, yellow, medium);
  color: appColor(nysfair, black, default);
  z-index: 99999;

  .load-error-title {
    font-size: 2.75rem;
    margin-bottom: 0;
  }

  .btn--load-more {
    margin-top: 0.5rem;
  }
}
</style>
