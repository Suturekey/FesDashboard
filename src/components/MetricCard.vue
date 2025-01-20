<script setup lang="ts">
import { computed } from "vue";
import Icon from "./Icon.vue";

const props = defineProps<{
  header: string;
  icon: string;
  liveMetric: number;
  unit: string;
  hasGraph?: boolean;
  progress: {
    max: number;
    colour?: string;
  };
  substats?: {
    icon?: string;
    description: string;
    value: number | string;
    withUnit?: boolean;
  }[];
}>();

const progressbarId = computed(() => `progressbar${props.header}`);
</script>

<template>
  <section class="card">
    <div class="title">
      <Icon :icon="icon" size="l"></Icon>
      <strong>{{ header }}</strong>
    </div>
    <div class="graphContainer" v-if="hasGraph"></div>
    <div class="barContainer">
      <progress
        :id="progressbarId"
        :value="liveMetric"
        :max="progress?.max"
        :style="`--progress-colour: ${
          progress.colour ? progress.colour : 'var(--c-accent-bright)'
        }`"
      ></progress>
    </div>
    <div class="stats">
      <label class="mainStat" :for="progressbarId">
        <span class="value">{{ liveMetric }}</span>
        <span class="unit">{{ unit }}</span>
        <slot name="metricExtra"></slot>
      </label>
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
  </section>
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
      --progress-colour: var(--c-accent-bright);
      width: 100%;
      height: 8px;

      &::-webkit-progress-bar {
        border-radius: var(--border-radius);
      }

      &::-webkit-progress-value {
        border-radius: var(--border-radius);
        background-color: var(--progress-colour);
      }

      &::-moz-progress-bar {
        background-color: var(--progress-colour);
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
