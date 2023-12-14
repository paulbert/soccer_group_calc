import { parse } from "ts-command-line-args";
import { promises as fs } from "fs";
import { parse as csvParse } from "csv-parse/sync";
import { formatStandings } from "./formatStandings.js";
import { sortResults } from "./sortResults.js";
const args = parse({
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
        description: "Alternative to source file, use one of two sample data sets\n- 0 = Euro 2016 Group E\n- 1 = World Cup 2022 Group C",
    },
    useEuroTiebreakers: {
        alias: "u",
        type: Boolean,
        description: "If set will use tiebreaker rules for Euros, otherwise will use tiebreaker rules for World Cup",
    },
    help: {
        alias: "h",
        type: Boolean,
        optional: true,
        description: "Prints usage guide",
    },
}, { helpArg: "help" });
const { sampleIndex, source, useEuroTiebreakers } = args;
if (sampleIndex === undefined && !source) {
    throw new Error("File source or index for sample data set required");
}
if (!source && sampleIndex && sampleIndex < 0 && sampleIndex > 1) {
    throw new Error("sampleIndex must be 0 or 1");
}
const sampleResults = [
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
const formatError = (additionalMessage) => {
    throw new Error(`Results should be in format of:\n\nTeam 1 | Team 1 Score | Team 2 | Team 2 Score\n\n${additionalMessage}`);
};
const validateScores = (scoreStrings) => {
    return scoreStrings.map((scoreString) => {
        const score = parseInt(scoreString);
        if (isNaN(score)) {
            formatError("Scores should be valid numbers");
        }
        if (score < 0) {
            throw new Error("Team scores should not be negative numbers");
        }
        if (parseInt(scoreString) !== parseFloat(scoreString)) {
            console.warn("Some scores provided were not whole numbers. Proceeding with rounded numbers...");
        }
        return score;
    });
};
const parseResultsFile = async (src) => {
    const rawResults = await fs.readFile(src);
    return csvParse(rawResults).map((row) => {
        if (row.length < 4) {
            formatError("Fewer than four values for results");
        }
        const [team1, team1GoalsString, team2, team2GoalsString, ...rest] = row;
        if (rest.length > 0) {
            console.warn("More than four columns in result input row. Ignoring columns beyond four...");
        }
        const [team1Goals, team2Goals] = validateScores([
            team1GoalsString,
            team2GoalsString,
        ]);
        return [team1, team1Goals, team2, team2Goals];
    });
};
const results = source
    ? await parseResultsFile(source)
    : sampleResults[sampleIndex || 0];
console.log();
const sortedResults = sortResults(results, useEuroTiebreakers);
console.log(formatStandings(sortedResults.flat()));
