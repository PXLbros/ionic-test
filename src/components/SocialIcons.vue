<template>
  <div class="social-icons">
    <ion-button
      fill="clear"
      v-if="props.socialData.instagram"
      @click="openSocialLink(props.socialData.instagram)"
      class="social-icon"
    >
      <ion-icon :icon="logoInstagram" size="large"></ion-icon>
    </ion-button>
    <ion-button
      fill="clear"
      v-if="props.socialData.facebook"
      @click="openSocialLink(props.socialData.facebook)"
      class="social-icon"
    >
      <ion-icon :icon="logoFacebook" size="large"></ion-icon>
    </ion-button>
    <ion-button
      fill="clear"
      v-if="props.socialData.twitter"
      @click="openSocialLink(props.socialData.twitter)"
      class="social-icon"
    >
      <ion-icon :icon="logoX" size="large"></ion-icon>
    </ion-button>
    <ion-button
      fill="clear"
      v-if="props.socialData.tiktok"
      @click="openSocialLink(props.socialData.tiktok)"
      class="social-icon"
    >
      <ion-icon :icon="logoTiktok" size="large"></ion-icon>
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { logoFacebook, logoInstagram, logoTiktok, logoX } from 'ionicons/icons';
import { IonButton, IonIcon } from '@ionic/vue';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

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

const openSocialLink = async (url: string | null) => {
  if (!url || !url.startsWith('http')) {
    console.error('Invalid URL provided');
    return;
  }

  try {
    if (Capacitor.isNativePlatform()) {
      await Browser.open({
        url,
        presentationStyle: 'fullscreen',
        toolbarColor: '#333333'
      });
    } else {
      // For web browser testing
      window.open(url, '_blank');
    }
  } catch (error) {
    console.error('Failed to open social link:', error);
  }
};
</script>

<style lang="scss" scoped>
.social-icons {
  display: flex;
  justify-content: center;
  padding: 20px;
  gap: 12px; // Add some spacing between icons

  .social-icon {
    --padding-start: 0;
    --padding-end: 0;
    height: auto;

    ion-icon {
      font-size: 24px; // Adjust size as needed
      color: #333333; // Adjust color as needed
    }
  }
}
</style>
