<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from "vue";
import { useAthleteStore } from "../stores/athleteStore";
import fakeData, { unknownAthlete } from "../data/fakeAthleteData";
import {
  Chart,
  Colors,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  type ChartOptions,
  Tooltip,
  type ChartDataset,
} from "chart.js";

const athleteStore = useAthleteStore();

const chartAthletes = new Map<string, boolean>();

const maxDisplayedMeasurements = 30;

const canvas = useTemplateRef("speed-canvas");
let speedChart: Chart;

function getFullFakeName(athleteId: string) {
  const fakeAthlete = fakeData[athleteId] || unknownAthlete;
  return `${fakeAthlete.firstName} ${fakeAthlete.lastName}`;
}

const chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      enabled: true,
      callbacks: {
        footer: (tooltipItems) =>
          getFullFakeName(tooltipItems[0].dataset.label!),
      },
    },
  },
};

function createDataset(athleteId: string, data: (number | null)[]) {
  chartAthletes.set(athleteId, true);
  return {
    label: athleteId,
    data: data,
  };
}

onMounted(() => {
  /* Setting the Chart properties */
  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Colors,
    Title,
    Tooltip
  );

  const labels = [];
  const datasets: ChartDataset[] = [];

  /* We are using the recorded data from athleteDatasets to set the intial datasets and labels for the chart.
  Without this data, we would have to start with an empty chart, when coming back from another page.*/
  athleteStore.athleteDatasets.forEach((dataset, athleteId) => {
    datasets.push(
      createDataset(athleteId, dataset.speed.slice(-maxDisplayedMeasurements))
    );
  });

  for (
    let i = Math.max(
      1,
      athleteStore.numMeasurements - maxDisplayedMeasurements
    );
    i <= athleteStore.numMeasurements;
    i++
  ) {
    labels.push(i);
  }

  speedChart = new Chart(canvas.value!, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: chartOptions,
  });
});

watch(
  () => athleteStore.athleteList,
  (newList) => {
    /* A change in the athleteList signals that new live data has arrived. We filter the new data for their athleteIds and speed values */
    const speedValues = newList.reduce((acc: Record<string, number>, cur) => {
      acc[cur.athleteId] = cur.metrics.speed;
      return acc;
    }, {});

    /* Add a new label to the chart and remove old labels when needed */
    if (speedChart.data.labels!.length >= maxDisplayedMeasurements) {
      speedChart.data.labels?.shift();
    }
    speedChart.data.labels?.push(athleteStore.numMeasurements + 1);

    /* Add new values from atheletes in the current batch of measurements to the chart */
    if (speedChart.data.datasets.length === 0) {
      speedChart.data.datasets = Object.entries(speedValues).map(
        ([athleteId, speedValue]) => createDataset(athleteId, [speedValue])
      );
    } else {
      speedChart.data.datasets.forEach((dataset) => {
        const newValue = speedValues[dataset.label!];
        if (dataset.data.length >= maxDisplayedMeasurements) {
          dataset.data.shift();
        }
        dataset.data.push(typeof newValue === "number" ? newValue : null);
      });
    }

    /* Add datasets of athletes that are not already part of the chart */
    Object.entries(speedValues).forEach(([athleteId, speedValue]) => {
      if (!chartAthletes.get(athleteId)) {
        const nullPadding = new Array(
          Math.min(athleteStore.numMeasurements, maxDisplayedMeasurements - 1)
        ).fill(null);
        createDataset(athleteId, [...nullPadding, speedValue]);
      }
    });

    speedChart.update();
  }
);
</script>

<template>
  <div class="chartContainer">
    <canvas
      ref="speed-canvas"
      style="max-width: 100%"
      role="img"
      :aria-label="`Ein Liniengraph, der live die gemessenen Geschwindigkeiten der Athleten auf dieser Seite anzeigt. Die letzten ${maxDisplayedMeasurements} Messungen werden hier dargestellt.`"
    >
      <p>Dieser Graph kann nicht angezeigt werden</p>
    </canvas>
  </div>
</template>
