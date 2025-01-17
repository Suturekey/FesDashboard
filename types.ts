export interface I_AthleteData {
  athleteId: string;
  timestamp: string;
  metrics: {
    heartRate: number;
    steps: number;
    speed: number;
  };
}

export interface I_FakeAthleteData {
  firstName: string;
  lastName: string;
  stepGoal: number;
  stepRecord: number;
  speedRecord: number;
}
