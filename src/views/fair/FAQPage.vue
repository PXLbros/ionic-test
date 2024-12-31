<template>
    <ion-page>
        <ion-header>
            <ion-toolbar :translucent="true">
                <ion-buttons slot="start">
                        <ion-back-button default-href="/fair/plan-your-visit"></ion-back-button>
                    </ion-buttons>
                    <ion-title>FAQ</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content :fullscreen="true">

            <!-- Notification Banner -->
            <div class="notification">
                FAQ Section Brown at Full Capacity...
            </div>

            <div class="main">
                <div class="main__image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                        <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                    </svg>
                </div>

                <div class="main__content">
                    <h1 class="main__content-title">FAQ</h1>
                    <p class="main__content-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>

                <div class="expandable-sections">
                    <div 
                        v-for="(section, index) in parkingSections" 
                        :key="index" 
                        class="expandable-section"
                        @click="toggleSection(index)"
                    >
                        <div class="expandable-section__header">
                            <h2>{{ section.title }}</h2>
                            <svg 
                                class="expandable-section__icon"
                                :class="{ 'expanded': section.isExpanded }"
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M6 9L12 15L18 9" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div 
                            v-if="section.isExpanded" 
                            class="expandable-section__content"
                        >
                            {{ section.content }}
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { ref } from 'vue';

const parkingSections = ref([
    {
        title: 'What are the Dates of the Fair?',
        content: 'Content for fair dates...',
        isExpanded: false
    },
    {
        title: 'Parking for other people',
        content: 'Content for other people...',
        isExpanded: false
    },
    {
        title: 'Centro Park-N-Ride',
        content: 'Content for Centro Park-N-Ride...',
        isExpanded: false
    },
    {
        title: 'Oswego County Dept. of Mobility Management Park-N-Ride',
        content: 'Content for Oswego County...',
        isExpanded: false
    },
    {
        title: 'Cedar County Dept. of Mobility Management Park-N-Ride',
        content: 'Content for Cedar County...',
        isExpanded: false
    }
]);

const toggleSection = (index: number) => {
    parkingSections.value[index].isExpanded = !parkingSections.value[index].isExpanded;
};
</script>

<style lang="scss" scoped>
.notification {
    display: none;
    background-color: #EFF2F6;
    padding: 16px 20px;
    font-size: 16px;
    color: #333333;
    text-align: center;
}

.main {
    min-height: calc(100% - 56px); // Subtract notification height
    display: flex;
    flex-direction: column;
    gap: 24px;

    &__image {
        margin: 30px;
        margin-bottom: 0px;
        background-color: #EFF2F6;
        border-radius: 24px;
        height: 25vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__content {
        padding: 30px;

        &-title {
            font-size: 24px;
            font-weight: 600;
            color: #343434;
            margin: 0 0 5px 0;
            line-height: 28px;
            letter-spacing: 0.5px;
        }

        &-text {
            font-size: 16px;
            line-height: 28px;
            letter-spacing: 0.5px;
            color: #343434;
            font-weight: 400;
            margin: 0;
        }
    }
}

.expandable-sections {
    display: flex;
    flex-direction: column;
}

.expandable-section {
    border-top: 1px solid #D9E3ED;
    background: #EEF2F6;
    
    &:last-child {
        border-bottom: 1px solid #D9E3ED;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        cursor: pointer;

        h2 {
            font-size: 18px;
            font-weight: 700;
            color: #333333;
            margin: 0;
            padding-right: 16px;
        }
    }

    &__icon {
        transition: transform 0.3s ease;
        flex-shrink: 0;

        &.expanded {
            transform: rotate(180deg);
        }
    }

    &__content {
        padding: 0 30px 20px 30px;
        color: #666666;
        line-height: 1.5;
    }
}

:deep(ion-content) {
    --background: white;
}
</style>