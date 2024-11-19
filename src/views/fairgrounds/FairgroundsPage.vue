<template>
    <ion-page id="main-content">
        <!-- Header Nav -->
        <FairgroundsNav />

        <ion-content>
            <div class="home">
                HI from fairgrounds
            </div>
        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
    import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
    import FairgroundsNav from '@/components/FairgroundsNav.vue';
</script>

<style lang="scss" scoped>

</style>