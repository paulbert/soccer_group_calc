"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatStandings = void 0;
const reduceToTableRow = (h, heading, index) => {
    const spaces = index === 0 ? 25 : 5;
    return h + heading + " ".repeat(spaces - heading.length);
};
function formatStandings(standings) {
    const headings = ["Team", "W", "D", "L", "GF", "GA", "GD", "Pts"];
    const header = headings.reduce(reduceToTableRow, "");
    return (header +
        standings
            .map(({ team, wins, draws, losses, goalsFor, goalsAgainst, points }) => {
            const goalDifference = goalsFor - goalsAgainst;
            const goalDifferenceString = (goalDifference > 0 ? "+" : "") + goalDifference;
            return [
                team,
                wins,
                draws,
                losses,
                goalsFor,
                goalsAgainst,
                goalDifferenceString,
                points,
            ].map((value) => value.toString());
        })
            .reduce((table, standing) => {
            return table + "\n" + standing.reduce(reduceToTableRow, "");
        }, ""));
}
exports.formatStandings = formatStandings;
