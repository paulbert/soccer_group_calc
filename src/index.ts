import { sortResults, ResultRow } from "./sortResults";

// const sampleResults: ResultRow[] = [
//   ["Argentina", 1, "Saudi Arabia", 2],
//   ["Mexico", 0, "Poland", 0],
//   ["Poland", 2, "Saudi Arabia", 0],
//   ["Argentina", 2, "Mexico", 0],
//   ["Poland", 0, "Argentina", 2],
//   ["Saudi Arabia", 1, "Mexico", 2],
// ];

const sampleResults: ResultRow[] = [
  ["Republic of Ireland", 1, "Sweden", 1],
  ["Belgium", 0, "Italy", 2],
  ["Italy", 1, "Sweden", 0],
  ["Belgium", 3, "Republic of Ireland", 0],
  ["Italy", 0, "Republic of Ireland", 1],
  ["Sweden", 0, "Belgium", 1],
];

console.log(sortResults(sampleResults));
