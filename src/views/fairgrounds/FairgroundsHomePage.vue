<template>
  <ion-page id="main-content">
    <BaseNav
      ref="hamburgerMenuBaseNav"
      type="fairgrounds"
      toolbarBackground="#19262D"
      menuBackground="#19262D"
      :logoSrc="fairgroundsLightLogo"
      logoAlt="Fairgrounds Logo"
      headerVisible
      relative
    />

    <FairgroundsBottomNavigation @tabClick="onBottomNavTabClick" />

    <ion-content>
      <div class="main">
        <template v-if="hasEvents">
          <div class="main__header-title">
            <h1 id="fg-title">Upcoming Events</h1>
          </div>

          <FairgroundsEventCarousel :eventData="allEvents" />
        </template>

        <!-- Updated grid section to match the design -->
        <div class="categories-section">
          <!-- Events section with title outside -->
          <h2 id="fg-h2" class="section-title">
            {{ hasEvents ? 'More Events' : 'Events' }}
          </h2>
          <router-link to="/fairgrounds/upcoming-events" class="category-link">
            <div class="category-card events-card">
              <img src="/Start_Screen_NYSFairgrounds.png" alt="Events" class="category-img" />
            </div>
          </router-link>

          <div class="categories-row">
            <div class="category-column">
              <h2 id="fg-h2" class="section-title">Venues</h2>
              <router-link to="/fairgrounds/venues" class="category-link">
                <div class="category-card venues-card">
                  <img src="/Start_Screen_NYSFairgrounds.png" alt="Venues" class="category-img" />
                </div>
              </router-link>
            </div>

            <div class="category-column">
              <h2 id="fg-h2" class="section-title">Rental Opportunities</h2>
              <router-link to="/fairgrounds/rental-opportunity" class="category-link">
                <div class="category-card rental-card">
                  <img src="/Start_Screen_NYSFairgrounds.png" alt="Rental Opportunities" class="category-img" />
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <FairgroundsKeepInTouchForm />

        <SocialIcons type="fairgrounds" :social-data="dataStore.data.nysfairWebsite.social" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { useDataStore } from '@/stores/data';
import FairgroundsBottomNavigation from '@/components/Tabs/FairgroundsBottomNavigation.vue';
import FairgroundsKeepInTouchForm from '@/components/FairgroundsKeepInTouchForm.vue';
import FairgroundsEventCarousel from '@/components/FairgroundsEventCarousel.vue';
import appConfig from '@/config/app';
import fairgroundsLightLogo from '@/imgs/svg/fg-light.svg'
import BaseNav from '@/components/BaseNav.vue';
import { useLogger } from '@/composables/useLogger';
import { FairgroundsEvent } from '@/types';

const dataStore = useDataStore();
const logger = useLogger();

const hamburgerMenuBaseNav = ref<InstanceType<typeof BaseNav> | null>(null);

const allEvents = computed(() => {
  const featured = dataStore.data.nysfairgroundsWebsite.featuredEvents || [];
  const regularEvents = dataStore.data.nysfairgroundsWebsite.events || [];

  const filterUpcomingEvents = (events: FairgroundsEvent[]) =>
    events.filter((event) => event.dates?.some((date) => date.is_upcoming));

  const filteredRegularEvents = filterUpcomingEvents(regularEvents);

  if (!featured.length) {
    return filteredRegularEvents.slice(0, 5);
  }

  const combined = [...featured];
  const remainingNeeded = 5 - combined.length;

  if (remainingNeeded > 0) {
    const regularNotFeatured = filteredRegularEvents.filter(
      (regEvent) => !featured.some((featEvent: any) => featEvent.id === regEvent.id)
    );

    combined.push(...regularNotFeatured.slice(0, remainingNeeded));
  }

  return combined;
});

const onBottomNavTabClick = ({ id }: { id: string }) => {
  switch (id) {
    case 'hamburgerMenu': {
      // Open the hamburger menu
      if (hamburgerMenuBaseNav.value) {
        hamburgerMenuBaseNav.value.openMenu();
      } else {
        logger.warn('hamburgerMenuBaseNav is not ready or missing');
      }

      break;
    }
    default: {
      logger.warn('Unknown tab clicked', {
        ID: id,
      });

      break;
    }
  }
};

const hasEvents = computed(() => {
  return allEvents.value?.length > 0;
});
</script>

<style lang="scss" scoped>
.main {
    padding: 0px;
    padding-bottom: v-bind('appConfig.bottomBar.height');
    background-color: #19262D;

    &__header {
        display: flex;
        flex-direction: column;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        margin-bottom: 0px;

        &-card {
            background-color: #EFF2F6;
            height: 36vh;
            width: 100%;
            aspect-ratio: 1/1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;

            .image-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                padding: 0;

                .event-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                }

                .placeholder-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .event-info {
                    text-align: center;
                }
            }
          }

          .image-banner {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 3px;
            background-color: #ecedef;
            padding: 30px 0px;

            .date {
              color: #0077C8;
              font-size: 16px;
              font-weight: 700;
              margin: 0px;
            }
            .title {
              color: #343434;
              margin: 0px;
              font-size: 18px;
              font-weight: 700;
              font-family: 'inter', sans-serif;
            }
          }

        &-title {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #19262D;
            padding: 15px;

            h1 {
                font-size: 28px;
                font-weight: 300;
                text-transform: uppercase;
                color: #fff;
                margin: 0;
                letter-spacing: 0.5px;
            }
        }
    }

    /* New styles for the updated grid layout */
    .categories-section {
        padding: 20px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        background-color: #FFF;
    }

    .section-title {
        font-size: 20px;
        font-weight: 700;
        color: #333;
        margin: 0 0 0px 0;
        padding: 0;
        white-space: nowrap;
    }

    .category-card {
        background-color: #EFF2F6;
        border-radius: 0px;
        width: 100%;
        overflow: hidden;
        position: relative;
        margin-bottom: 20px;
    }

    .events-card {
      height: 27vh;
    }

    .venues-card, .rental-card {
      height: 27vh;
    }

    .category-link {
        display: block;
        width: 100%;
        text-decoration: none;
        color: inherit;
    }

    .category-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        border-radius: 3px;
    }

    .categories-row {
        display: flex;
        gap: 10px;
    }

    .category-column {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .venues-card, .rental-card {
        height: 27vh;
    }

}
</style>
