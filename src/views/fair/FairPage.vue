<template>
    
    <ion-page id="main-content" >
        <!-- Header Nav -->
        
        <!-- Main Content -->
        <NavMenu />
        <ion-content :fullscreen="true">
            <div class="main">
                <div class="main-logo">
                    <img src="/src/imgs/svg/fair-main-logo.svg" alt="NYSF Logo">
                </div>
                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <div class="main-button">
                                <img src="/src/imgs/icons/ticket-icon.svg" alt="The Fair" class="main-button__icon">
                                <h2 class="main-button__text">Buy Tickets</h2>
                            </div>
                        </ion-col>
                        <ion-col>
                            <div class="main-button">
                                <img src="/src/imgs/icons/map-icon.svg" alt="The Fair" class="main-button__icon">
                                <h2 class="main-button__text">Fair Finder Map</h2>
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
    import { homeOutline } from 'ionicons/icons';
    import NavMenu from './NavMenu.vue';

    const dataStore = useDataStore();
    console.log('fair page data store', dataStore.data);


</script>

<style scoped lang="scss">

    ion-toolbar {
        --background: #48027FE5;
    };

    .header-side {
        padding: 5px 25px 10px 25px;
    }

    .main {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative; // Add this
        height: 83vh;
        background-image: url('/src/imgs/Flags_Pink.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    
        // Create a pseudo-element for the gradient
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(360deg, #EAC5FF 7.51%, #EECEFF 30.63%, #BE7CFF 100%);
            mix-blend-mode: multiply;
            z-index: 0;
        }
    
    
        &-logo {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 38px;
            position: relative; // Add this
            z-index: 1; // Add this to ensure logo stays on top
            margin-bottom: 15px
        }

        &-button {
            padding: 10px; 
            border-radius: 30px;
            box-shadow: 0px 3px 0px 0px #AC37D0;
            box-shadow: 0px 2px 0px 0px #DA99FEB2 inset;
            border: 4px solid #CD5FEF;
            background: linear-gradient(180deg, #7323B4 0%, #540F8C 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 140px;
            height: 130px;

            &__icon {
                max-width: 60px;
            }

            &__text {
                font-size: 18px;
                font-family: 'Pally', sans-serif;
                color: white;
                text-transform: uppercase;
                font-weight: 600;
                text-align: center;
                margin: 0px;
                padding: 0px 5px;
            }
        }
    }   

    .section {

        &-header {
            display: flex;
            justify-content: center;
            padding: 20px;
            align-items: center;
            background-color: #530D8C;

            &__text {
                font-size: 24px;
                font-family: 'Pally', sans-serif;
                color: #FFF1AF;
                text-transform: uppercase;
                font-weight: 700;
            }
        }
    }


</style>
  