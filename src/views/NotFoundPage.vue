<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="not-found-page">
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <router-link to="/">Go Home</router-link>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonPage, IonContent } from '@ionic/vue';
</script>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FDD456;
}
</style>
