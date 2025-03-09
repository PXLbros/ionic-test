<template>
  <div :class="['social-media', `social-media--${type}`]">
    <h2 class="social-media__text">Follow Us</h2>
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
  type: 'fair' | 'fairgrounds';
}>(), {
  socialData: () => ({
    facebook: null,
    instagram: null,
    twitter: null,
    tiktok: null,
  }),
  type: 'fair'
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
// Socials
.social-media {
  display: flex;
  flex-direction: column;
  padding: 35px 0px 20px 0px;
  justify-content: center;
  align-items: center;
  background-color: #1F3667; // Fair background default
  gap: 5px;

  &__text {
    margin: 0;
    color: #FDD252; // Fair text color default
    font-size: 22px;
    font-family: 'inter', sans-serif;
    font-weight: 900;
    text-transform: uppercase;
  }

  .social-icons {
    display: flex;
    justify-content: center;
    padding: 0px;
    gap: 25px; // Add some spacing between icons

    .social-icon {
      --padding-start: 0;
      --padding-end: 0;
      height: auto;

      ion-icon {
        font-size: 24px; // Adjust size as needed
        color: #FFF1AF; // Fair icon color default
        width: 10vw;
        height: 7vh;
      }
    }
  }

  // Fairgrounds-specific styles
  &--fairgrounds {
    background-color: #EBEBEB;

    .social-media__text {
      color: #19262D;
    }

    .social-icons .social-icon ion-icon {
      color: #19262D;
    }
  }
}
</style>
