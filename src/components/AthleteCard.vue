<script setup lang="ts">
import Icon from "./Icon.vue";
import type {
  I_AthleteData,
  I_AthleteStats,
  I_FakeAthleteData,
} from "../../types";
import fakeData, { unknownAthlete } from "../data/fakeAthleteData";
import { ref, onMounted, computed } from "vue";

const props = defineProps<{
  athlete: I_AthleteData;
  stats?: I_AthleteStats;
  holdsRecord?: boolean;
}>();

const fakeAthleteData = ref();

const imageUrl = computed(
  () =>
    new URL(`/src/data/images/${props.athlete?.athleteId}.jpg`, import.meta.url)
      .href
);

const progressbarId = computed(() => `progressbar${props.athlete.athleteId}`);

onMounted(() => {
  fakeAthleteData.value =
    (fakeData as Record<string, I_FakeAthleteData>)[props.athlete.athleteId] ||
    unknownAthlete;
});
</script>

<template>
  <router-link class="card" tabindex="0" :to="`/athlete/${athlete.athleteId}`">
    <img
      :src="imageUrl"
      :alt="`Portrait of ${fakeAthleteData?.firstName} ${fakeAthleteData?.lastName}`"
    />
    <div class="header">
      <div class="names">
        <p class="names--small">{{ fakeAthleteData?.firstName }}</p>
        <p class="names--big">{{ fakeAthleteData?.lastName }}</p>
      </div>
      <Icon
        v-if="holdsRecord"
        icon="medal"
        size="xl"
        class="recordIcon"
        colour="var(--c-text-dark)"
      ></Icon>
    </div>
    <div class="steps">
      <progress
        :id="progressbarId"
        class="steps__progress"
        :value="athlete?.metrics.steps"
        :max="fakeAthleteData?.stepGoal"
      ></progress>
      <div class="steps__explicit">
        <label :for="progressbarId">Schritte</label>
        <span class="currentSteps">{{ athlete?.metrics.steps }}</span>
        <span> / {{ fakeAthleteData?.stepGoal }} </span>
      </div>
    </div>
    <div class="bottom">
      <div class="statDisplay heartRate">
        <span class="title">Herzfrequenz</span>
        <div
          :class="{
            measurement: true,
            elevated: athlete.metrics.heartRate > 100,
            high: athlete.metrics.heartRate > 180,
          }"
        >
          <Icon
            icon="heartRate"
            size="l"
            colour="var(--icon-colour)"
            class="icon"
          ></Icon>
          <span class="measurement__value">{{
            athlete?.metrics.heartRate
          }}</span>
          <span class="measurement__unit">BPM</span>
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
          <Icon icon="speed" size="l"></Icon>
          <span class="measurement__value">{{ athlete?.metrics.speed }}</span>
          <span class="measurement__unit">MPH</span>
        </div>
        <div class="stats">
          <span>
            Avg
            <span class="fwt-bold">{{ stats?.speed.avg }}</span>
          </span>
          <span>
            Max
            <span class="fwt-bold">{{ stats?.speed.max }}</span>
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.fwt-bold {
  font-weight: 600;
}

.card {
  --image-dim: 100px;
  --image-margin: 0.5rem;
  --padding: 0.6rem;
  --border-radius: 8px;
  position: relative;
  padding: var(--padding);
  background-color: var(--c-card-bg);
  color: var(--c-text);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  line-height: 1;
  width: clamp(310px, 100%, 500px);

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

  &:hover {
    cursor: pointer;
    scale: 1.05;
    transition: scale 0.2s;
  }

  & > div {
    z-index: 1;
  }

  img {
    position: absolute;
    width: var(--image-dim);
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: var(--c-accent-bright);
  }
}

.header {
  margin-left: calc(var(--image-dim) + var(--image-margin));
  margin-bottom: 0.7rem;
  display: flex;

  .names {
    & > p {
      line-height: 1;
      color: var(--c-text-dark);
    }

    .names--small {
      margin-left: -10px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .names--big {
      font-size: 1.8rem;
    }
  }

  .recordIcon {
    margin-left: auto;
    align-self: center;
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
}
.steps__explicit {
  display: flex;

  label {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--c-text-gray);
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

.bottom {
  position: relative;
  border-radius: 9px;
  display: flex;
  justify-content: space-around;
  padding-inline: 0.5rem;
  padding-bottom: 1rem;
}
.statDisplay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.measurement {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.2rem;
}
.measurement__value {
  font-size: 2.5rem;
  margin-right: 0.1rem;
  margin-left: 0.3rem;
}
.measurement__unit {
  align-self: start;
  margin-top: 0.2rem;
  text-align: center;
  flex-basis: 100%;
}

.heartRate .measurement {
  --icon-colour: var(--c-text);

  &.elevated {
    --icon-colour: var(--c-hr-elevated);

    .icon {
      animation-name: pulsate;
      animation-duration: 0.8s;
      animation-iteration-count: infinite;
      animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.335);
    }
  }

  &.high {
    --icon-colour: var(--c-hr-high);

    .icon {
      animation-duration: 0.5s;
    }
  }
}

.stats {
  display: flex;
  gap: 0.4rem;

  font-size: 0.8rem;

  span {
    display: flex;
    gap: 0.2rem;
  }
}

.statDisplay.heartRate::before {
  content: "";
  position: absolute;
  z-index: -1;
  background-color: var(--c-bg-gray);
  width: 100%;
  height: 78%;
  bottom: 0;
  left: 0;
  border-radius: 9px;
}

@keyframes pulsate {
  from {
    scale: 1;
  }
  to {
    scale: 1.3;
  }
}

@media screen and (min-width: 425px) {
  .card {
    --padding: 0.9rem;
  }
  .measurement__unit {
    flex-basis: unset;
  }
}

@media screen and (min-width: 768px) {
}
</style>
