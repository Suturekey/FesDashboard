<script setup lang="ts">
import Icon from "../components/Icon.vue";
import AthleteCard from "../components/AthleteCard.vue";
import { onMounted, useTemplateRef, watch } from "vue";
import { useAthleteStore } from "../stores/athleteStore";
import fakeData from "../data/fakeAthleteData";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
} from "chart.js";

const athleteStore = useAthleteStore();

const canvas = useTemplateRef("speed-canvas");
let speedChart: Chart;

function getFullFakeName(athleteId: string) {
  const fakeAthlete = fakeData[athleteId];
  return `${fakeAthlete.firstName} ${fakeAthlete.lastName}`;
}

onMounted(() => {
  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title
  );

  speedChart = new Chart(canvas.value!, {
    type: "line",
    data: {
      labels: [...Array(30)].map((_, idx) => `-${idx}s`),
      datasets: [...athleteStore.athleteDatasets.entries()].map((entry) => {
        return {
          label: entry[0],
          data: entry[1].speed,
        };
      }),
    },
    options: {
      responsive: true,
      scales: {
        x: {
          reverse: true,
        },
      },
    },
  });
});

watch(
  () => athleteStore.athleteList,
  () => {
    const speedValues = athleteStore.newSpeedValues;

    if (speedChart.data.datasets.length === 0) {
      speedChart.data.datasets = Object.entries(speedValues).map(
        ([athleteId, speedValue]) => {
          return {
            label: athleteId,
            data: [speedValue],
          };
        }
      );
    } else {
      speedChart.data.datasets.forEach((dataset) => {
        const newValue = speedValues[dataset.label!];
        dataset.data.push(newValue ? newValue : null);
      });
    }

    speedChart.update();
  }
);
</script>

<template>
  <div>
    <div class="chartContainer">
      <canvas ref="speed-canvas"></canvas>
    </div>
    <div
      v-if="athleteStore.speedRecord.recordValue > 0"
      class="athleteOfTheDay"
    >
      <span class="heading">Athlet des Tages</span>
      <span class="name">{{
        getFullFakeName(athleteStore.speedRecord.athleteId)
      }}</span>
      <span class="recordData">
        <span>
          <Icon icon="speed"></Icon>
          {{ athleteStore.speedRecord.recordValue }} MPH</span
        >
        <span>
          <Icon icon="clock"></Icon>
          {{
            athleteStore.speedRecord.timestamp.toLocaleTimeString("de-DE")
          }}</span
        >
      </span>
    </div>
    <div class="athleteList">
      <AthleteCard
        v-for="athlete in athleteStore.athleteList"
        :key="athlete.athleteId"
        :athlete="athlete"
        :stats="athleteStore.athleteAnalysis.get(athlete.athleteId)"
        :holds-record="athleteStore.speedRecord.athleteId === athlete.athleteId"
        @click="$router.push(`/athlete/${athlete.athleteId}`)"
      ></AthleteCard>
    </div>
  </div>
</template>

<style scoped>
.viewContainer {
  --padding: 1rem;
  padding: var(--padding);
  gap: 1rem;
  display: grid;
}

.chartContainer {
  max-width: 900px;
}

.athleteOfTheDay {
  justify-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(from #b38d1a r g b / 0.22);
  border: solid 2px rgb(172, 125, 6);
  border-radius: 9px;
  padding: 0.75rem;
  width: 100%;
  max-width: 450px;

  .heading {
    font-weight: 600;
    font-size: 0.8rem;
  }

  .name {
    font-size: 1.4rem;
    font-weight: 600;
    margin-block: 0.5rem;
  }

  .recordData {
    gap: 0.5rem;
    color: var(--c-text-gray);
    font-size: 0.9rem;
    display: flex;

    & > span {
      display: flex;
      gap: 0.25rem;
      align-items: center;
    }
  }
}

.athleteList {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

@media screen and (min-width: 425px) {
  .athleteList {
    gap: 1.5rem;
  }
}
</style>
