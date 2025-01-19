<script setup lang="ts">
import Icon from "./Icon.vue";
import type {
  I_AthleteData,
  I_AthleteStats,
  I_FakeAthleteData,
} from "../../types";
import fakeData from "../data/fakeAthleteData";
import { ref, onMounted, computed } from "vue";

const props = defineProps<{
  athlete: I_AthleteData;
  stats?: I_AthleteStats;
}>();

const fakeAthleteData = ref();

const imageUrl = computed(
  () =>
    new URL(`/src/data/images/${props.athlete?.athleteId}.jpg`, import.meta.url)
      .href
);

onMounted(() => {
  fakeAthleteData.value = (fakeData as Record<string, I_FakeAthleteData>)[
    props.athlete.athleteId
  ];
});
</script>

<template>
  <div class="card">
    <img
      :src="imageUrl"
      :alt="`Portrait of ${fakeAthleteData?.firstName} ${fakeAthleteData?.lastName}`"
    />
    <div class="names">
      <p class="names--small">{{ fakeAthleteData?.firstName }}</p>
      <p class="names--big">{{ fakeAthleteData?.lastName }}</p>
    </div>
    <div class="steps">
      <progress
        class="steps_progress"
        :value="athlete?.metrics.steps"
        :max="fakeAthleteData?.stepGoal"
      ></progress>
      <div class="steps_explicit">
        <span>Schritte</span>
        <span class="currentSteps">{{ athlete?.metrics.steps }}</span>
        <span> / {{ fakeAthleteData?.stepGoal }} </span>
      </div>
    </div>
    <div class="bottom">
      <div class="statDisplay heartRate">
        <span class="title">Herzfrequenz</span>
        <div class="badge" v-if="athlete && athlete.metrics.heartRate > 142">
          Erhöht
        </div>
        <div class="measurement">
          <Icon icon="heartRate" size="xl"></Icon>
          <span class="measurement_value">{{
            athlete?.metrics.heartRate
          }}</span>
          <span class="measurement_unit">BPM</span>
        </div>
        <div class="stats">
          <span
            >Min <span class="fwt-bold">{{ stats?.heartRate.min }}</span></span
          >
          <span
            >Avg <span class="fwt-bold">{{ stats?.heartRate.avg }}</span></span
          >
          <span
            >Max <span class="fwt-bold">{{ stats?.heartRate.max }}</span></span
          >
        </div>
      </div>
      <div class="statDisplay speed">
        <span class="title">Geschwindigkeit</span>
        <div class="measurement">
          <Icon icon="speed" size="xl"></Icon>
          <span class="measurement_value">{{ athlete?.metrics.speed }}</span>
          <span class="measurement_unit">MPH</span>
        </div>
        <div class="stats">
          <span>Avg</span>
          <span class="fwt-bold">{{ stats?.speed.avg }}</span>
          <span>Max</span>
          <span class="fwt-bold">{{ stats?.speed.max }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fwt-bold {
  font-weight: 600;
}

.card {
  --image-dim: 100px;
  --image-margin: 0.5rem;
  --padding: 0.9rem;
  --border-radius: 8px;
  position: relative;
  padding: var(--padding);
  background-color: var(--c-card-bg);
  color: var(--c-text);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  line-height: 1;

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  &::before {
    content: "";
    position: absolute;
    height: calc(var(--padding) + var(--image-dim) / 2);
    width: 100%;
    top: 0;
    left: 0;
    background-color: var(--c-accent);
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  & > div {
    z-index: 1;
  }

  img {
    position: absolute;
    width: var(--image-dim);
    aspect-ratio: 1;
    border-radius: 50%;
  }
}

.names {
  margin-left: calc(var(--image-dim) + var(--image-margin));
  margin-bottom: 0.25rem;

  & > p {
    line-height: 1;
    color: var(--c-text);
  }

  .names--small {
    margin-left: -10px;
    font-size: 0.9rem;
  }

  .names--big {
    font-size: 1.8rem;
  }
}
.steps {
  margin-left: calc(var(--image-dim) + var(--image-margin));
  margin-bottom: 1.5rem;

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

  .steps_explicit {
    display: flex;

    span:first-of-type {
      font-size: 0.8rem;
    }

    .currentSteps {
      margin-left: auto;
      margin-right: 0.3rem;
      font-size: 1.4rem;

      & + span {
        margin-bottom: 3px;
        font-size: 0.9rem;
        align-self: end;
      }
    }
  }
}

.bottom {
  height: 120px;
  background-color: var(--c-bg-gray);
  border-radius: 9px;
  display: flex;

  & > div {
    flex: 1;
  }

  .statDisplay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-block: 0.5rem;

    .title {
      font-size: 0.8rem;
    }

    .measurement {
      display: flex;
      align-items: center;

      .measurement_value {
        font-size: 2.5rem;
        margin-right: 0.1rem;
        margin-left: 0.2rem;
      }
      .measurement_unit {
        align-self: start;
        margin-top: 0.2rem;
      }
    }

    .stats {
      display: flex;
      gap: 0.4rem;

      font-size: 0.8rem;
    }
  }
}

.statDisplay.heartRate {
  position: relative;

  .badge {
    position: absolute;
    background-color: rgb(from var(--c-card-bg) r g b / 0.75);
    padding: 0.3rem;
    border-radius: 4px;
    top: 1.2rem;
    font-size: 0.8rem;
  }
}
</style>
