<template>
    
    <ion-page id="main-content" >
        <!-- Header Nav -->
        
        <!-- Main Content -->
        <FairNav />
        <ion-content :fullscreen="true">
            <div class="main">
                <div class="main-logo">
                    <img src="/src/imgs/svg/fair-main-logo.svg" alt="NYSF Logo">
                </div>
                <ion-grid>
                    <ion-row>
                        <ion-col router-link="/fair/tickets">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg> 
                                <h2 class="main-button__text">Buy Tickets</h2>
                            </div>
                        </ion-col>
                        <ion-col router-link="/fair/map">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg> 
                                <h2 class="main-button__text">Fair Finder Map</h2>
                            </div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col router-link="/fair/schedule">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg> 
                                <h2 class="main-button__text">Daily Schedule</h2>
                            </div>
                        </ion-col>
                        <ion-col router-link="/fair/music">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg>  
                                <h2 class="main-button__text">Chevrolet Music Series</h2>
                            </div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col router-link="/fair/updates">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg>  
                                <h2 class="main-button__text">Real-Time Updates</h2>
                            </div>
                        </ion-col>
                        <ion-col router-link="/fair/games">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg>  
                                <h2 class="main-button__text">In-App Activities</h2>
                            </div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col router-link="/fair/plan-your-visit">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg>                                    
                                <h2 class="main-button__text">Plan Your Visit</h2>
                            </div>
                        </ion-col>
                        <ion-col router-link="/fair/news">
                            <div class="main-button">
                                <svg class="main-button__icon" width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50.5 44.4444V5.55556C50.5 2.5 48 0 44.9444 0H6.05556C3 0 0.5 2.5 0.5 5.55556V44.4444C0.5 47.5 3 50 6.05556 50H44.9444C48 50 50.5 47.5 50.5 44.4444ZM15.7778 29.1667L22.7222 37.5278L32.4444 25L44.9444 41.6667H6.05556L15.7778 29.1667Z" fill="#1E5EAE"/>
                                </svg>  
                                <h2 class="main-button__text">News</h2>
                            </div>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>

            <!-- Sponsors Section -->
            <div class="section sponsors">
                <div class="section-header">
                    <h2 class="section-header__text">App Sponsors</h2>
                </div>
                <div class="sponsor-carousel">
                    <div class="sponsor-carousel__container" ref="carouselContainer">
                        <div 
                            class="sponsor-item"
                            v-for="(sponsor, index) in sponsors" 
                            :key="index"
                        >
                            <div class="sponsor-card">
                                <img 
                                    :src="sponsor.image" 
                                    :alt="sponsor.name"
                                    @error="handleImageError"
                                    class="sponsor-image"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Keep in Touch Section -->
            <div class="section keep-in-touch">
                <div class="section-header bg">
                    <h2 class="section-header__text">Keep in Touch</h2>
                </div>
                <div class="contact-form">
                    <div class="form-group">
                        <label for="email">Email*</label>
                        <input 
                            type="email" 
                            id="email" 
                            v-model="email" 
                            placeholder="Enter your email"
                            class="form-input"
                        >
                    </div>
                    <p class="form-text">
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <button class="sign-up-btn">Sign Up</button>
                </div>
            </div>

            <!-- Social Media Section -->
            <div class="section social-media">
                <div class="section-header">
                    <h2 class="section-header__text">Follow Us</h2>
                </div>
                <div class="social-icons">
                    <a href="#" class="social-icon"><ion-icon :icon="logoInstagram" size="large"></ion-icon></a>
                    <a href="#" class="social-icon"><ion-icon :icon="logoFacebook" size="large"></ion-icon></a>
                    <a href="#" class="social-icon"><ion-icon :icon="logoX" size="large"></ion-icon></a>
                    <a href="#" class="social-icon"><ion-icon :icon="logoTiktok" size="large"></ion-icon></a>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonContent, IonIcon, IonPage, IonGrid, IonRow, IonCol } from '@ionic/vue';
    import { useDataStore } from '@/stores/data';
    import FairNav from '@/components/FairNav.vue';
    import { logoFacebook, logoInstagram, logoTiktok, logoX } from 'ionicons/icons';
    import { ref, onMounted } from 'vue';


    const dataStore = useDataStore();
    console.log('fair page data store', dataStore.data);

    const email = ref('');
    const carouselContainer = ref<HTMLElement | null>(null);

    // Sample sponsors data - replace with your actual data
    const sponsors = ref([
        { name: 'Sponsor 1', image: '/modal-img/placeholder.svg' },
        { name: 'Sponsor 2', image: '/modal-img/placeholder.svg' },
        { name: 'Sponsor 3', image: '/modal-img/placeholder.svg' },
        { name: 'Sponsor 4', image: '/modal-img/placeholder.svg' },
    ]);

    const handleImageError = (event: Event) => {
        const img = event.target as HTMLImageElement;
        img.src = '/path-to-fallback-image.jpg'; // Replace with your fallback image
    };

    // Carousel functionality
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    onMounted(() => {
        const container = carouselContainer.value;
        if (!container) return;

        container.addEventListener('mousedown', (e: MouseEvent) => {
            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
        });

        container.addEventListener('mousemove', (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    });


</script>

<style scoped lang="scss">

    ion-col {
        margin: 0px 0px;
    }

    .main {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative; // Add this
        // height: 83vh;
        //background-image: url('/src/imgs/Flags_Pink.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        padding-bottom: 20px;
    
        // Create a pseudo-element for the gradient
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            //background: linear-gradient(360deg, #EAC5FF 7.51%, #EECEFF 30.63%, #BE7CFF 100%);
            mix-blend-mode: multiply;
            z-index: 0;
        }
    
    
        &-logo {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 20px;
            position: relative; // Add this
            z-index: 1; // Add this to ensure logo stays on top
            margin-bottom: 10px;

            @media (max-height: 845px) {
                max-height: 120px;
            }
        }

        &-button {
            padding: 10px; 
            border-radius: 30px;
            //box-shadow: 0px 3px 0px 0px #AC37D0;
            //box-shadow: 0px 2px 0px 0px #DA99FEB2 inset;
            //border: 2px solid #101010;
            //background: linear-gradient(180deg, #7323B4 0%, #540F8C 100%);
            gap: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            width: 34vw;
            height: 130px;

            // Smaller screens
            @media (max-height: 845px) {
                width: 130px;
                height: 120px;
            }

            &__icon {
                max-width: 60px;

                // Smaller screens
                @media (max-height: 845px) {
                    max-width: 50px;
                }
            }

            &__text {
                font-size: 18px;
                font-family: 'Pally', sans-serif;
                color: black;
                text-transform: uppercase;
                font-weight: 600;
                text-align: center;
                margin: 0px;
                padding: 0px 5px;
                flex-grow: 1;

                // Smaller screens
                @media (max-height: 845px) {
                    font-size: 16px;
                    padding: 0px;
                }
            }
        }
    }   

    .section {
        padding: 20px 0;
        background-color: white;
    
        &-header {
            display: flex;
            justify-content: center;
            padding: 20px;
            align-items: center;
            background-color: #ffffff;

            &.bg {
                background-color: #EFF2F6;
                width: 100%;
            }
    
            &__text {
                font-size: 24px;
                font-family: 'Pally', sans-serif;
                color: #000000;
                text-transform: uppercase;
                font-weight: 700;
                margin: 0;
            }
        }
    }
    
    // Sponsor Carousel Styles
    .sponsor-carousel {
        padding: 0 20px;
        
        &__container {
            display: flex;
            overflow-x: auto;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 20px;
            padding: 20px 0;
    
            &::-webkit-scrollbar {
                display: none;
            }
        }
    }
    
    .sponsor-card {
        min-width: 200px;
        height: 100px;
        background: #EFF2F6;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
    
        img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
    }
    
    // Keep in Touch Styles
    .keep-in-touch {
        background-color: white;
        padding: 40px 0px;
    }
    
    .contact-form {
        max-width: 500px;
        margin: 0 auto;
        padding: 0 20px;
        margin-top: 40px;
    }
    
    .form-group {
        margin-bottom: 20px;
    
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
        }
    }
    
    .form-input {
        width: 100%;
        padding: 18px 12px;
        border: 1px solid #EFF2F6;
        border-radius: 8px;
        font-size: 16px;
        background: #EFF2F6;
    }
    
    .form-text {
        color: #666;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 20px;
    }
    
    .sign-up-btn {
        background: none;
        border: 2px solid #1E5EAE;
        color: #1E5EAE;
        padding: 12px 20px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
    
        &:hover {
            background: #1E5EAE;
            color: white;
        }
    }
    
    // Social Media Section Styles
    .social-media {
        padding-bottom: 40px;
        background-color: #EFF2F6;

        .section-header {
            background-color: #EFF2F6;
        }
    }
    
    .social-icons {
        display: flex;
        justify-content: center;
        gap: 30px;
        padding: 20px;
    }
    
    .social-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1E5EAE;
    
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }


</style>
  