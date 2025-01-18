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

const canvas = useTemplateRef("speed-canvas");

const labels = [...Array(60)].map((_, idx) => `-${idx}s`);

let speedChart: Chart;

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
      labels: labels,
      datasets: [
        {
          label: "Something",
          data: [1, 2, 10],
        },
      ],
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

const athleteStore = useAthleteStore();

watch(
  () => athleteStore.athleteList,
  () => {
    speedChart.data.datasets.forEach((dataset) => {
      dataset.data.push(1);
    });
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
