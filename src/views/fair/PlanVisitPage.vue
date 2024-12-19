<template>
    <ion-page>
        <ion-content>
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-back-button default-href="/fair"></ion-back-button>
                    </ion-buttons>
                    <ion-title>Plan Your Visit</ion-title>
                </ion-toolbar>
            </ion-header>

            <div class="main">
                
                <div class="main__image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                        <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                    </svg>
                </div>

                <div class="main__content">
                    <h1>Plan Your Visit</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>

                <div class="main__links">
                    <router-link to="/fair/directions" class="link-item">
                        <span>Directions</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </router-link>
                    
                    <router-link to="/fair/parking" class="link-item">
                        <span>Parking</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </router-link>
                    
                    <router-link to="/fair/faq" class="link-item">
                        <span>FAQ's</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </router-link>
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
    height: calc(100vh - 56px); // Subtract header height
    display: flex;
    flex-direction: column;

    &__image {
        margin: 30px;
        background-color: #EFF2F6;
        border-radius: 24px;
        height: 35vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0px;
    }

    &__content {
        padding: 30px;

        flex-grow: 1;

        h1 {
            font-size: 24px;
            font-weight: 600;
            color: #343434;
            margin: 0 0 5px 0;
            line-height: 28px;
            letter-spacing: 0.5px;
        }

        p {
            font-size: 16px;
            color: #343434;
            margin: 0;
            line-height: 28px;
            letter-spacing: 0.5px;
        }
    }

    &__links {
        display: flex;
        flex-direction: column;
        background-color: #EFF2F6;
        overflow: hidden;
        margin-bottom: 5px;
    }

    .link-item {
        margin-top: 2px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 13px 30px;
        background-color: white;
        text-decoration: none;
        color: #333333;
        font-size: 18px;
        font-weight: 700;

        &:active {
            background-color: #f5f5f5;
        }

        span {
            font-weight: 700;
        }
    }
}

:deep(ion-content) {
    --background: white;
}
</style>