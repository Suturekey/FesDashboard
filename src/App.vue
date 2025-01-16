<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import AthleteCard from "./components/AthleteCard.vue";

// const athleteList = ref([]);
// const socket = new WebSocket("ws://ubuntu01.fes-sport.de:10001");

// socket.addEventListener("message", (messageEvent) => {
//   athleteList.value = JSON.parse(messageEvent.data);
// });

// setTimeout(() => {
//   socket.close();
// }, 10000);

// onUnmounted(() => socket.close());

const fakeAthletes = [
  {
    athleteId: "athlete1",
    timestamp: "2025-01-10T16:23:21.836Z",
    metrics: {
      heartRate: 150,
      steps: 4266,
      speed: 3.21,
    },
  },
  {
    athleteId: "athlete2",
    timestamp: "2025-01-10T16:23:21.836Z",
    metrics: {
      heartRate: 150,
      steps: 560,
      speed: 3.21,
    },
  },
  {
    athleteId: "athlete3",
    timestamp: "2025-01-10T16:23:21.836Z",
    metrics: {
      heartRate: 144,
      steps: 4100,
      speed: 3,
    },
  },
  {
    athleteId: "athlete4",
    timestamp: "2025-01-10T16:23:21.836Z",
    metrics: {
      heartRate: 146,
      steps: 1312,
      speed: 3.07,
    },
  },
  {
    athleteId: "athlete5",
    timestamp: "2025-01-10T16:23:21.836Z",
    metrics: {
      heartRate: 84,
      steps: 366,
      speed: 0.86,
    },
  },
  {
    athleteId: "athlete6",
    timestamp: "2025-01-10T16:23:21.836Z",
    metrics: {
      heartRate: 125,
      steps: 3431,
      speed: 2.32,
    },
  },
  {
    athleteId: "athlete7",
    timestamp: "2025-01-10T16:23:21.836Z",
    metrics: {
      heartRate: 118,
      steps: 3612,
      speed: 2.07,
    },
  },
  {
    athleteId: "athlete8",
    timestamp: "2025-01-10T16:23:21.836Z",
    metrics: {
      heartRate: 107,
      steps: 1764,
      speed: 1.68,
    },
  },
  {
    athleteId: "athlete9",
    timestamp: "2025-01-10T16:23:21.836Z",
    metrics: {
      heartRate: 79,
      steps: 460,
      speed: 0.68,
    },
  },
  {
    athleteId: "athlete10",
    timestamp: "2025-01-10T16:23:21.836Z",
    metrics: {
      heartRate: 89,
      steps: 6566,
      speed: 1.04,
    },
  },
];
</script>

<template>
  <div>
    <div class="athleteList">
      <AthleteCard
        v-for="athlete in fakeAthletes"
        :athlete="athlete"
      ></AthleteCard>
    </div>
  </div>
</template>

<style scoped>
.athleteList {
  display: grid;
  gap: 1em;
  padding: 1em;
}
</style>
