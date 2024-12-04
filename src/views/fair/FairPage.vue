<template>
    
    <ion-page id="main-content" >
        <!-- Header Nav -->
        
        <!-- Main Content -->
        <FairNav />
        <ion-content :fullscreen="true">
            <div class="main">
                <div class="main-logo">
                    <img src="/src/imgs/svg/fair-main-logo.svg" alt="NYSF Logo">
                </div>
                <ion-grid>
                    <ion-row>
                        <ion-col router-link="/fair/tickets">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg> 
                                <h2 class="main-button__text">Buy Tickets</h2>
                            </div>
                        </ion-col>
                        <ion-col router-link="/fair/map">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg> 
                                <h2 class="main-button__text">Fair Finder Map</h2>
                            </div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col router-link="/fair/schedule">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg> 
                                <h2 class="main-button__text">Daily Schedule</h2>
                            </div>
                        </ion-col>
                        <ion-col router-link="/fair/music">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg>  
                                <h2 class="main-button__text">Chevrolet Music Series</h2>
                            </div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col router-link="/fair/updates">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg>  
                                <h2 class="main-button__text">Real-Time Updates</h2>
                            </div>
                        </ion-col>
                        <ion-col router-link="/fair/games">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg>  
                                <h2 class="main-button__text">Games</h2>
                            </div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col router-link="/fair/plan-your-visit">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg>                                    
                                <h2 class="main-button__text">Plan Your Visit</h2>
                            </div>
                        </ion-col>
                        <ion-col router-link="/fair/news">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg>  
                                <h2 class="main-button__text">News</h2>
                            </div>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
            <div class="section">
                <div class="section-header">
                    <h2 class="section-header__text">App Sponsors</h2>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonContent, IonIcon, IonButtons, IonMenu, IonMenuToggle, IonFooter, IonMenuButton, IonBackButton, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonGrid, IonRow, IonCol } from '@ionic/vue';
    import { useDataStore } from '@/stores/data';
    import FairNav from '@/components/FairNav.vue';

    const dataStore = useDataStore();
    console.log('fair page data store', dataStore.data);


</script>

<style scoped lang="scss">

    ion-col {
        margin: 0px 0px;
    }

    .main {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative; // Add this
        // height: 83vh;
        //background-image: url('/src/imgs/Flags_Pink.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        padding-bottom: 20px;
    
        // Create a pseudo-element for the gradient
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            //background: linear-gradient(360deg, #EAC5FF 7.51%, #EECEFF 30.63%, #BE7CFF 100%);
            mix-blend-mode: multiply;
            z-index: 0;
        }
    
    
        &-logo {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 20px;
            position: relative; // Add this
            z-index: 1; // Add this to ensure logo stays on top
            margin-bottom: 10px;

            @media (max-height: 845px) {
                max-height: 120px;
            }
        }

        &-button {
            padding: 10px; 
            border-radius: 30px;
            //box-shadow: 0px 3px 0px 0px #AC37D0;
            //box-shadow: 0px 2px 0px 0px #DA99FEB2 inset;
            //border: 2px solid #101010;
            //background: linear-gradient(180deg, #7323B4 0%, #540F8C 100%);
            gap: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            width: 34vw;
            height: 130px;

            // Smaller screens
            @media (max-height: 845px) {
                width: 130px;
                height: 120px;
            }

            &__icon {
                max-width: 60px;

                // Smaller screens
                @media (max-height: 845px) {
                    max-width: 50px;
                }
            }

            &__text {
                font-size: 18px;
                font-family: 'Pally', sans-serif;
                color: black;
                text-transform: uppercase;
                font-weight: 600;
                text-align: center;
                margin: 0px;
                padding: 0px 5px;
                flex-grow: 1;

                // Smaller screens
                @media (max-height: 845px) {
                    font-size: 16px;
                    padding: 0px;
                }
            }
        }
    }   

    .section {

        &-header {
            display: flex;
            justify-content: center;
            padding: 20px;
            align-items: center;
            background-color: #ffffff;

            &__text {
                font-size: 24px;
                font-family: 'Pally', sans-serif;
                color: #000000;
                text-transform: uppercase;
                font-weight: 700;
            }
        }
    }


</style>
  