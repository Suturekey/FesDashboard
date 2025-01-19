<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from "vue";
import AthleteCard from "../components/AthleteCard.vue";
import { useAthleteStore } from "../stores/athleteStore";
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

function getSpeedDatasets() {
  return [...athleteStore.athleteDatasets.entries()].map((entry) => {
    return {
      label: entry[0],
      data: entry[1].speed,
    };
  });
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

  const datasets = getSpeedDatasets();

  speedChart = new Chart(canvas.value!, {
    type: "line",
    data: {
      labels: [...Array(60)].map((_, idx) => `-${idx}s`),
      datasets: datasets,
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
    <canvas ref="speed-canvas"></canvas>
    <div class="athleteList">
      <AthleteCard
        v-for="athlete in athleteStore.athleteList"
        :athlete="athlete"
        :stats="athleteStore.athleteAnalysis.get(athlete.athleteId)"
        @click="$router.push(`/athlete/${athlete.athleteId}`)"
      ></AthleteCard>
    </div>
  </div>
</template>

<style scoped>
.athleteList {
  display: grid;
  gap: 1em;
  padding: 1em;
  max-width: 600px;
}
</style>
