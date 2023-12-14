import { Standings } from "./sortResults.js";

const reduceToTableRow = (h: string, heading: string, index: number) => {
  const spaces = index === 0 ? 25 : 5;
  return h + heading + " ".repeat(spaces - heading.length);
};

export function formatStandings(standings: Standings) {
  const headings = ["Team", "W", "D", "L", "GF", "GA", "GD", "Pts"];

  const header = headings.reduce(reduceToTableRow, "");

  return (
    header +
    standings
      .map(({ team, wins, draws, losses, goalsFor, goalsAgainst, points }) => {
        const goalDifference = goalsFor - goalsAgainst;
        const goalDifferenceString =
          (goalDifference > 0 ? "+" : "") + goalDifference;
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
      }, "")
  );
}
