"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatStandings_1 = require("./formatStandings");
const sortResults_1 = require("./sortResults");
// const sampleResults: ResultRow[] = [
//   ["Argentina", 1, "Saudi Arabia", 2],
//   ["Mexico", 0, "Poland", 0],
//   ["Poland", 2, "Saudi Arabia", 0],
//   ["Argentina", 2, "Mexico", 0],
//   ["Poland", 0, "Argentina", 2],
//   ["Saudi Arabia", 1, "Mexico", 2],
// ];
const sampleResults = [
    ["Republic of Ireland", 1, "Sweden", 1],
    ["Belgium", 0, "Italy", 2],
    ["Italy", 1, "Sweden", 0],
    ["Belgium", 3, "Republic of Ireland", 0],
    ["Italy", 0, "Republic of Ireland", 1],
    ["Sweden", 0, "Belgium", 1],
];
const sortedResults = (0, sortResults_1.sortResults)(sampleResults);
console.log((0, formatStandings_1.formatStandings)(sortedResults.flat()));
