<script setup lang="ts">
import Icon from "./Icon.vue";

defineProps<{
  header: string;
  icon: string;
  liveMetric: number;
  unit: string;
  hasGraph?: boolean;
  progressMax?: number;
  substats?: {
    icon?: string;
    description: string;
    value: number | string;
    withUnit?: boolean;
  }[];
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
        <span class="value">{{ liveMetric }}</span>
        <span class="unit">{{ unit }}</span>
        <slot name="metricExtra"></slot>
      </div>
      <div class="subStats">
        <template v-for="substat in substats">
          <span class="substat__description">
            <Icon v-if="substat.icon" :icon="substat.icon"></Icon>
            <span>{{ substat.description }}</span>
          </span>
          <span class="substat__value">
            <span>{{ substat.value }}</span>
            <span v-if="substat.withUnit">{{ unit }}</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: clamp(310px, 100%, 500px);
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: flex;
  flex-direction: column;
  border-radius: 9px;
  background-color: var(--c-card-bg);

  .title {
    display: flex;
    align-items: center;
    gap: 0.2rem;

    strong {
      font-size: 0.8em;
    }
  }

  .barContainer {
    margin-bottom: 0.5rem;
    progress {
      --border-radius: 20px;
      width: 100%;
      height: 8px;

      &::-webkit-progress-bar {
        border-radius: var(--border-radius);
      }

      &::-webkit-progress-value {
        border-radius: var(--border-radius);
        background-color: var(--c-accent-bright);
      }

      &::-moz-progress-bar {
        background-color: var(--c-accent-bright);
      }
    }
  }

  .stats {
    display: flex;
    justify-content: space-around;
  }

  .mainStat {
    width: 55%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .value {
      font-size: 3rem;
      line-height: 1;
    }

    .unit {
      font-size: 0.9rem;
      text-transform: uppercase;
    }
  }

  .subStats {
    display: grid;
    grid-template-columns: auto auto;
    grid-auto-rows: min-content;
    column-gap: 0.5rem;
    row-gap: 0.1rem;

    .substat__description {
      white-space: nowrap;
      font-size: 0.7rem;
      text-transform: uppercase;
      color: var(--c-text-gray);

      span:nth-child(2) {
        margin-left: 0.25rem;
      }
    }

    .substat__value {
      font-size: 0.8rem;
      font-weight: 600;
      justify-self: end;
      white-space: nowrap;

      span:nth-child(2) {
        margin-left: 0.25rem;
      }
    }
  }
}
</style>
