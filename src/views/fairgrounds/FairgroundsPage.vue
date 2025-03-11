<template>
  <ion-page id="main-content">
      <!-- Header Nav -->
      <FairgroundsNav />
      <FairgroundsBottomNavigation />

      <ion-content>
          <div class="main">
            <div class="main__header-title">
                <h1 id="fg-title">Upcoming Events</h1>
            </div>
                <EventCarousel :eventData="allEvents" />

              <!-- Updated grid section to match the design -->
              <div class="categories-section">
                  <!-- Events section with title outside -->
                  <h2 id="fg-h2" class="section-title">More Events</h2>
                  <router-link to="/fairgrounds/upcoming-events" class="category-link">
                      <div class="category-card events-card">
                          <img src="/public/Start_Screen_NYS.png" alt="Events" class="category-img" />
                      </div>
                  </router-link>

                  <div class="categories-row">
                      <div class="category-column">
                          <h2 id="fg-h2" class="section-title">Venues</h2>
                          <router-link to="/fairgrounds/venues" class="category-link">
                              <div class="category-card venues-card">
                                  <img src="/public/Start_Screen_NYS.png" alt="Venues" class="category-img" />
                              </div>
                          </router-link>
                      </div>

                      <div class="category-column">
                          <h2 id="fg-h2" class="section-title">Rental Opportunities</h2>
                          <router-link to="/fairgrounds/rental-opportunity" class="category-link">
                              <div class="category-card rental-card">
                                  <img src="/public/Start_Screen_NYS.png" alt="Rental Opportunities" class="category-img" />
                              </div>
                          </router-link>
                      </div>
                  </div>
              </div>

              <!-- Keep in touch section -->
              <div class="keep-in-touch">
                  <h2 class="touch-title">KEEP IN TOUCH</h2>
                  <div class="contact-form">
                      <label for="email">Email*</label>
                      <input type="email" id="email" placeholder="Enter your email..." />
                      <p class="disclaimer">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi, commodi odio</p>
                      <button class="fg-signup">Sign Up</button>
                  </div>
              </div>

              <SocialIcons type="fairgrounds" :social-data="dataStore.data.nysfairWebsite.social" />
          </div>
      </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
  import FairgroundsNav from '@/components/FairgroundsNav.vue';
  import { useDataStore } from '@/stores/data';
  import FairgroundsBottomNavigation from '@/components/tabs/FairgroundsBottomNavigation.vue';

  const dataStore = useDataStore();
  console.log('dataStore', dataStore.data);

  const featuredEvents = dataStore.data.nysfairgroundsWebsite.featuredEvents;

  // Combine featured events with other events to create a full list of events
  const allEvents = computed(() => {
    const featured = dataStore.data.nysfairgroundsWebsite.featuredEvents || [];
    const regularEvents = dataStore.data.nysfairgroundsWebsite.events || [];

    // If there are no featured events, just use the first 5 regular events
    if (!featured.length) {
      return regularEvents.slice(0, 5);
    }

    // Otherwise, use featured events and add regular events to get to 5 total
    const combined = [...featured];
    if (combined.length < 5) {
      const remainingNeeded = 5 - combined.length;
      // Add regular events that are not already in featured
      const regularNotFeatured = regularEvents.filter(
        (regEvent: { id: string }) => !featured.some((featEvent: any) => featEvent.id === regEvent.id)
      );
      combined.push(...regularNotFeatured.slice(0, remainingNeeded));
    }

    return combined;
  });
</script>

<style lang="scss" scoped>
.main {
    padding: 0px;
    padding-bottom: 70px;
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

    /* Keep in touch section styles */
    .keep-in-touch {
        background-color: #19262D;
        padding: 0px 20px 40px 20px;
        color: white;
        text-align: center;
    }

    .touch-title {
        font-family: 'pt-sans-bold', sans-serif;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 20px;
    }

    .contact-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 300px;
        margin: 0 auto;
    }

    .contact-form label {
        align-self: flex-start;
        margin-bottom: 5px;
        font-weight: 500;
    }

    .contact-form input {
        width: 100%;
        padding: 15px;
        border: none;
        border-radius: 4px;
        margin-bottom: 10px;
        background-color: #FFF;
        color: #000;
    }

    .disclaimer {
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        color: #ccc;
        margin: 0px;
        text-align: start;
    }

    .fg-signup {
        background-color: #FFD100;
        color: #000;
        padding: 20px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 60%;
        font-weight: 700;
        font-size: 14px;
        margin-top: 25px;
        align-self: start;
        text-transform: uppercase;
    }
}
</style>
