<template>
    <ion-page>
        <ion-content>
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-back-button default-href="/fairgrounds/venues"></ion-back-button>
                    </ion-buttons>
                    <ion-title>Venue Detail</ion-title>
                </ion-toolbar>
            </ion-header>

           <div v-if="venue" class="main">
                <h1 class="main__title">{{ venue.title }}</h1>

                <div class="main__image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                        <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                    </svg>
                </div>

                <div class="main__description">
                  <div class="main__description" v-html="sanitizedDescription"></div>
                </div>

                <div class="main__specifications">
                    <h2 class="main__subtitle">Specifications</h2>

                    <div class="spec-group">
                        <h3 class="spec-label">Size</h3>
                        <p class="spec-value">15,946 square feet</p>
                    </div>

                    <div class="spec-group">
                        <h3 class="spec-label">Restrooms</h3>
                        <p class="spec-value">2 public</p>
                    </div>

                    <div class="spec-group">
                        <h3 class="spec-label">Electoral</h3>
                        <p class="spec-value">110/208 non-commercial</p>
                    </div>
                </div>
           </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { useRoute } from 'vue-router';
import { useDataStore } from '@/stores/data';
import { computed } from 'vue';

interface Venue {
    id: string;
    title: string;
    slug: string;
    url: string;
    dateCreated: string;
    dateUpdated: string;
    venueDetailBody: string | null;
    venueDetailHeadline: string | null;
    venueDetailPreheader: string | null;
    venueNavTitle: string | null;
    venueSubheader: string | null;
}

const route = useRoute();
const dataStore = useDataStore();
const venueId = decodeURIComponent(route.params.id as string);

// Get the specific venue
const venue = computed<Venue | undefined>(() => {
    return dataStore.data.nysfairgroundsWebsite.venues.find(
        (venue: Venue) => venue.id === venueId
    );
});

// Sanitize the description to allow HTML
const sanitizedDescription = computed(() => {
    return venue.value?.venueDetailBody || 'No description available';
});
</script>

<style lang="scss" scoped>
.main {
    padding: 30px;

    &__title {
        font-size: 24px;
        font-weight: 600;
        color: #343434;
        margin: 0 0 16px 0;
        line-height: 28px;
        letter-spacing: 0.5px;
    }

    &__image {
        background-color: #EFF2F6;
        border-radius: 24px;
        height: 25vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
    }

    &__description {
      font-size: 16px;
      line-height: 28px;
      letter-spacing: 0.5px;
      color: #343434;
      margin-bottom: 30px;
      font-weight: 400;

      :deep(a) {
          color: #1E5EAE;
          text-decoration: none;

          &:hover {
              text-decoration: underline;
          }
      }

      :deep(ul) {
          list-style-type: disc;
          padding-left: 20px;
          margin: 16px 0;
      }

      :deep(li) {
          margin-bottom: 8px;
      }

      :deep(p) {
          margin: 16px 0;

          &:first-child {
              margin-top: 0;
          }

          &:last-child {
              margin-bottom: 0;
          }
      }
  }

    &__specifications {
        margin-top: 15px;
    }

    &__subtitle {
        font-size: 20px;
        font-weight: 700;
        color: #343434;
        margin: 0 0 24px 0;
        line-height: 24px;
        letter-spacing: 0.5px;
    }
}

.spec-group {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }

    .spec-label {
        font-size: 14px;
        font-weight: 600;
        color: #343434;
        margin: 0 0 4px 0;
        line-height: 24px;
        letter-spacing: 0.5px;
    }

    .spec-value {
        font-size: 16px;
        font-weight: 400;
        color: #343434;
        margin: 0;
        line-height: 24px;
        letter-spacing: 0.5px;
    }
}

:deep(ion-content) {
    --background: white;
}
</style>
