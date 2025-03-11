<template>
  <div class="keep-in-touch">
    <h2 class="touch-title">KEEP IN TOUCH</h2>
    <div class="contact-form">
        <label for="email">Email*</label>
        <input type="email" id="email" placeholder="Enter your email..." />
        <p class="disclaimer">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi, commodi odio</p>
        <button class="fg-signup">Sign Up</button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { IonButton, IonInput } from '@ionic/vue';
import { useDataStore } from '@/stores/data';
import { useAppStore } from '@/stores/app';
import { useRouter } from 'vue-router';

</script>

<style scoped>

  /* Keep in touch section styles */
  .keep-in-touch {
    background-color: #19262D;
    padding: 1px 20px 40px 20px;
    color: white;
    text-align: center;
  }

  .touch-title {
    font-family: 'pt-sans-bold', sans-serif;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 300px;
    margin: 0 auto;
  }

  .contact-form label {
    align-self: flex-start;
    margin-bottom: 5px;
    font-weight: 500;
  }

  .contact-form input {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: #FFF;
    color: #000;
  }

  .disclaimer {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #ccc;
    margin: 0px;
    text-align: start;
  }

  .fg-signup {
    background-color: #FFD100;
    color: #000;
    padding: 20px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 60%;
    font-weight: 700;
    font-size: 14px;
    margin-top: 25px;
    align-self: start;
    text-transform: uppercase;
  }

</style>
