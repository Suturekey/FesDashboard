<script setup lang="ts">
import { onUnmounted } from "vue";
import { useAthleteStore } from "./stores/athleteStore";
import type { I_AthleteData } from "./../types";

const athleteStore = useAthleteStore();

const socket = new WebSocket("ws://ubuntu01.fes-sport.de:10001");

socket.addEventListener("message", (messageEvent) => {
  const athleteList: I_AthleteData[] = JSON.parse(messageEvent.data);
  athleteStore.replaceList(athleteList);
});

setTimeout(() => {
  socket.close();
}, 10000);

onUnmounted(() => socket.close());
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
