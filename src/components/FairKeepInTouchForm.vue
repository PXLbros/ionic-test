<template>
  <!-- Keep in Touch Section -->
  <div class="section keep-in-touch">
    <div class="section__inner">
      <div class="section-header bg">
        <h2 class="section-header__text dark">
          Keep in Touch
        </h2>
      </div>

      <p class="section__description-text">
        Receive emails or texts with concert announcements, events, competitions and NYS Fair news. Enter your email address or cell phone number below.
      </p>

      <form class="contact-form" @submit.prevent="handleSubmit">
        <div v-if="submitError && !isFormSubmitted" class="error-message">
          An error occurred. Please try again.
        </div>

        <div v-if="isFormSubmitted">
          Form submitted!
        </div>

        <template v-else>
          <div class="form-group">
            <label for="email">Email or cell phone number*</label>
            <input
              type="text"
              id="email"
              v-model="email"
              placeholder="Enter your email or cell"
              class="form-input"
            >
          </div>

          <div class="btn-container">
            <button class="btn" :disabled="isSubmitting">
              {{ submitButtonText }}
            </button>
          </div>
        </template>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';

const email = ref('');

const isSubmitting = ref(false);
const isFormSubmitted = ref(false);
const submitError = ref(false);

const submitButtonText = computed(() => {
  return isSubmitting.value ? 'Subscribing...' : 'Subscribe';
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    submitError.value = false;

    await axios.post(`${import.meta.env.VITE_STRAPI_API_URL}/data/nysfair/newsletter-sign-up`, {
      email: email.value,
    });

    email.value = '';

    isFormSubmitted.value = true;
  } catch (error) {
    submitError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.section {
  background: #ee4623;
  padding: 30px 0px;
  margin: 0px 20px;

  &__inner {
    background-color: #FDD252;
  }

  &__description-text {
    margin: 0;
    padding: 10px;
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
  }

  .section-header {
    text-align: center;
    font-size: 31px;
    color: #1F3667;
    padding: 35px 0px 5px 0px;

    h2 {
      margin: 0px;
      text-transform: uppercase;

    }
  }
}

.contact-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px 20px 35px 20px;
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    color: #48027F;
  }
}

.form-input {
  width: 100%;
  padding: 18px 12px;
  border: 1px solid #F4E8AB;
  border-radius: 4px;
  font-size: 16px;
  background: #F4E8AB;
}

.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
