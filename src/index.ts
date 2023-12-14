import { parse } from "ts-command-line-args";

import { formatStandings } from "./formatStandings";
import { sortResults, ResultRow } from "./sortResults";

interface SoccerGroupCalcArguments {
  source?: string;
  sampleIndex?: number;
  useEuroTiebreakers: boolean;
  help?: boolean;
}

const args = parse<SoccerGroupCalcArguments>(
  {
    source: {
      type: String,
      alias: "s",
      optional: true,
      description: "Set source file with results",
    },
    sampleIndex: {
      type: Number,
      alias: "i",
      optional: true,
      description:
        "Alternative to source file, use one of two sample data sets\n- 0 = Euro 2016 Group E\n- 1 = World Cup 2022 Group C",
    },
    useEuroTiebreakers: {
      alias: "u",
      type: Boolean,
      description:
        "If set will use tiebreaker rules for Euros, otherwise will use tiebreaker rules for World Cup",
    },
    help: {
      alias: "h",
      type: Boolean,
      optional: true,
      description: "Prints usage guide",
    },
  },
  { helpArg: "help" }
);

const { sampleIndex, source, useEuroTiebreakers } = args;

if (sampleIndex === undefined && !source) {
  throw new Error("File source or index for sample data set required");
}

if (!source && sampleIndex && sampleIndex < 0 && sampleIndex > 1) {
  throw new Error("sampleIndex must be 0 or 1");
}

const sampleResults: ResultRow[][] = [
  [
    ["Republic of Ireland", 1, "Sweden", 1],
    ["Belgium", 0, "Italy", 2],
    ["Italy", 1, "Sweden", 0],
    ["Belgium", 3, "Republic of Ireland", 0],
    ["Italy", 0, "Republic of Ireland", 1],
    ["Sweden", 0, "Belgium", 1],
  ],
  [
    ["Argentina", 1, "Saudi Arabia", 2],
    ["Mexico", 0, "Poland", 0],
    ["Poland", 2, "Saudi Arabia", 0],
    ["Argentina", 2, "Mexico", 0],
    ["Poland", 0, "Argentina", 2],
    ["Saudi Arabia", 1, "Mexico", 2],
  ],
];

const parseResultsFile = (src: string) => {
  return sampleResults[0];
};

const results = source
  ? parseResultsFile(source)
  : sampleResults[sampleIndex || 0];

const sortedResults = sortResults(results, useEuroTiebreakers);

console.log(formatStandings(sortedResults.flat()));
