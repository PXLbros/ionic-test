<template>
  <FairgroundsLayout
      title="Rental Opportunities"
      :showMenuButton="true"
    >
        <div class="main">
          <div class="padding-wrapper">
            <div class="main__image">
                <PlaceholderIcon />
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
            <div v-if="isSubmitted" class="thank-you-message">
              <h2>Thank you!</h2>
              <p>Your form has been successfully submitted. We will get back to you shortly.</p>
            </div>
            <form v-else class="form" @submit.prevent="handleSubmit">
                <div class="form__group">
                    <label for="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        v-model="formData.contactName"
                        required
                    >
                </div>

                <div class="form__group">
                    <label for="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        v-model="formData.contactTitle"
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

                <div class="form__group">
                    <label for="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        v-model="formData.email"
                        required
                    >
                </div>

                <div class="form__group">
                    <label for="phone">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        v-model="formData.phone"
                        required
                    >
                </div>

                <div class="form__group">
                    <label for="eventType">Event Type</label>
                    <input
                        type="text"
                        id="eventType"
                        v-model="formData.eventType"
                        required
                    >
                </div>

                <div class="form__group">
                    <label for="eventDate">Event Date</label>
                    <input
                        type="text"
                        id="eventDate"
                        v-model="formData.eventDate"
                        required
                    >
                </div>

                <div class="form__group">
                    <label for="additionalInfo">Additional Information</label>
                    <input
                        type="text"
                        id="additionalInfo"
                        v-model="formData.additionalInformation"
                    >
                </div>

                <button type="submit" class="submit-button" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                </button>
            </form>

            <SocialIcons type="fairgrounds" :social-data="dataStore.data.nysfairWebsite.social" />
        </div>
    </FairgroundsLayout>
</template>

<script setup lang="ts">
import PlaceholderIcon from '@/components/Icons/PlaceholderIcon.vue';
import FairgroundsLayout from '@/layouts/fairgrounds.vue';
import { useDataStore } from '@/stores/data';
import SocialIcons from '@/components/SocialIcons.vue';
import { useAppStore } from '@/stores/app';
import appConfig from '@/config/app';

const dataStore = useDataStore();
const appStore = useAppStore();

interface FormData {
    contactName: string;
    contactTitle: string;
    company: string;
    email: string;
    phone: string;
    eventType: string;
    eventDate: string;
    additionalInformation: string;
}

const formData = ref<FormData>({
    contactName: '',
    contactTitle: '',
    company: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    additionalInformation: ''
});

const isSubmitting = ref(false);
const isSubmitted = ref(false);

const handleSubmit = async () => {
    isSubmitting.value = true;
    try {
        const response = await fetch(`${import.meta.env.VITE_NYSFAIRGROUNDS_API_URL}/contact/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData.value)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
            isSubmitted.value = true;
        } else {
            alert('Failed to submit the form. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit the form. Please try again.');
    } finally {
        isSubmitting.value = false;
    }
};

const populateTestData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === '1') {
        formData.value = {
            contactName: 'Test Name',
            contactTitle: 'Test Title',
            company: 'Test Company',
            email: 'test@example.com',
            phone: '123-456-7890',
            eventType: 'Test Event',
            eventDate: '2023-12-31',
            additionalInformation: 'This is test data.'
        };
    }
};

onMounted(() => {
    populateTestData();
});
</script>

<style lang="scss" scoped>
@use "sass:color";

.main {
    background-color: #EBEDEF;
    padding-bottom: v-bind('appConfig.bottomBar.height');

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
    background-color: color.adjust(#3B71CA, $lightness: -5%);
  }

  &[disabled] {
    opacity: 0.5;
    cursor: default;
  }
}

:deep(ion-content) {
    --background: white;
}
</style>
