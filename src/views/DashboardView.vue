<script setup lang="ts">
import AthleteCard from "../components/AthleteCard.vue";

import { useAthleteStore } from "../stores/athleteStore";

const athleteStore = useAthleteStore();
</script>

<template>
  <div>
    <div class="athleteList">
      <AthleteCard
        v-for="athlete in athleteStore.athleteList"
        :athlete="athlete"
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
