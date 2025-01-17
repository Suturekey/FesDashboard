import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { round } from "../utils";
import type { I_AthleteStats, I_AthleteData } from "../../types";
import type { Ref } from "vue";

function getRoundedAverage(
  prevAverage: number,
  numMeasurements: number,
  newValue: number,
  decimalPlaces: number
) {
  const newAverage =
    (prevAverage * (numMeasurements - 1) + newValue) / numMeasurements;
  return round(newAverage, decimalPlaces);
}

export const useAthleteStore = defineStore("athlete", () => {
  const athleteList: Ref<I_AthleteData[]> = ref([]);
  const athleteStats = reactive(new Map<string, I_AthleteStats>());

  function replaceList(newList: I_AthleteData[]) {
    athleteList.value = newList;

    newList.forEach((curData) => {
      const curHeartRate = curData.metrics.heartRate;
      const curSpeed = curData.metrics.speed;

      if (!athleteStats.has(curData.athleteId)) {
        athleteStats.set(curData.athleteId, {
          numMeasurements: 1,
          heartRate: {
            min: curHeartRate,
            avg: curHeartRate,
            max: curHeartRate,
          },
          speed: {
            avg: curSpeed,
            max: curSpeed,
          },
        });
        return;
      }

      const data = athleteStats.get(curData.athleteId);

      data!.numMeasurements++;

      if (curHeartRate < data!.heartRate.min) {
        data!.heartRate.min = curHeartRate;
      } else if (curHeartRate > data!.heartRate.max) {
        data!.heartRate.max = curHeartRate;
      }

      if (curSpeed > data!.speed.max) {
        data!.speed.max = curSpeed;
      }

      data!.heartRate.avg = getRoundedAverage(
        data!.heartRate.avg,
        data!.numMeasurements,
        curHeartRate,
        0
      );
      data!.speed.avg = getRoundedAverage(
        data!.speed.avg,
        data!.numMeasurements,
        curSpeed,
        2
      );
    });
  }

  return {
    athleteList,
    replaceList,
    athleteMap: athleteStats,
  };
});
