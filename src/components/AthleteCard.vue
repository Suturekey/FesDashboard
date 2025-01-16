<script setup lang="ts">
import { onMounted, watch, ref, type PropType } from "vue";

interface AthleteData {
  athleteId: string;
  timestamp: string;
  metrics: {
    heartRate: number;
    steps: number;
    speed: number;
  };
}

const props = defineProps({
  athlete: Object as PropType<AthleteData>,
});

const fake = {
  stepGoal: 10000,
  firstName: "Chun Li",
  surname: "Zhang",
};

const minHeartRate = ref(props.athlete?.metrics.heartRate);
const maxHeartRate = ref(props.athlete?.metrics.heartRate);
const avgHeartRate = ref(props.athlete?.metrics.heartRate);
let numMeasurements = 0;

watch(
  () => props.athlete,
  (newAthleteData) => {
    if (!newAthleteData) {
      return;
    }

    numMeasurements++;
    const newHeartRate = newAthleteData.metrics.heartRate;

    if (!minHeartRate.value || newHeartRate < minHeartRate.value) {
      minHeartRate.value = newHeartRate;
    } else if (!maxHeartRate.value || newHeartRate > maxHeartRate.value) {
      maxHeartRate.value = newHeartRate;
    }

    avgHeartRate.value =
      ((avgHeartRate.value || 0) * numMeasurements + newHeartRate) /
      (numMeasurements + 1);
  }
);
</script>

<template>
  <div class="card">
    <!-- <img src="" alt="" /> -->
    <div class="imagePlaceholder"></div>
    <div class="names">
      <p class="names--small">{{ fake.firstName }}</p>
      <p class="names--big">{{ fake.surname }}</p>
    </div>
    <div class="steps">
      <progress
        class="steps_progress"
        :value="athlete?.metrics.steps"
        :max="fake.stepGoal"
      ></progress>
      <div class="steps_explicit">
        <span>Schritte</span>
        <span class="currentSteps">{{ athlete?.metrics.steps }}</span>
        <span> / {{ fake.stepGoal }} </span>
      </div>
    </div>
    <div class="bottom">
      <div class="statDisplay heartRate">
        <span class="title">Herzfrequenz</span>
        <div class="badge" v-if="athlete && athlete.metrics.heartRate > 142">
          Erhöht
        </div>
        <div class="measurement">
          <div class="iconPlaceholder"></div>
          <span class="measurement_value">{{
            athlete?.metrics.heartRate
          }}</span>
          <span class="measurement_unit">BPM</span>
        </div>
        <div class="stats">
          <span
            >Min <span class="fwt-bold">{{ minHeartRate }}</span></span
          >
          <span
            >Avg <span class="fwt-bold">{{ avgHeartRate }}</span></span
          >
          <span
            >Max <span class="fwt-bold">{{ maxHeartRate }}</span></span
          >
        </div>
      </div>
      <div class="statDisplay speed">
        <span class="title">Geschwindigkeit</span>
        <div class="measurement">
          <div class="iconPlaceholder"></div>
          <span class="measurement_value">{{ athlete?.metrics.speed }}</span>
          <span class="measurement_unit">MPH</span>
        </div>
        <div class="stats">
          <span>Avg</span>
          <span class="fwt-bold">{{ avgHeartRate }}</span>
          <span>Max</span>
          <span class="fwt-bold">{{ maxHeartRate }}</span>
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
  background-color: #262626;
  color: #e5e5e5;
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
    background-color: #5d71b0;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  & > div {
    z-index: 1;
  }
}
.imagePlaceholder {
  position: absolute;
  width: var(--image-dim);
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: rgb(238, 238, 238);
}

.names {
  margin-left: calc(var(--image-dim) + var(--image-margin));
  margin-bottom: 0.5rem;

  & > p {
    line-height: 1;
    color: black;
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
      background-color: #5d71b0;
    }
  }

  .steps_explicit {
    display: flex;

    span:first-of-type {
      font-size: 1.2rem;
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
  background-color: #3c3c3c;
  border-radius: 9px;
  display: flex;

  & > div {
    flex: 1;
  }

  .iconPlaceholder {
    --icon-dim: 2rem;
    width: var(--icon-dim);
    height: var(--icon-dim);
    background-color: rgb(238, 238, 238);
  }

  .statDisplay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 0.8rem;
      margin-top: 0.2rem;
    }

    .measurement {
      display: flex;
      align-items: center;

      .measurement_value {
        font-size: 2.5rem;
        margin-right: 0.1rem;
        margin-left: 0.3rem;
      }
      .measurement_unit {
        align-self: start;
        margin-top: 0.2rem;
      }
    }

    .stats {
      margin-bottom: 0.2rem;
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
    background-color: #262626c6;
    padding: 0.3rem;
    border-radius: 4px;
    top: 1.2rem;
    font-size: 0.8rem;
  }
}
</style>
