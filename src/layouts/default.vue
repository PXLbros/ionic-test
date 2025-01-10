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
.main {
  font-family: 'Inter', sans-serif;

  &__header {
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    &-img {
      width: 100%;
      height: 20vh;
      background-color: #EFF2F6;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 24px;
    }

    &-content {
      display: flex;
      flex-direction: column;

      .title {
        font-size: 24px;
        font-weight: 700;
        line-height: 28px;
        letter-spacing: 0.5px;
        color: #343434;
      }

      .subtitle {
        font-size: 16px;
        font-weight: 500;
        line-height: 28px;
        letter-spacing: 0.5px;
        color: #343434;
        margin: 0px;
        width: 90%;
      }
    }
  }

  &__content {
    padding: 0 25px;
  }
}
</style>
