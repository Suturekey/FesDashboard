<script setup lang="ts">
import { useAthleteStore } from "../stores/athleteStore";
import Icon from "../components/Icon.vue";
const props = defineProps<{
  id: string;
}>();

const athleteStore = useAthleteStore();

const athlete = athleteStore.athleteList.find(
  (athlete) => athlete.athleteId === props.id
);
</script>

<template>
  <div class="container">
    <div class="imagePlaceholder"></div>
    <div class="names">
      <span class="bigName">Zhang</span>
      <span class="smallName">Chun Li</span>
    </div>
    <div class="card">
      <div class="title">
        <Icon icon="walk" size="l"></Icon>
        <strong>Schritte</strong>
      </div>
      <div class="barContainer"></div>
      <div class="stats">
        <div class="mainStat"></div>
        <div class="subStats"></div>
      </div>
    </div>
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
}

.imagePlaceholder {
  width: var(--image-dim);
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: rgb(140, 25, 25);
}

.card {
  width: 100%;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: flex;
  flex-direction: column;

  .title {
    display: flex;
    align-items: center;
    gap: 0.2rem;

    strong {
      font-size: 0.8em;
    }
  }
}
</style>
