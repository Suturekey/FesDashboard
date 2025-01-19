<script setup lang="ts">
import Icon from "../components/Icon.vue";
import MetricCard from "../components/MetricCard.vue";
import type { I_FakeAthleteData } from "../../types";
import { useAthleteStore } from "../stores/athleteStore";
import { round } from "../utils";
import fakeData from "../data/fakeAthleteData";
import { ref, computed } from "vue";

const props = defineProps<{
  id: string;
}>();

const athleteStore = useAthleteStore();

const fakeAthleteData = ref();
fakeAthleteData.value = (fakeData as Record<string, I_FakeAthleteData>)[
  props.id
];

const athlete = computed(
  () =>
    athleteStore.athleteList.find((athlete) => athlete.athleteId === props.id)
      ?.metrics
);

const stats = computed(() => athleteStore.athleteAnalysis.get(props.id));

const imageUrl = computed(
  () => new URL(`/src/data/images/${props.id}.jpg`, import.meta.url).href
);

const distance = computed(
  () => `${round((athlete.value?.steps ?? 0) * 0.0003, 2)} km`
);

const elevation = computed(
  () => `${round((athlete.value?.steps ?? 0) * 0.002, 0)} m`
);

function inRange(
  value: number | undefined,
  rangeStart: number,
  rangeEnd: number
) {
  if (!value) value = 0;
  return value >= rangeStart && value <= rangeEnd;
}
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
        :liveMetric="athlete?.steps ?? 0"
        :progressMax="fakeAthleteData.stepGoal"
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
            {{ fakeAthleteData.stepGoal - (athlete?.steps ?? 0) }} übrig
          </span>
        </template>
      </MetricCard>
      <MetricCard
        class="card"
        header="Herzfrequenz"
        icon="heartRate"
        unit="bpm"
        :liveMetric="athlete?.heartRate ?? 0"
        :progressMax="250"
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
          <div>
            <Icon icon="heart" size="m"></Icon>
            <span v-if="inRange(athlete?.heartRate, 0, 59)">Niedrig</span>
            <span v-else-if="inRange(athlete?.heartRate, 60, 100)">Normal</span>
            <span v-else-if="inRange(athlete?.heartRate, 101, 180)"
              >Erhöht</span
            >
            <span v-else>Sehr Hoch</span>
          </div>
        </template>
      </MetricCard>
      <MetricCard
        class="card"
        header="Geschwindigkeit"
        icon="speed"
        unit="MPH"
        :liveMetric="athlete?.speed ?? 0"
        :progressMax="30"
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
