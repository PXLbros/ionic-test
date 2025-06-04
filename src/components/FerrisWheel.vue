<template>
  <div class="ferris-wheel-container">
    <div class="ferris-wheel">
      <!-- Wheel structure -->
      <div class="wheel">
        <!-- Main support structure - cross pattern -->
        <div class="support-beam horizontal"></div>
        <div class="support-beam vertical"></div>
        <div class="support-beam diagonal-1"></div>
        <div class="support-beam diagonal-2"></div>

        <!-- Outer ring supports -->
        <div class="ring-support ring-1"></div>
        <div class="ring-support ring-2"></div>

        <!-- Gondolas - 12 total for more realistic look -->
        <div class="gondola gondola-1">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
        <div class="gondola gondola-2">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
        <div class="gondola gondola-3">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
        <div class="gondola gondola-4">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
        <div class="gondola gondola-5">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
        <div class="gondola gondola-6">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
        <div class="gondola gondola-7">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
        <div class="gondola gondola-8">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
        <div class="gondola gondola-9">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
        <div class="gondola gondola-10">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
        <div class="gondola gondola-11">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
        <div class="gondola gondola-12">
          <div class="gondola-chain"></div>
          <div class="gondola-car"></div>
        </div>
      </div>

      <!-- Center hub -->
      <div class="hub">
        <div class="hub-inner"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No JavaScript needed - pure CSS animation
</script>

<style lang="scss" scoped>
.ferris-wheel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
}

.ferris-wheel {
  position: relative;
  width: 220px;
  height: 220px;
}

.wheel {
  position: relative;
  width: 100%;
  height: 100%;
  border: 4px solid #8B4513;
  border-radius: 50%;
  animation: rotate 30s linear infinite;
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.2),
    0 0 30px rgba(0, 0, 0, 0.3);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Support beams in cross and X pattern
.support-beam {
  position: absolute;
  background: #654321;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);

  &.horizontal {
    width: 80%;
    height: 3px;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
  }

  &.vertical {
    width: 3px;
    height: 80%;
    left: 50%;
    top: 10%;
    transform: translateX(-50%);
  }

  &.diagonal-1 {
    width: 3px;
    height: 70%;
    left: 50%;
    top: 15%;
    transform: translateX(-50%) rotate(45deg);
    transform-origin: center;
  }

  &.diagonal-2 {
    width: 3px;
    height: 70%;
    left: 50%;
    top: 15%;
    transform: translateX(-50%) rotate(-45deg);
    transform-origin: center;
  }
}

// Concentric ring supports
.ring-support {
  position: absolute;
  border: 2px solid #654321;
  border-radius: 50%;

  &.ring-1 {
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
  }

  &.ring-2 {
    width: 30%;
    height: 30%;
    top: 35%;
    left: 35%;
  }
}

.gondola {
  position: absolute;
  width: 16px;
  height: 20px;
  animation: counter-rotate 30s linear infinite;

  // Position gondolas around the wheel (12 positions, 30 degrees apart)
  &.gondola-1 { top: -10px; left: 50%; transform: translateX(-50%); }
  &.gondola-2 { top: 8px; right: 8px; }
  &.gondola-3 { top: 30%; right: -10px; transform: translateY(-50%); }
  &.gondola-4 { top: 60%; right: 8px; }
  &.gondola-5 { bottom: -10px; right: 35%; }
  &.gondola-6 { bottom: -10px; left: 35%; }
  &.gondola-7 { top: 60%; left: 8px; }
  &.gondola-8 { top: 30%; left: -10px; transform: translateY(-50%); }
  &.gondola-9 { top: 8px; left: 8px; }
  &.gondola-10 { top: 15%; left: 25%; }
  &.gondola-11 { top: 15%; right: 25%; }
  &.gondola-12 { bottom: 15%; left: 50%; transform: translateX(-50%); }
}

@keyframes counter-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

.gondola-chain {
  width: 1px;
  height: 8px;
  background: #444;
  margin: 0 auto 2px;
  box-shadow: 1px 0 0 #444;
}

.gondola-car {
  width: 100%;
  height: 12px;
  background: linear-gradient(135deg, #8B4513 0%, #654321 100%);
  border: 1px solid #4a2c17;
  border-radius: 3px 3px 6px 6px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 1px;
  }
}

.hub {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32px;
  height: 32px;
  background: radial-gradient(circle, #654321 0%, #4a2c17 70%);
  border: 3px solid #8B4513;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  box-shadow:
    0 0 15px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.hub-inner {
  width: 12px;
  height: 12px;
  background: #4a2c17;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
}

// Enhanced shadow/depth
.wheel::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid rgba(139, 69, 19, 0.2);
  border-radius: 50%;
  z-index: -1;
}
</style>
