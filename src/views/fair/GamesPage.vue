<template>
  <DefaultLayout title="In-App Activities" :showMenuButton="true">
    <div class="activities-container">
      <div
        v-if="games"
        class="game-grid"
      >
        <div
          v-for="game in games"
          :key="game.id"
          class="game-card"
          @click="openGame(game.externalUrl)"
        >
          <h2>{{ game.name }}</h2>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/default.vue';
import { ref } from 'vue';
import { useDataStore } from '@/stores/data';
import { Browser } from '@capacitor/browser';

// Game Interface Type
interface Game {
  id: number;
  name: string;
  externalUrl: string;
  createdAt: string;
  updatedAt: string;
  image: null | string;
}

const dataStore = useDataStore();
const games = ref<Game[]>(dataStore?.data?.nysfairWebsite.games);

const openGame = async (url: string) => {
  try {
    await Browser.open({
      url,
      presentationStyle: 'fullscreen',
      toolbarColor: '#333333'
    });
  } catch (error) {
    console.error('Failed to open game:', error);
  }
};
</script>

<style lang="scss" scoped>
.activities-container {
  background-color: #FDD252;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.game-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  height: 100%;
  justify-content: center;
  padding: 10px 0px;
}

.game-card {
  background-color: #FFFFFF;
  border-radius: 40px;
  border: 9px solid #F4E8AB;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex: 1;
  min-height: 100px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }

  h2 {
    color: #343434;
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    margin: 0;
    line-height: 1.2;
  }
}

/* Adjust for very small screens */
@media (max-height: 500px) {
  .game-grid {
    padding: 8px 4px;
    gap: 12px;
  }

  .game-card {
    min-height: 80px;
    padding: 12px;
    border-width: 6px;

    h2 {
      font-size: 22px;
    }
  }
}
</style>
