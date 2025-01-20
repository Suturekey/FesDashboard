<script setup lang="ts">
import Icon from "../components/Icon.vue";
import MetricCard from "../components/MetricCard.vue";
import type { I_FakeAthleteData } from "../../types";
import { useAthleteStore } from "../stores/athleteStore";
import { round } from "../utils";
import fakeData, { unknownAthlete } from "../data/fakeAthleteData";
import { ref, computed } from "vue";

const props = defineProps<{
  id: string;
}>();

const athleteStore = useAthleteStore();

const fakeAthleteData = ref();
fakeAthleteData.value =
  (fakeData as Record<string, I_FakeAthleteData>)[props.id] || unknownAthlete;

const athleteMetrics = computed(
  () =>
    athleteStore.athleteList.find((athlete) => athlete.athleteId === props.id)
      ?.metrics
);

const stats = computed(() => athleteStore.athleteAnalysis.get(props.id));

const imageUrl = computed(
  () => new URL(`/src/data/images/${props.id}.jpg`, import.meta.url).href
);

/* These two computed properties are completely made up and are derived from an
 * arbitrary calculation based on the steps taken by the athlete
 */
const distance = computed(
  () => `${round((athleteMetrics.value?.steps ?? 0) * 0.0003, 2)} km`
);
const elevation = computed(
  () => `${round((athleteMetrics.value?.steps ?? 0) * 0.002, 0)} m`
);

const heartRateIntensity = computed(() => {
  enum hrDescriptor {
    LOW = "low",
    NORMAL = "normal",
    ELEVATED = "elevated",
    HIGH = "high",
  }
  const heartRate = athleteMetrics.value?.heartRate ?? 0;
  let text = "";
  let modifier = "";

  if (heartRate > 180) {
    text = "Sehr Hoch";
    modifier = hrDescriptor.HIGH;
  } else if (heartRate > 100) {
    text = "Erhöht";
    modifier = hrDescriptor.ELEVATED;
  } else if (heartRate > 60) {
    text = "Normal";
    modifier = hrDescriptor.NORMAL;
  } else {
    text = "Niedrig";
    modifier = hrDescriptor.LOW;
  }

  return {
    colour: `var(--c-hr-${modifier})`,
    class: `hr--${modifier}`,
    text: text,
  };
});
</script>

<template>
  <div class="container">
    <img
      class="profile"
      :src="imageUrl"
      :alt="`Portrait of ${fakeAthleteData?.firstName} ${fakeAthleteData?.lastName}`"
    />
    <div class="names">
      <span class="bigName">{{ fakeAthleteData.lastName }}</span
      >,
      <span class="smallName">{{ fakeAthleteData.firstName }}</span>
    </div>
    <div class="metricCards">
      <MetricCard
        class="card"
        header="Schritte"
        icon="steps"
        unit="Schritte"
        :liveMetric="athleteMetrics?.steps ?? 0"
        :progress="{
          max: fakeAthleteData.stepGoal,
        }"
        :substats="[
          {
            icon: 'crown',
            description: 'Rekord',
            value: fakeAthleteData.stepRecord,
          },
          {
            icon: 'distance',
            description: 'Distanz',
            value: distance,
          },
          {
            icon: 'elevation',
            description: 'Höhe',
            value: elevation,
          },
          {
            icon: 'metronome',
            description: 'Frequenz',
            value: '1.3 Hz',
          },
        ]"
      >
        <template v-slot:metricExtra>
          <span class="stepsInfo">
            {{ fakeAthleteData.stepGoal - (athleteMetrics?.steps ?? 0) }} übrig
          </span>
        </template>
      </MetricCard>
      <MetricCard
        class="card"
        header="Herzfrequenz"
        icon="heartRate"
        unit="bpm"
        :liveMetric="athleteMetrics?.heartRate ?? 0"
        :progress="{
          max: 250,
          colour: heartRateIntensity.colour,
        }"
        :substats="[
          {
            description: 'Minimum',
            value: stats?.heartRate.min ?? 0,
            withUnit: true,
          },
          {
            description: 'Durchschnitt',
            value: stats?.heartRate.avg ?? 0,
            withUnit: true,
          },
          {
            description: 'Maximum',
            value: stats?.heartRate.max ?? 0,
            withUnit: true,
          },
        ]"
      >
        <template v-slot:metricExtra>
          <div class="heartRateIndicator">
            <Icon
              icon="heart"
              size="m"
              :colour="heartRateIntensity.colour"
              :class="{
                hrIcon: true,
                [heartRateIntensity.class]: true,
              }"
            ></Icon>
            <span>{{ heartRateIntensity.text }}</span>
          </div>
        </template>
      </MetricCard>
      <MetricCard
        class="card"
        header="Geschwindigkeit"
        icon="speed"
        unit="MPH"
        :liveMetric="athleteMetrics?.speed ?? 0"
        :progress="{
          max: 30,
        }"
        :substats="[
          {
            icon: 'crown',
            description: 'Rekord',
            withUnit: true,
            value: fakeAthleteData.speedRecord,
          },
          {
            description: 'Durchschnitt',
            value: stats?.heartRate.avg ?? 0,
            withUnit: true,
          },
          {
            description: 'Maximum',
            value: stats?.heartRate.max ?? 0,
            withUnit: true,
          },
        ]"
      ></MetricCard>
    </div>
  </div>
</template>

<style scoped>
.container {
  --image-dim: 130px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 1rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    height: calc(var(--image-dim) * 0.75);
    width: 100%;
    background-color: var(--c-accent);
  }
}

.profile {
  width: var(--image-dim);
  aspect-ratio: 1;
  border-radius: 50%;
  z-index: 1;
  background-color: var(--c-accent-bright);
}

.names {
  margin-bottom: 1rem;

  .bigName {
    font-size: 2rem;
    margin-right: 0.5rem;
    font-weight: bold;
  }

  .smallName {
    font-size: 1.2rem;
  }
}

.metricCards {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  row-gap: 1.5rem;
  padding: 0.5rem;
}

.stepsInfo {
  color: var(--c-extra-message);
  font-size: 0.9rem;
  font-weight: 600;
}

.heartRateIndicator {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.hrIcon {
  animation-name: pulsate;
  animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.335);
  animation-iteration-count: infinite;
}
.hr--low {
  animation-duration: 1.2s;
}
.hr--normal {
  animation-duration: 1s;
}
.hr--elevated {
  animation-duration: 0.8s;
}
.hr--high {
  animation-duration: 0.5s;
}

@keyframes pulsate {
  from {
    scale: 1;
  }
  to {
    scale: 1.3;
  }
}

@media screen and (min-width: 425) {
  .metricCards {
    padding: 1rem;
  }
}

@media screen and (min-width: 768px) {
  .metricCards {
    width: 100%;
    max-width: 800px;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
  }
}
</style>
