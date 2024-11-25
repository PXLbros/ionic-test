<template>
    <ion-page>
        <ion-content>
            <ion-header>
                <ion-toolbar>
                  <ion-buttons slot="start">
                    <ion-back-button default-href="/fair"></ion-back-button>
                  </ion-buttons>
                  <ion-title>Recent Updates</ion-title>
                </ion-toolbar>
              </ion-header>

            <div class="main">
                <div class="main__header">
                    <h1 class="main__header-text">Real-time <br/> Updates</h1>
                </div>
                <div class="main__content">
                    <div class="main__content-item">
                        <p class="date">Wed, Aug 21 • 6pm</p>
                        <p class="headline">Notification Headline</p>
                        <p class="content">Curabitur lorem lectus donec; pharetra fringilla torquent facilisis. Egestas suspendisse natoque ex etiam curabitur tempus volutpat molestie.</p>
                    </div>
                    <div class="main__content-item">
                        <p class="date">Wed, Aug 21 • 6pm</p>
                        <p class="headline">Notification Headline</p>
                        <p class="content">Curabitur lorem lectus donec; pharetra fringilla torquent facilisis. Egestas suspendisse natoque ex etiam curabitur tempus volutpat molestie.</p>
                    </div>
                    <div class="main__content-item">
                        <p class="date">Wed, Aug 21 • 6pm</p>
                        <p class="headline">Notification Headline</p>
                        <p class="content">Curabitur lorem lectus donec; pharetra fringilla torquent facilisis. Egestas suspendisse natoque ex etiam curabitur tempus volutpat molestie.</p>
                    </div>
                </div>
            </div>

        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
    import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';

</script>

<style lang="scss" scoped>

.main {

    padding: 30px;

    &__header {
        display: flex;
        margin-bottom: 25px;

        &-text {
            font-size: 24px;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            color: #343434;
            letter-spacing: 0.5px;
            line-height: 28px;
            margin: 0px;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 15px;

        &-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 20px;
            background-color: #EEF2F6;
            border-radius: 10px;

            .date {
                font-size: 16px;
                font-weight: 700;
                color: #343434;
                margin: 0px;
                line-height: 24px;
            }
            .headline {
                font-size: 21px;
                font-weight: 700;
                color: #343434;
                margin: 0px;
                line-height: 36px;
            }
            .content {
                font-size: 16px;
                font-weight: 400;
                color: #343434;
                margin: 0px;
                line-height: 26px;
            }
        }
    }
}

</style>