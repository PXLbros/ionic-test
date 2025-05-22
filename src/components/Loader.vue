<template>
  <div class="loader">
    <FairLogo />

    <div class="loading-text">
      {{ formattedLoadingText }}
      <span class="dots"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  text?: string;
}>(), {
  text: ''
});

const formattedLoadingText = computed(() => {
  return props.text || 'Loading';
});
</script>

<style lang="scss" scoped>
.loader {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FDD456;
  color: #000;
  z-index: 99999;
}

.logo {
  // animation: bounce 2s ease infinite;
  margin-bottom: 0px;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-20px);
  }

  60% {
    transform: translateY(-10px);
  }
}

.loading-text {
  font-size: 24px;
  font-weight: regular;
  position: relative;
  margin-top: 15px;
  font-family: 'lalezar', sans-serif;
}

.dots {
  display: inline-block;
  width: 70px;
  text-align: left;
}

.dot {
  display: inline-block;
  opacity: 0;
  animation: dotAnimation 1.5s infinite;
  margin-left: 3px;
}

.dot:nth-child(2) {
  animation-delay: 0.5s;
}

.dot:nth-child(3) {
  animation-delay: 1s;
}

@keyframes dotAnimation {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

</style>
