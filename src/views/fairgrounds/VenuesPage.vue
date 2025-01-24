<template>
    <ion-page>
      <ion-header>
        <ion-toolbar :translucent="true">
          <ion-buttons slot="start">
            <ion-back-button default-href="/fairgrounds"></ion-back-button>
          </ion-buttons>
          <ion-title>Venues</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <div class="main">
             <div class="main__header">
                 <div class="title">Host an Event</div>
                 <div class="description">If you're considering hosting an event, you'll want to first review the different spaces we can offer your organization.</div>
             </div>
             <div class="main__venue">
                 <div
                     v-for="venue in venues"
                     :key="venue.id"
                     class="main__venue-card"
                     :class="{ 'no-image': !hasImage(venue) }"
                 >
                     <!-- Only show image if venueMainImage exists -->
                     <img
                         v-if="hasImage(venue)"
                         class="image"
                         :src="venue.venueMainImage || ''"
                         alt="venue image"
                     >
                     <div class="content">
                         <div class="content__label">{{ venue.venuePreheader || 'Venue' }}</div>
                         <div class="content__title">{{ venue.title }}</div>
                         <div v-if="venue.venueDetailBody" v-html="stripHTML(venue.venueDetailBody?.slice(0, 75) + '...')" class="content__description">
                         </div>
                         <div v-else class="content__description">
                              No Description Available
                         </div>
                     </div>
                     <router-link :to="`/fairgrounds/venues/${encodeURIComponent(venue.id)}`" class="cta">Learn More</router-link>
                 </div>
             </div>
        </div>
     </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { useDataStore } from '@/stores/data';

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
  venueMainImage: string | null;
  venuePreheader: string | null;
}

const dataStore = useDataStore();
const venues = ref<Venue[]>(dataStore.data.nysfairgroundsWebsite.venues);

console.log('venues', venues.value);

const hasImage = (venue: Venue): boolean => {
    return Array.isArray(venue.venueMainImage) && venue.venueMainImage.length > 0;
};

const stripHTML = (html: string): string => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};

</script>

<style lang="scss" scoped>

.main {
    padding: 30px;

    &__header {
        margin-bottom: 30px;

        .title {
            color: #343434;
            font-size: 24px;
            font-style: normal;
            font-weight: 600;
            line-height: 28px;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .description {
            color: #343434;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            letter-spacing: 0.5px;
        }
    }

    &__venue {
        display: flex;
        flex-direction: column;
        gap: 0px;

        &-card {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 15px 0px;
            border-bottom: 1px solid #EFF2F6;

            img {
                width: 100%;
                height: 25vh;
                object-fit: cover;
                border-radius: 24px;
            }

            .content {
                display: flex;
                flex-direction: column;

                &__label {
                    color: #343434;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 24px;
                    letter-spacing: 0.5px;
                    text-transform: capitalize;
                }

                &__title {
                    color: #343434;
                    font-size: 20px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 28px;
                    letter-spacing: 0.5px;
                }

                &__description {
                    color: #343434;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 28px;
                    letter-spacing: 0.5px;
                    margin-bottom: 10px;
                    text-transform: capitalize;
                }
            }

            .cta {
                border: 1px solid #486284;
                border-radius: 50px;
                width: fit-content;
                padding: 12px 20px;
                text-decoration: none;
                color: #486284;
                font-weight: 700;
            }
        }
    }
}

</style>
