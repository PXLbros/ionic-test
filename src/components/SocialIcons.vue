<template>
  <div class="social-icons">
    <a v-if="props.socialData.instagram" :href="props.socialData.instagram" class="social-icon">
      <ion-icon :icon="logoInstagram" size="large"></ion-icon>
    </a>
    <a v-if="props.socialData.facebook" :href="props.socialData.facebook" class="social-icon">
      <ion-icon :icon="logoFacebook" size="large"></ion-icon>
    </a>
    <a v-if="props.socialData.twitter" :href="props.socialData.twitter" class="social-icon">
      <ion-icon :icon="logoX" size="large"></ion-icon>
    </a>
    <a v-if="props.socialData.tiktok" :href="props.socialData.tiktok" class="social-icon">
      <ion-icon :icon="logoTiktok" size="large"></ion-icon>
    </a>
  </div>
</template>

<script setup lang="ts">
import { logoFacebook, logoInstagram, logoTiktok, logoX } from 'ionicons/icons';

const props = withDefaults(defineProps<{
  socialData: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    tiktok: string | null;
  };
}>(), {
  socialData: () => ({
    facebook: null,
    instagram: null,
    twitter: null,
    tiktok: null,
  }),
});
</script>

<style lang="scss" scoped>
.social-icons {
  display: flex;
  justify-content: center;
  padding: 20px;
}
</style>
