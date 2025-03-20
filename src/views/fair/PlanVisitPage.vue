<template>
    <DefaultLayout title="Plan Your Visit" :showMenuButton="true">
      <div class="main">

          <div class="main__image">
              <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                  <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
              </svg>
          </div>

          <div class="main__content">
              <h2>Plan Your Visit</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>

            <div class="main__links">
              <router-link to="/fair/directions" class="link-item">
                  <span>Directions</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 29 30" fill="none">
                    <g clip-path="url(#clip0_2339_258)">
                      <path d="M14.97 28.51C22.4313 28.51 28.48 22.4614 28.48 15C28.48 7.53862 22.4313 1.48999 14.97 1.48999C7.50859 1.48999 1.45996 7.53862 1.45996 15C1.45996 22.4614 7.50859 28.51 14.97 28.51Z" fill="#FDD252"/>
                      <path d="M13.2201 22.0199C12.9201 22.0199 12.6301 21.8999 12.4101 21.6899C11.9701 21.2499 11.9701 20.5199 12.4101 20.0799L17.0101 15.4799L12.4101 10.8799C11.9701 10.4399 11.9701 9.70993 12.4101 9.25993C12.6301 9.04993 12.9101 8.92993 13.2201 8.92993C13.5301 8.92993 13.8101 9.04993 14.0301 9.25993L19.4401 14.6699C19.6601 14.8899 19.7701 15.1699 19.7701 15.4799C19.7701 15.7899 19.6501 16.0699 19.4401 16.2899L14.0301 21.6999C13.8201 21.9199 13.5301 22.0299 13.2201 22.0299V22.0199Z" fill="#1F3667"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_2339_258">
                        <rect width="28.06" height="28.06" fill="white" transform="translate(0.939941 0.969971)"/>
                      </clipPath>
                    </defs>
                  </svg>
              </router-link>

              <router-link to="/fair/parking" class="link-item">
                  <span>Parking</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 29 30" fill="none">
                    <g clip-path="url(#clip0_2339_258)">
                      <path d="M14.97 28.51C22.4313 28.51 28.48 22.4614 28.48 15C28.48 7.53862 22.4313 1.48999 14.97 1.48999C7.50859 1.48999 1.45996 7.53862 1.45996 15C1.45996 22.4614 7.50859 28.51 14.97 28.51Z" fill="#FDD252"/>
                      <path d="M13.2201 22.0199C12.9201 22.0199 12.6301 21.8999 12.4101 21.6899C11.9701 21.2499 11.9701 20.5199 12.4101 20.0799L17.0101 15.4799L12.4101 10.8799C11.9701 10.4399 11.9701 9.70993 12.4101 9.25993C12.6301 9.04993 12.9101 8.92993 13.2201 8.92993C13.5301 8.92993 13.8101 9.04993 14.0301 9.25993L19.4401 14.6699C19.6601 14.8899 19.7701 15.1699 19.7701 15.4799C19.7701 15.7899 19.6501 16.0699 19.4401 16.2899L14.0301 21.6999C13.8201 21.9199 13.5301 22.0299 13.2201 22.0299V22.0199Z" fill="#1F3667"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_2339_258">
                        <rect width="28.06" height="28.06" fill="white" transform="translate(0.939941 0.969971)"/>
                      </clipPath>
                    </defs>
                  </svg>
              </router-link>

              <router-link to="/fair/faq" class="link-item">
                  <span>FAQ's</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 29 30" fill="none">
                    <g clip-path="url(#clip0_2339_258)">
                      <path d="M14.97 28.51C22.4313 28.51 28.48 22.4614 28.48 15C28.48 7.53862 22.4313 1.48999 14.97 1.48999C7.50859 1.48999 1.45996 7.53862 1.45996 15C1.45996 22.4614 7.50859 28.51 14.97 28.51Z" fill="#FDD252"/>
                      <path d="M13.2201 22.0199C12.9201 22.0199 12.6301 21.8999 12.4101 21.6899C11.9701 21.2499 11.9701 20.5199 12.4101 20.0799L17.0101 15.4799L12.4101 10.8799C11.9701 10.4399 11.9701 9.70993 12.4101 9.25993C12.6301 9.04993 12.9101 8.92993 13.2201 8.92993C13.5301 8.92993 13.8101 9.04993 14.0301 9.25993L19.4401 14.6699C19.6601 14.8899 19.7701 15.1699 19.7701 15.4799C19.7701 15.7899 19.6501 16.0699 19.4401 16.2899L14.0301 21.6999C13.8201 21.9199 13.5301 22.0299 13.2201 22.0299V22.0199Z" fill="#1F3667"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_2339_258">
                        <rect width="28.06" height="28.06" fill="white" transform="translate(0.939941 0.969971)"/>
                      </clipPath>
                    </defs>
                  </svg>
              </router-link>
            </div>
          </div>
          <div class="contact-form">
            <Contact />
          </div>
          <div class="wrapper">
            <SocialIcons type="fair" :social-data="dataStore.data.nysfairWebsite.social" />
          </div>
    </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/default.vue';
import Contact from '@/components/Contact.vue';
import { useDataStore } from '@/stores/data';


const dataStore = useDataStore();
console.log('fair page data store', dataStore.data);


</script>

<style lang="scss" scoped>
.main {
    height: calc(100vh - 35px); // Subtract header height
    display: flex;
    flex-direction: column;
    background: #FDD456;



    &__image {
        margin: 30px 20px;
        background-color: #EFF2F6;
        border-radius: 10px;
        height: 25vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0px;
        border: 5px solid #F4E8AB;
    }

    &__content {
        padding: 30px 20px;

        h2 {
            font-weight: 400;
            color: #343434;
            margin: 0 0 5px 0;
            line-height: 36px;
            letter-spacing: 0.5px;
        }

        p {
            font-size: 14px;
            color: #343434;
            margin: 0;
            line-height: 24px;
            letter-spacing: 0.5px;
        }
    }

    &__links {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin: 0px 20px;
      gap: 5px;
    }

    .link-item {
        margin-top: 2px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 13px 30px;
        background-color: #1F3667;
        text-decoration: none;
        color: #F1F1F1;
        font-size: 18px;
        font-weight: 700;
        border-radius: 10px;
        height: 9vh;

        &:active {
            background-color: #1F3667;
        }

        span {
            font-weight: 700;
            font-size: 16px;
            line-height: 22px;
            font-family: 'Inter', sans-serif;
        }

    }
  }
  .wrapper {
    padding-bottom: 90px;
  }

.contact-form {
  background-color: #EE4623;
}

:deep(ion-content) {
    --background: white;
}
</style>
