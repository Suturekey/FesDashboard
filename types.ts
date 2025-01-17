export interface I_AthleteData {
  athleteId: string;
  timestamp: string;
  metrics: {
    heartRate: number;
    steps: number;
    speed: number;
  };
}
