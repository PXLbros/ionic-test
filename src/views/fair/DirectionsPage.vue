<template>
    <ion-page>
        <ion-header>
            <ion-toolbar :translucent="true">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/fair/plan-your-visit"></ion-back-button>
                </ion-buttons>
                <ion-title>Directions</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">

            <div class="main">
                <div class="main__image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                        <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                    </svg>
                </div>

                <div class="main__content">
                    <h1 class="main__content-title">Directions</h1>

                    <p class="main__content-text">
                        The New York State Fairgrounds is immediately adjacent to Route 690 just West of Syracuse. It is easily accessible from the New York State Thruway (Rt. 90) from the West and East, and from Route 81, North and South. Just follow the signs to the Fairgrounds once you enter the Syracuse area.
                    </p>

                    <p class="main__content-text">
                        Our street address is:
                        <a href="https://maps.google.com/?q=581+State+Fair+Blvd,+Syracuse,+New+York+13209" class="main__content-link">
                            581 State Fair Blvd., Syracuse, New York 13209
                        </a>
                    </p>

                    <p class="main__content-text">
                        Our GPS coordinates are:
                        <a href="https://maps.google.com/?q=43.073857,-76.215708" class="main__content-link">
                            43.073857,-76.215708
                        </a>
                    </p>

                    <h2 class="main__content-subtitle">From the West - Buffalo / Rochester Area</h2>
                    <p class="main__content-text">
                        Take the New York State Thruway (Rt. 90 East) to Exit 39, then follow Rt. 690 East.
                    </p>
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
    height: calc(100vh - 56px); // Subtract header height
    display: flex;
    flex-direction: column;

    &__image {
        background-color: #EFF2F6;
        border-radius: 24px;
        height: 25vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;
        flex: 1;
    }

    &__content {
        &-title {
            font-size: 24px;
            font-weight: 600;
            color: #343434;
            margin: 0 0 5px 0;
            line-height: 28px;
            letter-spacing: 0.5px;
        }

        &-subtitle {
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            margin: 24px 0 5px 0;
            line-height: 1.2;
        }

        &-text {
            font-size: 16px;
            line-height: 28px;
            letter-spacing: 0.5px;
            color: #343434;
            margin: 0 0 16px 0;

            &:last-child {
                margin-bottom: 0;
            }
        }

        &-link {
            color: #343434;
            text-decoration: underline;
            font-weight: 400;
        }
    }
}

:deep(ion-content) {
    --background: white;
}
</style>
