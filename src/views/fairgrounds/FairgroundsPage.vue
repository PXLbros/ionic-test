<template>
    <ion-page id="main-content">
        <!-- Header Nav -->
        <FairgroundsNav />

        <ion-content>
            <div class="main">
                <div class="main__header">
                    <h1 class="main__header--text">New York State Fairgrounds</h1>
                </div>
            </div>
        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
    import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
    import FairgroundsNav from '@/components/FairgroundsNav.vue';
</script>

<style lang="scss" scoped>

.main {
    padding: 20px;

    &__header {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;

        &--text {
            font-size: 24px;
            font-weight: 700;
        }
    }
}

</style>