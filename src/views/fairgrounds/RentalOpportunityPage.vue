<template>
  <Fairgrounds
      title="Rental Opportunities"
      :showMenuButton="true"
    >
        <div class="main">
          <div class="padding-wrapper">
            <div class="main__image">
                <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                    <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                </svg>
            </div>

            <div class="main__content">
                <div class="wrapper">
                    <h1 class="main__title">Book Your Event</h1>
                    <p class="main__description">To book an event, use the form below to get in touch with us please contact:</p>
                </div>

                <div class="contact-info">
                    <h2 class="contact-info__title">The New York State Fairgrounds Events Department</h2>
                    <p class="contact-info__address">581 State Fair Blvd.</p>
                    <p class="contact-info__city">Syracuse, NY 13209</p>
                    <a href="#" class="contact-info__directions">Get Directions</a>
                    <p class="contact-info__phone">800.475.FAIR</p>
                </div>

              </div>
            </div>
            <form class="form" @submit.prevent="handleSubmit">
                <div class="form__group">
                    <label for="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        v-model="formData.name"
                        required
                    >
                </div>

                <div class="form__group">
                    <label for="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        v-model="formData.title"
                        required
                    >
                </div>

                <div class="form__group">
                    <label for="company">Company/Organization*</label>
                    <input
                        type="text"
                        id="company"
                        v-model="formData.company"
                        required
                    >
                </div>

                <button type="submit" class="submit-button">Submit</button>
            </form>

            <SocialIcons type="fairgrounds" :social-data="dataStore.data.nysfairWebsite.social" />
        </div>
    </Fairgrounds>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Fairgrounds from '@/layouts/fairgrounds.vue';
import { useDataStore } from '@/stores/data';
import SocialIcons from '@/components/SocialIcons.vue';
import { useAppStore } from '@/stores/app';

const dataStore = useDataStore();
const appStore = useAppStore();

interface FormData {
    name: string;
    title: string;
    company: string;
}

const formData = ref<FormData>({
    name: '',
    title: '',
    company: ''
});

const handleSubmit = () => {
    console.log('Form submitted:', formData.value);
    // Add your form submission logic here
};
</script>

<style lang="scss" scoped>
.main {
    background-color: #EBEDEF;
    padding-bottom: 90px;

    .padding-wrapper {
      padding: 20px;
    }

    &__image {
        background-color: #EFF2F6;
        border-radius: 5px;
        height: 25vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 15px;

    }

    &__title {
        font-size: 24px;
        font-weight: 700;
        color: #343434;
        margin: 0;
        line-height: 28px;
        letter-spacing: 0.5px;
        font-family: 'inter', sans-serif;
        margin-bottom: 5px;
    }

    &__description {
        font-size: 16px;
        line-height: 28px;
        letter-spacing: 0.5px;
        color: #343434;
        margin: 0;
    }
}

.contact-info {
    margin: 10px 0;

    &__title {
        font-size: 20px;
        font-weight: 700;
        color: #343434;
        margin: 0 0 25px 0;
        line-height: 24px;
        letter-spacing: 0.5px;
        font-family: 'inter', sans-serif;
        margin-bottom: 0px;
    }

    &__address,
    &__city,
    &__phone {
        font-size: 16px;
        line-height: 28px;
        color: #343434;
        margin: 0;
    }

    &__directions {
        display: inline-block;
        text-decoration: underline;
        color: #343434;
        font-weight: 600;
        margin: 2px 0;
        margin-top: 20px;
    }
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: white;
    padding: 20px;

    &__group {
        display: flex;
        flex-direction: column;
        gap: 8px;


        label {
            font-size: 14px;
            font-weight: 600;
            color: #343434;
        }

        input {
            padding: 12px;
            border: 1px solid #E3EBF0;
            border-radius: 4px;
            background-color: #EEF2F6;
            font-size: 16px;
            color: #343434;
            width: 100%;

            &:focus {
                outline: none;
                border-color: #3B71CA;
            }
        }
    }
}

.submit-button {
  border: 1px solid #0077C8;
  background-color: #0077C8;
  border-radius: 5px;
  width: fit-content;
  padding: 15px 45px;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #F1F1F1;
  font-weight: 700;
  text-transform: uppercase;

    &:hover {
        background-color: darken(#3B71CA, 5%);
    }
}

:deep(ion-content) {
    --background: white;
}
</style>
