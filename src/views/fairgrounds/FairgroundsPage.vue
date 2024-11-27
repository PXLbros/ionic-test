    <template>
        <ion-page id="main-content">
            <!-- Header Nav -->
            <FairgroundsNav />

            <ion-content>
                <div class="main">
                        <div class="main__header">
                            <div v-if="featuredEvents && featuredEvents.length" 
                                    v-for="event in featuredEvents" 
                                    :key="event.id" 
                                    class="main__header-card"
                                >
                                <div class="image-container">
                                    <img 
                                        v-if="event.eventImage && event.eventImage.length" 
                                        :src="event.eventImage[0].url" 
                                        :alt="event.eventImage[0].title"
                                        class="event-image"
                                    />
                                    <div v-else class="placeholder-image">
                                        <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                                        </svg>
                                    </div>
                                    <div class="event-info">
                                        <h3>{{ event.title }}</h3>
                                        <p v-if="event.eventAdmission">{{ event.eventAdmission }}</p>
                                    </div>
                                </div>
                            </div>
                        <div class="main__header-title">
                            <h1>Featured Events</h1>
                        </div>
                    </div>
                    <div class="main__grid">
                        <router-link to="/fairgrounds/upcoming-events" class="main__grid-top">
                            Events
                        </router-link>
                        <div class="main__grid-bottom">
                            <router-link to="/fairgrounds/venues" class="card">Venues</router-link>
                            <router-link to="/fairgrounds/rental-opportunity" class="card">Rental Opportunities</router-link>
                        </div>
                    </div>
                </div>
            </ion-content>
        </ion-page>

    </template>

    <script setup lang="ts">
        import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
        import FairgroundsNav from '@/components/FairgroundsNav.vue';
        import { useDataStore } from '@/stores/data';

        const dataStore = useDataStore();
        console.log('dataStore', dataStore.data);

        const featuredEvents = dataStore.data.nysfairgroundsWebsite.featuredEvents;
        
    </script>

    <style lang="scss" scoped>

    .main {
        padding: 30px;

        &__header {
            display: flex;
            flex-direction: column;
            gap: 10px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            margin-bottom: 10px;

            &-card {
                background-color: #EFF2F6;
                height: 36vh;
                width: 100%;
                aspect-ratio: 1/1;
                border-radius: 24px;
                display: flex;
                align-items: center;
                justify-content: center;

                .image-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    padding: 20px;

                    .event-info {
                        text-align: center;
                    }
                }
            }

            &-title {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                h1 {
                    font-size: 16px;
                    font-weight: 600;
                    color: #343434;
                    margin: 0;
                    line-height: 40px;
                    letter-spacing: 0.5px;
                }
            }
        }

        .main__grid {
            width: 100%;
            display: flex;
            flex-direction: column;

            &-top {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #EFF2F6;
                border-radius: 24px;
                height: 133px;
                text-decoration: none;
                font-size: 16px;
                font-weight: 700;
                color: #343434;
                margin: 0;
                line-height: 40px;
                letter-spacing: 0.5px;
            }

            &-bottom {
                width: 100%;
                display: flex;
                gap: 10px;
                margin-top: 10px;

                .card {
                    background-color: #EFF2F6;
                    border-radius: 24px;
                    height: 25vh;
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 16px;
                    font-weight: 700;
                    color: #343434;
                    margin: 0;
                    letter-spacing: 0.5px;
                    padding: 10px;
                    text-align: center;
                    text-decoration: none;
                }
            }
        }
    }

    </style>