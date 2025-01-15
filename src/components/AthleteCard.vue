<script setup lang="ts">
import { onMounted, type PropType } from "vue";

interface AthleteData {
  athleteId: string;
  timestamp: string;
  metrics: {
    heartRate: number;
    steps: number;
    speed: number;
  };
}

const fake = {
  stepGoal: 10000,
};

const props = defineProps({
  athlete: Object as PropType<AthleteData>,
});
</script>

<template>
  <div class="card">
    <div class="top">
      <!-- <img src="" alt="" /> -->
      <div class="imagePlaceholder"></div>
      <div class="smallName">Firstname</div>
      <div class="bigName">Lastgame</div>
      <div class="steps">
        <progress
          class="stepProgress"
          :value="athlete?.metrics.steps"
          :max="fake.stepGoal"
        ></progress>
        <div>{{ athlete?.metrics.steps }} / {{ fake.stepGoal }}</div>
      </div>
    </div>
    <div class="bottom">
      <div class="heartRate">{{ athlete?.metrics.heartRate }}</div>
      <div class="speed">{{ athlete?.metrics.speed }}</div>
    </div>
  </div>
</template>

<style scoped>
.card {
  --image-dim: 100px;
  --padding: 0.9rem;
  --border-radius: 8px;
  position: relative;
  padding: var(--padding);
  background-color: #262626;
  color: #e5e5e5;
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;

  &::before {
    content: "";
    position: absolute;
    height: calc(var(--padding) + var(--image-dim) / 2);
    width: 100%;
    background-color: #5d71b0;
    top: 0;
    left: 0;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }
}

.top {
  z-index: 1;
  display: grid;
  grid-template-columns: [image-start] min-content [image-end] 1fr;
  grid-template-rows: 1fr 1fr 40%;
  column-gap: 0.5rem;
  margin-bottom: 1.8rem;

  .imagePlaceholder {
    grid-column: image;
    grid-row: 1 / -1;
    height: var(--image-dim);
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: rgb(238, 238, 238);
  }

  .firstname {
    font-size: 1.2em;
  }
  progress {
    --border-radius: 20px;
    width: 100%;
    height: 8px;

    &::-webkit-progress-bar {
      border-radius: var(--border-radius);
    }

    &::-webkit-progress-value {
      border-radius: var(--border-radius);
      background-color: #5d71b0;
    }
  }
}

.bottom {
  height: 120px;
  background-color: #3c3c3c;
  border-radius: 9px;
}
</style>
