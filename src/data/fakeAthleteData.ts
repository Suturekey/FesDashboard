import type { I_FakeAthleteData } from "../../types";

const athletes: Record<string, Partial<I_FakeAthleteData>> = {
  athlete1: {
    firstName: "Chun Li",
    lastName: "Zhang",
  },
  athlete2: {
    firstName: "Samus",
    lastName: "Aran",
  },
  athlete3: {
    firstName: "Barret",
    lastName: "Wallace",
  },
  athlete4: {
    firstName: "Cloud",
    lastName: "Strife",
  },
  athlete5: {
    firstName: "Tifa",
    lastName: "Lockhart",
  },
  athlete6: {
    firstName: "Mac",
    lastName: "Little",
  },
  athlete7: {
    firstName: "Ryu",
    lastName: "Hoshi",
  },
  athlete8: {
    firstName: "Terry",
    lastName: "Bogard",
  },
  athlete9: {
    firstName: "Richter",
    lastName: "Belmont",
  },
  athlete10: {
    firstName: "Faith",
    lastName: "Connors",
  },
};

Object.values(athletes).forEach((athlete) => {
  athlete.stepGoal = 10000 + Math.floor(Math.random() * 100) * 100;
  athlete.stepRecord = 12000 + Math.floor(Math.random() * 1000);
  athlete.speedRecord = 20 + Math.floor(Math.random() * 10);
});

console.log(athletes);

export default athletes;
