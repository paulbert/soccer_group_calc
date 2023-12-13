export type ResultRow = [string, number, string, number];

type Standing = {
  team: string;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export type Standings = Standing[];

type SortFunction = (a: Standing, b: Standing) => number;

const emptyStanding: (team: string) => Standing = (team) => {
  return {
    team,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  };
};

const isStanding = (standing: Standing | undefined): standing is Standing => {
  return !!standing;
};

const addResultToStanding = (
  goalsFor: number,
  goalsAgainst: number,
  standing: Standing
) => {
  const resultWDLAndPoints =
    goalsFor > goalsAgainst
      ? { wins: standing.wins + 1, points: standing.points + 3 }
      : goalsFor === goalsAgainst
      ? { draws: standing.draws + 1, points: standing.points + 1 }
      : { losses: standing.losses + 1 };
  const newStanding: Standing = {
    ...standing,
    ...resultWDLAndPoints,
    goalsFor: standing.goalsFor + goalsFor,
    goalsAgainst: standing.goalsAgainst + goalsAgainst,
  };
  return newStanding;
};

const addResultToStandings = (
  [team1, team1Goals, team2, team2Goals]: ResultRow,
  standings: Standings
) => {
  return standings.map((standing) => {
    const { team } = standing;
    return team === team1
      ? addResultToStanding(team1Goals, team2Goals, standing)
      : team === team2
      ? addResultToStanding(team2Goals, team1Goals, standing)
      : standing;
  });
};

const calculateHeadToHeadStandings = (
  standings: Standings,
  results: ResultRow[]
) => {
  return calculateStandings(
    results.filter(([team1, team1Goals, team2, team2Goals]) => {
      return (
        standings.some(({ team }) => team === team1) &&
        standings.some(({ team }) => team === team2)
      );
    })
  );
};

const calculateStandings = (results: ResultRow[]) => {
  const emptyStandings = results.reduce((standings: Standings, result) => {
    const isTeamMissing = (team: string) =>
      standings.every(({ team: t }) => t !== team);
    return [
      ...standings,
      isTeamMissing(result[0]) ? emptyStanding(result[0]) : undefined,
      isTeamMissing(result[2]) ? emptyStanding(result[2]) : undefined,
    ].filter(isStanding);
  }, []);
  return results.reduce((standings: Standings, result) => {
    return addResultToStandings(result, standings);
  }, emptyStandings);
};

const sortFunctions = {
  points: (a: Standing, b: Standing) => b.points - a.points,
  goalsFor: (a: Standing, b: Standing) => b.goalsFor - a.goalsFor,
  goalDifference: (a: Standing, b: Standing) =>
    b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst),
};

const worldCupSortInstructions = [
  { sort: sortFunctions.points, useAll: true },
  { sort: sortFunctions.goalDifference, useAll: true },
  { sort: sortFunctions.goalsFor, useAll: true },
  { sort: sortFunctions.points, useAll: false },
  { sort: sortFunctions.goalDifference, useAll: false },
  { sort: sortFunctions.goalsFor, useAll: false },
];

const euroSortInstructions = [
  { sort: sortFunctions.points, useAll: true },
  { sort: sortFunctions.points, useAll: false },
  { sort: sortFunctions.goalDifference, useAll: false },
  { sort: sortFunctions.goalsFor, useAll: false },
  { sort: sortFunctions.goalDifference, useAll: true },
  { sort: sortFunctions.goalsFor, useAll: true },
];

const sortChunk = (standings: Standings, sortFunction: SortFunction) => {
  return standings
    .sort(sortFunction)
    .map(({ team }) => standings.find(({ team: t }) => team === t))
    .filter(isStanding);
};

const rechunkStandings =
  (sortFunction: SortFunction, fullStandings: Standings) =>
  (
    newStandingChunk: Standings[],
    standing: Standing,
    index: number,
    standings: Standing[]
  ) => {
    const fullStanding =
      fullStandings.find(({ team }) => team === standing.team) || standing;
    if (index === 0 || sortFunction(standings[index - 1], standing) !== 0) {
      return [...newStandingChunk, [fullStanding]];
    }
    return [
      ...newStandingChunk.slice(0, -1),
      [...newStandingChunk.slice(-1).flat(), fullStanding],
    ];
  };

const sortStandings = (
  standingChunks: Standings[],
  results: ResultRow[],
  sortInstructions: {
    sort: SortFunction;
    useAll: boolean;
  }[],
  sortIndex = 0
): Standings[] => {
  console.log(sortIndex);
  const { sort: sortFunction, useAll } = sortInstructions[sortIndex];
  const rechunkedStandings = standingChunks
    .map((standings) => {
      const standingsForSort = useAll
        ? standings
        : calculateHeadToHeadStandings(standings, results);
      const sortedStandings =
        standings.length > 1
          ? sortChunk(standingsForSort, sortFunction)
          : standings;
      return sortedStandings.reduce(
        rechunkStandings(sortFunction, standings),
        []
      );
    })
    .flat();
  if (rechunkedStandings.some((standings) => standings.length > 1)) {
    return sortStandings(
      rechunkedStandings,
      results,
      sortInstructions,
      sortIndex + 1
    );
  }
  return rechunkedStandings;
};

export function sortResults(results: ResultRow[]) {
  const unsortedStandings = calculateStandings(results);
  return sortStandings([unsortedStandings], results, euroSortInstructions);
}
