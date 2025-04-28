<template>
  <FairgroundsLayout
    title="Venue Details"
    :showMenuButton="true"
  >
    <div v-if="venue" class="main">
      <div class="main__image">
        <PlaceholderIcon />
      </div>

      <p v-if="venue.venuePreheader" class="main__category">
        {{ venue.venuePreheader}}
      </p>

      <h1 class="main__title">
        {{ venue.title }}
      </h1>

      <div class="main__description">
        <div class="main__description-text" v-html="formattedDescription"></div>

        <div class="main__description-buttons">
          <div class="main__description-button">
            <a :href="inquireNowUrl" target="_blank">Inquire Now</a>
          </div>
          <div v-if="specSheetPdf" class="main__description-button">
            <a :href="specSheetPdf.url" target="_blank">Download PDF</a>
          </div>
        </div>
      </div>

      <div class="main__specifications" v-if="specificationGroups && specificationGroups.length > 0">
        <h2 class="main__subtitle">Specifications</h2>

        <div v-for="specificationGroup in specificationGroups" class="spec-group">
          <h3 class="spec-label">{{ specificationGroup.specTitle }}</h3>
          <p class="spec-value">{{ specificationGroup.specValue }}</p>
        </div>
      </div>

      <ImageCarousel
        v-if="venue.venueImageGallery && venue.venueImageGallery.length > 0"
        :imageData="venue.venueImageGallery"
      />

      <div v-if="venue.venueFloorPlanFeatures || floorPlanImage" class="main__floor-plan">
        <h2 class="main__subtitle">Floor Plan</h2>

        <div v-if="formattedFloorPlanFeatures" v-html="formattedFloorPlanFeatures" class="main__floor-plan-features"></div>

        <a v-if="floorPlanPdf" :href="floorPlanPdf.url" target="_blank">
          View Floor Plan
        </a>
      </div>
    </div>

    <div class="wrapper">
      <FairgroundsKeepInTouchForm />
    </div>
  </FairgroundsLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import FairgroundsLayout from '@/layouts/fairgrounds.vue';
import { useDataStore } from '@/stores/data';
import PlaceholderIcon from '@/components/Icons/PlaceholderIcon.vue';
import FairgroundsKeepInTouchForm from '@/components/Fairgrounds/KeepInTouchForm.vue';
import appConfig from '@/config/app';
import { FairgroundsVenue } from '@/types';

const route = useRoute();
const dataStore = useDataStore();
const venueId = decodeURIComponent(route.params.id as string);

// Get the specific venue
const venue = computed<FairgroundsVenue | undefined>(() => {
  return dataStore.data.nysfairgroundsWebsite.venues.find(
    (venue: FairgroundsVenue) => venue.id === venueId
  );
});

const specificationGroups = computed(() => {
  return venue.value?.venueSpecifications || [];
});

const inquireNowUrl = computed(() => {
  let url = import.meta.env.VITE_NYSFAIRGROUNDS_BASE_URL;

  url += `/contact?venue=${venueId}`;

  return url;
});

const specSheetPdf = computed(() => {
  return venue.value?.venueSpecSheet?.[0] || null;
});

const formattedDescription = computed(() => {
  return venue.value?.venueDetailBody || 'No description available';
});

const floorPlanImage = computed(() => {
  return venue.value?.venueFloorPlanImage?.[0] || null;
});

const floorPlanPdf = computed(() => {
  return venue.value?.venueFloorPlanPdf?.[0] || null;
});

const formattedFloorPlanFeatures = computed(() => {
  return venue.value?.venueFloorPlanFeatures || null;
});
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
  background-color: #EBEDEF;

  &__category {
    color: #0077C8;
    margin: 0px;
    margin-bottom: 5px;
    font-weight: 600;
    font-family: 'inter', sans-serif;
    font-size: 14px;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
    color: #343434;
    margin: 0 0 16px 0;
    line-height: 28px;
    letter-spacing: 0.5px;
    font-family: 'inter', sans-serif;
  }

  &__image {
    background-color: #EFF2F6;
    border-radius: 5px;
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

.wrapper {
  padding-bottom: v-bind('appConfig.bottomBar.height');
}

:deep(ion-content) {
  --background: white;
}

.image-carousel {
  margin-top: 1rem;
}
</style>

<style lang="scss">
.main__floor-plan {
  ul {
    list-style-position: inside;
    padding: 0;
  }
}
</style>
