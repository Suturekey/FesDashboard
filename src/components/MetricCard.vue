<script setup lang="ts">
import Icon from "./Icon.vue";

interface I_CardDisplayData {}

const props = defineProps<{
  header: string;
  icon: string;
  liveMetric: number;
  unit: string;
  hasGraph?: boolean;
  progressMax?: number;
}>();
</script>

<template>
  <div class="card">
    <div class="title">
      <Icon :icon="icon" size="l"></Icon>
      <strong>{{ header }}</strong>
    </div>
    <div class="graphContainer" v-if="hasGraph"></div>
    <div class="barContainer">
      <progress :value="liveMetric" :max="progressMax"></progress>
    </div>
    <div class="stats">
      <div class="mainStat">
        <div class="metric">
          <span>{{ liveMetric }}</span>
          <span>{{ unit }}</span>
        </div>
        <slot name="metricExtra"></slot>
      </div>
      <div class="subStats"></div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: flex;
  flex-direction: column;
  border-radius: 9px;

  .title {
    display: flex;
    align-items: center;
    gap: 0.2rem;

    strong {
      font-size: 0.8em;
    }
  }

  .barContainer {
    progress {
      --border-radius: 20px;
      width: 100%;
      height: 8px;

      &::-webkit-progress-bar {
        border-radius: var(--border-radius);
      }

      &::-webkit-progress-value {
        border-radius: var(--border-radius);
        background-color: #18abd3;
      }

      &::-moz-progress-bar {
        background-color: #18abd3;
      }
    }
  }

  .stats {
    display: flex;
  }

  .mainStat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
