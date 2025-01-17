import { defineStore } from "pinia";
import { ref } from "vue";
import type { I_AthleteData } from "../../types";
import type { Ref } from "vue";

export const useAthleteStore = defineStore("athlete", () => {
  const athleteList: Ref<I_AthleteData[]> = ref([]);
  function replaceList(newList: I_AthleteData[]) {
    athleteList.value = newList;
  }

  return {
    athleteList,
    replaceList,
  };
});
