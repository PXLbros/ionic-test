<template>
  <FairLayout title="Activities & Ag Facts" :showMenuButton="true">
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
          <img v-if="game.image" :src="game.image.url" alt="" />
          <h2 v-else>{{ game.name }}</h2>
        </div>
      </div>
    </div>
  </FairLayout>
</template>

<script setup lang="ts">
import FairLayout from '@/layouts/fair.vue';
import { useDataStore } from '@/stores/data';
import { Browser } from '@capacitor/browser';
import appConfig from '@/config/app';

// Game Interface Type
interface Game {
  id: number;
  name: string;
  externalUrl: string;
  createdAt: string;
  updatedAt: string;
  image: {
    id: number;
    url: string;
    width: number;
    height: number;
  } | null;
}

const dataStore = useDataStore();
const games = ref<Game[]>(dataStore?.data?.nysfairWebsite.games);
console.log('games', games.value);
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
$game-card-border-radius: 40px;

.activities-container {
  background: #FDD456;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-bottom: calc(v-bind('appConfig.bottomBar.height') + 2rem);
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
  position: relative;
  background-color: #FFFFFF;
  border-radius: $game-card-border-radius;
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

  img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $game-card-border-radius;
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
