<template>
  <div class="map-details-popup" v-if="isVisible">
    <div class="popup-header">
      <h2>{{ title }}</h2>
      <button class="close-button" @click="closePopup">
        <ion-icon name="close-outline"></ion-icon>
      </button>
    </div>
    <div class="popup-content" v-html="content"></div>
    <div class="popup-category" v-if="category">
      {{ category }}
    </div>
    <div class="popup-type">{{ type }}</div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

function closePopup() {
  emit('close');
}
</script>

<style scoped lang="scss">
.map-details-popup {
  position: fixed;
  bottom: 90px;
  left: 0;
  right: 0;
  background-color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 20px;
  max-height: 40vh;
  overflow-y: auto;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .close-button {
      background: none;
      border: none;
      color: #666;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .popup-content {
    margin-bottom: 12px;
    font-size: 16px;
    line-height: 1.5;
  }

  .popup-category {
    display: inline-block;
    background-color: #F4E8AB;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .popup-type {
    font-size: 12px;
    color: #666;
    border-top: 1px solid #eee;
    padding-top: 8px;
    margin-top: 8px;
  }
}
</style>
