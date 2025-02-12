<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="props.backButtonHref"></ion-back-button>
        </ion-buttons>

        <div class="header-container">
          <ion-title>{{ title }}</ion-title>
        </div>
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

<style scoped lang="scss">

ion-toolbar {
  --background: #098944;
  color: #F4E8AB;
  text-transform: uppercase;

  // Center the title container
  .header-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none; // Allows clicking the back button
  }

  ion-title {
    position: relative;
    text-align: center;
    font-size: 24px;
    margin-top: 3px;
    padding: 0;
    width: auto;
    font-family: 'lalezar', sans-serif;
    font-weight: 800;
  }
}

ion-back-button {
  color: #FDD252;
  position: relative; // Ensures it stays above the centered title
  z-index: 1;
}



</style>
