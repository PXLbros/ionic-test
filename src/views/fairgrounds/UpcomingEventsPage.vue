<template>
    <ion-page>
        <ion-content>
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-back-button default-href="/fairgrounds"></ion-back-button>
                    </ion-buttons>
                    <ion-title>Upcoming Events</ion-title>
                </ion-toolbar>
            </ion-header>

            <div class="main">
                <div class="main__header">
                    <h1 class="main__header-title">Upcoming Events</h1>
                    <div class="main__header-toggles">
                        <div class="filter">
                            <span>
                                <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.1441 10.7915H18.1461C17.9558 10.0783 17.5363 9.44756 16.9523 8.99658C16.3683 8.5456 15.6523 8.29945 14.9146 8.29611C14.1774 8.30005 13.462 8.54648 12.8786 8.99741C12.2951 9.44834 11.8761 10.0788 11.6859 10.7915H0.861355C0.748601 10.7912 0.636879 10.813 0.532569 10.8559C0.428259 10.8987 0.333402 10.9617 0.253418 11.0413C0.173433 11.1208 0.109889 11.2153 0.0664069 11.3194C0.0229249 11.4235 0.000359663 11.5352 0 11.6481C0.000726013 11.8747 0.0912149 12.0919 0.251643 12.2519C0.412071 12.412 0.629352 12.5018 0.855868 12.5018H11.6887C11.8778 13.2149 12.2961 13.8458 12.8791 14.2973C13.4621 14.7488 14.1774 14.9957 14.9146 15C15.6522 14.9959 16.3678 14.7491 16.9513 14.2976C17.5348 13.8461 17.9537 13.2151 18.1433 12.5018H23.1441C23.2569 12.5022 23.3685 12.4802 23.4727 12.4371C23.5769 12.394 23.6715 12.3307 23.7511 12.2508C23.8307 12.1709 23.8937 12.076 23.9364 11.9716C23.9791 11.8672 24.0007 11.7554 24 11.6426C24.0003 11.5301 23.9781 11.4188 23.9348 11.3151C23.8915 11.2113 23.8278 11.1173 23.7476 11.0386C23.5871 10.8795 23.3701 10.7907 23.1441 10.7915Z" fill="#333333"/>
                                <path d="M0.861355 4.18098H2.57035C2.75701 4.88585 3.17026 5.50966 3.74633 5.95618C4.3224 6.4027 5.02928 6.64711 5.75791 6.6517C6.47728 6.64684 7.17564 6.40841 7.74799 5.97227C8.32034 5.53612 8.73575 4.92583 8.93176 4.23314L23.1441 4.18922C23.2569 4.18958 23.3685 4.16759 23.4727 4.1245C23.5769 4.08141 23.6715 4.01809 23.7511 3.93819C23.8307 3.85829 23.8937 3.7634 23.9364 3.65901C23.9791 3.55461 24.0007 3.44277 24 3.32996C24.0003 3.21753 23.9781 3.10618 23.9348 3.00246C23.8915 2.89874 23.8278 2.80474 23.7476 2.72601C23.6686 2.64624 23.5746 2.58288 23.471 2.53954C23.3675 2.4962 23.2564 2.47374 23.1441 2.47344L8.95645 2.51737C8.7735 1.80633 8.36049 1.17591 7.78187 0.724489C7.20325 0.273064 6.49158 0.026031 5.75791 0.0219421C5.03274 0.026587 4.32903 0.268777 3.7544 0.711483C3.17976 1.15419 2.76581 1.77305 2.57584 2.47344H0.861355C0.748601 2.47308 0.636879 2.49495 0.532569 2.5378C0.428259 2.58065 0.333402 2.64364 0.253418 2.72317C0.173433 2.80271 0.109889 2.89723 0.0664069 3.00134C0.0229249 3.10545 0.000359663 3.21712 0 3.32996C0.000356495 3.44254 0.0229583 3.55394 0.0665073 3.65775C0.110056 3.76156 0.173691 3.85572 0.253748 3.93482C0.333806 4.01391 0.428705 4.07638 0.532984 4.11863C0.637262 4.16088 0.748861 4.18207 0.861355 4.18098Z" fill="#333333"/>
                                </svg>
                            </span> Filters
                        </div>
                        <div class="calendar">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M28.6449 28.4545H24.1159V23.9091H28.6449V28.4545ZM21.8514 17.0909H17.3225V21.6364H21.8514V17.0909ZM28.6449 17.0909H24.1159V21.6364H28.6449V17.0909ZM15.058 23.9091H10.529V28.4545H15.058V23.9091ZM33.1739 8V33H6V8H33.1739ZM30.9094 14.8182H8.26449V30.7273H30.9094V14.8182ZM21.8514 23.9091H17.3225V28.4545H21.8514V23.9091ZM15.058 17.0909H10.529V21.6364H15.058V17.0909Z" fill="#343434"/>
                            </svg>                            
                        </div>
                    </div>
                    <div class="main__header-search">   
                        <div class="search-container">
                            <input class="input" type="text" placeholder="Search Events">
                            <div class="search-icon">
                                <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.8324 10.7477C20.2106 7.0841 14.3382 7.0841 10.7164 10.7477C7.09454 14.4113 7.09454 20.3503 10.7164 24.015C13.9412 27.2769 18.9515 27.6338 22.5669 25.0866L27.8772 30.4582C28.5914 31.1806 29.7501 31.1806 30.4643 30.4582C31.1786 29.7357 31.1786 28.5636 30.4643 27.8412L25.1001 22.4151C27.3852 18.7864 26.9623 13.9169 23.8303 10.7488L23.8324 10.7477ZM21.7124 21.8694C19.2612 24.3489 15.2876 24.3478 12.8375 21.8694C10.3862 19.3899 10.3862 15.3706 12.8375 12.8921C15.2887 10.4127 19.2622 10.4137 21.7124 12.8921C24.1625 15.3706 24.1636 19.3899 21.7124 21.8694Z" fill="#343434"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon } from '@ionic/vue';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
const eventsData = dataStore.data.nysfairWebsite.events as Event[];

console.log('events data', eventsData);

</script>

<style lang="scss" scoped>

    .main {

        &__header {
            display: flex;
            flex-direction: column;


            &-title {
                padding: 30px;
                color: #343434;
                font-size: 24px;
                font-weight: 600;
                font-family: 'Inter', sans-serif;
                line-height: 28px;
                letter-spacing: 0.5px;
            }

            &-toggles {
                padding: 0 30px;
                display: flex;
                width: 100%;
                justify-content: space-between;
                align-items: center;

                .filter {
                    font-size: 14px;
                    font-weight: 700;
                    color: #333;
                    display: flex;
                    gap: 5px;
                }
            }

            &-search {
                padding: 0 30px;
                margin-top: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
            
                .search-container {
                    width: 100%;
                    position: relative;
                    display: flex;
                    align-items: center;
                }
            
                input {
                    width: 100%;
                    padding: 15px 55px 15px 27px; // increased right padding to make room for icon
                    border: 1px solid #E3EBF0;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #333;
                    background-color: #FAFDFF;
                }
            
                .search-icon {
                    position: absolute;
                    right: 15px; // adjust this value to position the icon
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none; // this makes clicks pass through to the input
                }
            }
        }
    }

</style>