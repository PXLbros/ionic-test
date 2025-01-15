<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="props.backButtonHref"></ion-back-button>
        </ion-buttons>

        <ion-title>
          {{ title }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <slot />
    </ion-content>

    <ion-toast
      :isOpen="appStore.toast.isOpen"
      :message="appStore.toast.message"
      :duration="appStore.toast.duration"
      position="bottom"
      @didDismiss="appStore.closeToast()"
    />
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonToast } from '@ionic/vue';

const props = withDefaults(defineProps<{
  title: string;
  backButtonHref?: string;
}>(), {
  backButtonHref: '/fair'
});

const appStore = useAppStore();
</script>

<style lang="scss">

</style>
