<template>
  <!-- Keep in Touch Section -->
  <div class="section keep-in-touch">
    <div class="section-header bg">
      <h2 class="section-header__text dark">
        Keep in Touch
      </h2>
    </div>

    <form class="contact-form" @submit.prevent="handleSubmit">
      <div v-if="submitError && !isFormSubmitted" class="error-message">
        An error occurred. Please try again.
      </div>

      <div v-if="isFormSubmitted">
        Form submitted!
      </div>

      <template v-else>
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
        <div class="btn">
          <button class="sign-up-btn" :disabled="isSubmitting">
            {{ submitButtonText }}
          </button>
        </div>
      </template>
    </form>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';

const email = ref('');

const isSubmitting = ref(false);
const isFormSubmitted = ref(false);
const submitError = ref(false);

const submitButtonText = computed(() => {
  return isSubmitting.value ? 'Submitting...' : 'Submit';
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
// Keep in Touch Styles
.keep-in-touch {
    background-color: #EE4623;
    padding: 40px 0px;
    margin: 0px 20px;

    .section-header {
      background: #FDD252;
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
    background-color: #FDD252;
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

.form-text {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 20px;
    text-align: center;
}

.btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .sign-up-btn {
    background-color: #098944;
    border: 2px solid #098944;
    color: #FFF1AF;
    text-transform: uppercase;
    padding: 18px 50px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: fit-content;
    font-size: 20px;
    line-height: 24px;

    &:hover {
      background: #098944;
      color: #FFF1AF;
    }
    &:disabled {
      opacity: 0.6;
      cursor: default;
    }
  }
}
</style>
