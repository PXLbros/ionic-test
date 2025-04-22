<template>
  <FairgroundsLayout title="Venues" :showMenuButton="true">
    <div class="main">
      <div class="main__header">
        <img src="/Host_Event.png" alt="Venues" class="main__header-image" />
        <div class="title">Host an Event</div>
        <div class="description">If you're considering hosting an event, you'll want to first review the different
          spaces we can offer your organization.</div>
      </div>
      <div class="main__venue">
        <div v-for="venue in venues" :key="venue.id" class="main__venue-card" :class="{ 'no-image': !hasImage(venue) }">
          <!-- Only show image if venueMainImage exists -->
          <img v-if="hasImage(venue)" class="image" :src="venue.venueMainImage || ''" alt="venue image">
          <div class="content">
            <div class="content__label">{{ venue.venuePreheader || 'Venue' }}</div>
            <div class="content__title">{{ venue.title }}</div>
            <div v-if="venue.venueDetailBody" v-html="stripHTML(venue.venueDetailBody?.slice(0, 75) + '...')"
              class="content__description">
            </div>
            <div v-else class="content__description">
              No Description Available
            </div>
          </div>
          <router-link :to="`/fairgrounds/venues/${encodeURIComponent(venue.id)}`" class="cta">Learn More</router-link>
        </div>
      </div>
    </div>
  </FairgroundsLayout>
</template>

<script setup lang="ts">
import FairgroundsLayout from '@/layouts/fairgrounds.vue';
import type { FairgroundsVenue } from '@/types';

const dataStore = useDataStore();
const venues = ref<FairgroundsVenue[]>(dataStore.data.nysfairgroundsWebsite.venues);

const hasImage = (venue: FairgroundsVenue): boolean => {
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
    &__header {
        padding: 20px;
        padding-bottom: 30px;
        background-color: #EBEDEF;

        &-image {
            border-radius: 5px;
            margin-bottom: 5px;
        }

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
        padding: 0px 20px 95px 20px;

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
                border-radius: 5px;
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
                border: 1px solid #0077C8;
                background-color: #0077C8;
                border-radius: 5px;
                width: fit-content;
                padding: 15px 30px;
                text-decoration: none;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                color: #F1F1F1;
                font-weight: 700;
                text-transform: uppercase;
            }
        }
    }
}
</style>
