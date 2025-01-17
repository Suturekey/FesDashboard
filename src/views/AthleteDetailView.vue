<script setup lang="ts">
import Icon from "../components/Icon.vue";
import MetricCard from "../components/MetricCard.vue";
import type { I_FakeAthleteData } from "../../types";
import { useAthleteStore } from "../stores/athleteStore";
import fakeData from "../data/fakeAthleteData";
import { ref, computed, type Ref } from "vue";

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

const imageUrl = computed(
  () => new URL(`/src/data/images/${props.id}.jpg`, import.meta.url).href
);

function inRange(
  value: number | undefined,
  rangeStart: number,
  rangeEnd: number
) {
  if (!value) value = 0;
  return value >= rangeStart && value <= rangeEnd;
}

const cardDisplayData = {
  steps: {
    header: "Schritte",
    icon: "steps",
    unit: "Schritte",
    progressMax: fakeAthleteData.value.stepGoal,
    subStats: [
      {
        icon: "crown",
        title: "Rekord",
        value: fakeAthleteData.value.stepRecord,
      },
      {
        icon: "distance",
        title: "Distanz",
        value: "6.03 km",
      },
      {
        icon: "elevation",
        title: "Höhe",
        value: "150 m",
      },
      {
        icon: "crown",
        title: "Frequenz",
        value: "1.3 Hz",
      },
    ],
  },
  heartRate: {
    header: "Schritte",
    icon: "steps",
    unit: "bpm",
    progressMax: fakeAthleteData.value.stepGoal,
    subStats: [
      {
        title: "Minimum",
        value: 20,
        withUnit: true,
      },
      {
        title: "Durchschnitt",
        value: 89,
        withUnit: true,
      },
      {
        title: "Maximum",
        value: 150,
        withUnit: true,
      },
    ],
  },
  speed: {
    header: "Geschwindigkeit",
    icon: "steps",
    unit: "mph",
    progressMax: fakeAthleteData.value.stepGoal,
    subStats: [
      {
        icon: "crown",
        title: "Rekord",
        value: 25,
        withUnit: true,
      },
      {
        title: "Durchschnitt",
        value: 21,
        withUnit: true,
      },
      {
        title: "Maximum",
        value: 23,
        withUnit: true,
      },
    ],
  },
};
</script>

<template>
  <div class="container">
    <img
      class="profile"
      :src="imageUrl"
      :alt="`Portrait of ${fakeAthleteData?.firstName} ${fakeAthleteData?.lastName}`"
    />
    <div class="names">
      <span class="bigName">{{ fakeAthleteData.lastName }}</span>
      <span class="smallName">{{ fakeAthleteData.firstName }}</span>
    </div>
    <MetricCard
      header="Scritte"
      icon="steps"
      unit="Schritte"
      :liveMetric="athlete?.steps ?? 0"
      :progressMax="fakeAthleteData.stepGoal"
    >
      <template v-slot:metricExtra>
        <span>
          {{ fakeAthleteData.stepGoal - (athlete?.steps ?? 0) }} übrig
        </span>
      </template>
    </MetricCard>
    <MetricCard
      header="Herzfrequenz"
      icon="heartRate"
      unit="BPM"
      :liveMetric="athlete?.heartRate ?? 0"
      :progressMax="fakeAthleteData.stepGoal"
    >
      <template v-slot:metricExtra>
        <div>
          <Icon icon="heart" size="m"></Icon>
          <span v-if="inRange(athlete?.heartRate, 0, 59)">Niedrig</span>
          <span v-else-if="inRange(athlete?.heartRate, 60, 100)">Normal</span>
          <span v-else-if="inRange(athlete?.heartRate, 101, 180)">Erhöht</span>
          <span v-else>Sehr Hoch</span>
        </div>
      </template>
    </MetricCard>
    <MetricCard
      header="Geschwindigkeit"
      icon="speed"
      unit="MPH"
      :liveMetric="athlete?.speed ?? 0"
      :progressMax="fakeAthleteData.stepGoal"
    ></MetricCard>
  </div>
</template>

<style scoped>
.container {
  --image-dim: 130px;
  display: grid;
  width: 100%;
  height: auto;
  padding: 1rem;
  justify-items: center;

  .profile {
    width: var(--image-dim);
    aspect-ratio: 1;
    border-radius: 50%;
  }
}

.names {
  .bigName {
    font-size: 2rem;
    margin-right: 0.5rem;
    font-weight: bold;
  }

  .smallName {
    font-size: 1.2rem;
  }
}
</style>
