<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button default-href="/"></ion-back-button>
              </ion-buttons>
              <ion-title>THE FAIR</ion-title>
            </ion-toolbar>
          </ion-header>

        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title class="main-title" size="large">New York State Fair</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-card>
                <!-- <ion-card-header>
                    <ion-card-title>The Annual Great New York State Fair</ion-card-title>
                </ion-card-header> -->
            
                <ion-card-content>
                    The NYSF is a 13-day showcase of agriculture, entertainment, education, and technology. With midway rides, concessionaires, exhibits, and concerts, we are the largest state fair in the country. The New York State Fairgrounds is a 375-acre exhibit and entertainment complex that operates all year. A year-round schedule of events is available here.
                </ion-card-content>
            </ion-card>
            <ion-grid>
                <ion-header class="section-header">
                    <ion-title>Gallery</ion-title>
                </ion-header>
                <ion-row>
                    <ion-col class="img-col">
                        <ion-card class="img-card">
                            <img src="/src/imgs/News_NYSF.jpg" alt="">
                        </ion-card>
                        <ion-card class="img-card">
                            <img src="/src/imgs/NYSF_2022_GalleryImages_7.jpg" alt="">
                        </ion-card>
                        <ion-card class="img-card">
                            <img src="/src/imgs/NYSF_2022_GalleryImages_6.jpg" alt="">
                        </ion-card>
                    </ion-col>
                    <ion-col class="img-col">
                        <ion-card class="img-card">
                            <img src="/src/imgs/NYSF_2022_GalleryImages_2.jpg" alt="">
                        </ion-card>
                        <ion-card class="img-card">
                            <img src="/src/imgs/NYSF_2022_GalleryImages_3.jpg" alt="">
                        </ion-card>
                        <ion-card class="img-card">
                            <img src="/src/imgs/NYSF_Marquee_Image.jpg" alt="">
                        </ion-card>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
        <ion-footer>
            <ion-toolbar>
                <ion-title>NYSF</ion-title>
            </ion-toolbar>
        </ion-footer>

    </ion-page>
</template>

<script setup lang="ts">
    import { IonContent, IonButtons, IonFooter, IonBackButton, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonGrid, IonRow, IonCol } from '@ionic/vue';
    import { useDataStore } from '@/stores/data';

    const dataStore = useDataStore();
    console.log('fair page data store', dataStore.data);

    
</script>

<style scoped lang="scss">

    .section-header {
        margin-bottom: 10px;
    }

    .img-col {
        padding-left: 0px;
        padding-right: 0px;
    }

    .img-card {
        padding: 0px;
        margin: 5px;
    }


</style>
  