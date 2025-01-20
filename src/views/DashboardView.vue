<script setup lang="ts">
import Icon from "../components/Icon.vue";
import AthleteCard from "../components/AthleteCard.vue";
import SpeedGraph from "../components/SpeedGraph.vue";
import { useAthleteStore } from "../stores/athleteStore";
import fakeData, { unknownAthlete } from "../data/fakeAthleteData";

const athleteStore = useAthleteStore();

function getFullFakeName(athleteId: string) {
  const fakeAthlete = fakeData[athleteId] || unknownAthlete;
  return `${fakeAthlete.firstName} ${fakeAthlete.lastName}`;
}
</script>

<template>
  <div class="viewContainer">
    <SpeedGraph class="chartContainer"></SpeedGraph>
    <div class="athleteRanking"></div>
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
      ></AthleteCard>
    </div>
  </div>
</template>

<style scoped>
.viewContainer {
  gap: 1rem;
  padding: 1rem;
  display: grid;
}

.chartContainer {
  justify-self: center;
  position: relative;
  width: clamp(300px, 100%, 700px);
  height: clamp(500px, 500px, 50%);
  margin-bottom: 2rem;
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
  margin-bottom: 1rem;

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

@media screen and (min-width: 1440px) {
  .viewContainer {
    padding-inline: 200px;
    grid-template-columns: auto auto;
    grid-template-rows: min-content 1fr;
  }

  .chartContainer {
    grid-column: 1/2;
    grid-row: 1/-1;
    align-self: center;
    width: clamp(300px, 100%, 1000px);
  }

  .athleteOfTheDay {
    grid-column: 2/-1;
    grid-row: 1;
  }

  .athleteList {
    grid-row: 2;
    grid-column: 2/-1;
    height: 80vh;
    overflow: auto;
    padding: 2rem;

    scrollbar-color: var(--c-accent) var(--c-bg-gray);
    scrollbar-width: thin;
  }
}
</style>
