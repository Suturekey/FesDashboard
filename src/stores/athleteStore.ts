import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { round } from "../utils";
import type { I_AthleteStats, I_AthleteData } from "../../types";
import type { Ref, Reactive } from "vue";

interface I_AthleteDataset {
  heartRate: (number | null)[];
  speed: (number | null)[];
}

interface I_SpeedRecord {
  athleteId: string;
  recordValue: number;
  timestamp: Date;
}

/**
 * Calculates a new average given a new value and rounds them to the specified number of decimal places
 * @param prevAverage The previous average value
 * @param numMeasurements The NEW number of measurements
 * @param newValue The new value
 * @param decimalPlaces The number of decimal places
 * @returns the new average
 */
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

/**
 * Performs an analysis of the athlete's speed and heartrate and stores the results (min, max, average)
 * in the analysis map to be displayed as stats. Also updates the speed record if applicable
 * @param analysisMap A reference to the store's analysis map
 * @param speedRecord A reference to the store's current speed record
 * @param athleteData A given athlete's data
 */
function analyseCurrentAthleteData(
  analysisMap: Reactive<Map<string, I_AthleteStats>>,
  speedRecord: Ref<I_SpeedRecord>,
  athleteData: I_AthleteData
) {
  const curHeartRate = athleteData.metrics.heartRate;
  const curSpeed = athleteData.metrics.speed;

  if (!analysisMap.has(athleteData.athleteId)) {
    // Initialize map entry
    analysisMap.set(athleteData.athleteId, {
      numMeasurements: 1,
      heartRate: {
        min: curHeartRate,
        avg: curHeartRate,
        max: curHeartRate,
      },
      speed: {
        // No min speed because its value would be 0 realistically
        avg: curSpeed,
        max: curSpeed,
      },
    });
    return;
  }

  const data = analysisMap.get(athleteData.athleteId);

  data!.numMeasurements++;

  if (curHeartRate < data!.heartRate.min) {
    data!.heartRate.min = curHeartRate;
  } else if (curHeartRate > data!.heartRate.max) {
    data!.heartRate.max = curHeartRate;
  }

  if (curSpeed > data!.speed.max) {
    data!.speed.max = curSpeed;

    if (curSpeed > speedRecord.value.recordValue) {
      speedRecord.value = {
        athleteId: athleteData.athleteId,
        recordValue: curSpeed,
        timestamp: new Date(athleteData.timestamp),
      };
    }
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
}

export const useAthleteStore = defineStore("athlete", () => {
  const athleteList: Ref<I_AthleteData[]> = ref([]);
  const athleteAnalysis = reactive(new Map<string, I_AthleteStats>());
  const athleteDatasets = reactive(new Map<string, I_AthleteDataset>());
  const speedRecord: Ref<I_SpeedRecord> = ref({
    athleteId: "",
    recordValue: 0,
    timestamp: new Date(),
  }); // Athlete with the highest max speed measured (should be initialized using previous data if possible)
  const numMeasurements = ref(0);

  /* Returns an object with athleteIds and their speed value from the last batch of data */
  const newSpeedValues = computed(() => {
    return athleteList.value.reduce((acc: Record<string, number>, cur) => {
      acc[cur.athleteId] = cur.metrics.speed;
      return acc;
    }, {});
  });

  function replaceList(newList: I_AthleteData[]) {
    const athleteIds = new Map();

    newList.forEach((curData) => {
      /* Add analysis data to analysis map for display on cards */
      analyseCurrentAthleteData(athleteAnalysis, speedRecord, curData);

      /* Add live values to dataset map for display in graphs */
      athleteIds.set(curData.athleteId, true);

      if (!athleteDatasets.get(curData.athleteId)) {
        athleteDatasets.set(curData.athleteId, {
          heartRate: [curData.metrics.heartRate],
          speed: [curData.metrics.speed],
        });
        return;
      }

      const dataset = athleteDatasets.get(curData.athleteId);
      dataset!.heartRate.push(curData.metrics.heartRate);
      dataset!.speed.push(curData.metrics.speed);
    });

    /* Ensure that athletes that were measured before but not this time receive a
    null value in the dataset. This allows the graph to display a break */
    athleteDatasets.forEach((dataset, athleteId) => {
      if (!athleteIds.get(athleteId)) {
        dataset.heartRate.push(null);
        dataset.speed.push(null);
      }
    });

    athleteList.value = newList;
    numMeasurements.value++;
  }

  return {
    athleteList,
    athleteAnalysis,
    athleteDatasets,
    speedRecord,
    newSpeedValues,
    numMeasurements,
    replaceList,
  };
});
