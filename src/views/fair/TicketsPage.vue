<template>
    <ion-page>
        <ion-header>
            <ion-toolbar :translucent="true">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/fair"></ion-back-button>
                </ion-buttons>
                <ion-title>Tickets</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">

            <div class="main">
                <div class="main__header">
                    <div class="main__header-detail">
                        <p>8:00am - 8:00pm</p>
                    </div>
                    <div class="main__header-title">
                        <h1>New York State Fair</h1>
                    </div>
                    <div class="main__header-detail">
                        <p>Location Name</p>
                    </div>
                </div>
                <div class="main__image">
                    <svg width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M62.5 55.6111V7.38889C62.5 3.6 59.4 0.5 55.6111 0.5H7.38889C3.6 0.5 0.5 3.6 0.5 7.38889V55.6111C0.5 59.4 3.6 62.5 7.38889 62.5H55.6111C59.4 62.5 62.5 59.4 62.5 55.6111ZM19.4444 36.6667L28.0556 47.0344L40.1111 31.5L55.6111 52.1667H7.38889L19.4444 36.6667Z" fill="#1E5EAE"/>
                    </svg>
                </div>
                <div class="main__caption">
                    <p>Image Description Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis, impedit cum quos sapiente </p>
                </div>
                <div class="main__ticket">
                    <div class="main__ticket-button">
                        Buy Tickets
                    </div>
                    <div class="main__ticket-price">
                        <p>$8.00</p>
                    </div>
                </div>
                <div class="main__description">
                    <p>Image Description Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis, impedit cum quos sapiente Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo esse iste necessitatibus facere sequi recusandae, totam iure exercitationem fuga quia. Tempora amet eos sapiente voluptate dolorem iusto dicta. A, beatae! </p>
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
    display: flex;
    flex-direction: column;
    padding: 30px;

    &__header {
        display: flex;
        flex-direction: column;

        &-detail {

            p {
                font-size: 1.0rem;
                margin: 0px;
                color: #666;
            }
        }

        &-title {
            h1 {
                font-size: 1.7rem;
                color: #333;
                margin: 2px 0px 10px 0px;
                font-weight: 600;
                font-family: 'lalezar', sans-serif;
            }
        }
    }

    &__image {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #EFF2F6;
        border-radius: 24px;
        margin-top: 20px;
        width: 100%;
        min-height: 25vh;
        aspect-ratio: 2/1;
    }

    &__caption {
        display: flex;
        margin: 20px 0px;
        p {
            font-size: 12px; //
            margin: 0px;
            color: #666;
            letter-spacing: 0.5px;
            line-height: 28px;
        }
    }

    &__ticket {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        &-button {
            padding: 12px 20px;
            border-radius: 50px;
            background-color: #1E5EAE;
            color: #F1F1F1;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
        }

        &-price {
            p {
                font-size: 32px;
                color: #002F6A;
                font-weight: 600;
                margin: 0px;
            }
        }
    }

    &__description {
        margin-top: 40px;

        p {
            font-size: 16px;
            color: #343434;
            line-height: 28px;
            letter-spacing: 0.5px;
            margin: 0px;
        }
    }
}

</style>
