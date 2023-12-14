"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortResults = void 0;
const emptyStanding = (team) => {
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
const isStanding = (standing) => {
    return !!standing;
};
const addResultToStanding = (goalsFor, goalsAgainst, standing) => {
    const resultWDLAndPoints = goalsFor > goalsAgainst
        ? { wins: standing.wins + 1, points: standing.points + 3 }
        : goalsFor === goalsAgainst
            ? { draws: standing.draws + 1, points: standing.points + 1 }
            : { losses: standing.losses + 1 };
    const newStanding = Object.assign(Object.assign(Object.assign({}, standing), resultWDLAndPoints), { goalsFor: standing.goalsFor + goalsFor, goalsAgainst: standing.goalsAgainst + goalsAgainst });
    return newStanding;
};
const addResultToStandings = ([team1, team1Goals, team2, team2Goals], standings) => {
    return standings.map((standing) => {
        const { team } = standing;
        return team === team1
            ? addResultToStanding(team1Goals, team2Goals, standing)
            : team === team2
                ? addResultToStanding(team2Goals, team1Goals, standing)
                : standing;
    });
};
const calculateHeadToHeadStandings = (standings, results) => {
    return calculateStandings(results.filter(([team1, team1Goals, team2, team2Goals]) => {
        return (standings.some(({ team }) => team === team1) &&
            standings.some(({ team }) => team === team2));
    }));
};
const calculateStandings = (results) => {
    const emptyStandings = results.reduce((standings, result) => {
        const isTeamMissing = (team) => standings.every(({ team: t }) => t !== team);
        return [
            ...standings,
            isTeamMissing(result[0]) ? emptyStanding(result[0]) : undefined,
            isTeamMissing(result[2]) ? emptyStanding(result[2]) : undefined,
        ].filter(isStanding);
    }, []);
    return results.reduce((standings, result) => {
        return addResultToStandings(result, standings);
    }, emptyStandings);
};
const sortFunctions = {
    points: (a, b) => b.points - a.points,
    goalsFor: (a, b) => b.goalsFor - a.goalsFor,
    goalDifference: (a, b) => b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst),
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
const sortChunk = (standings, sortFunction) => {
    return standings
        .sort(sortFunction)
        .map(({ team }) => standings.find(({ team: t }) => team === t))
        .filter(isStanding);
};
const rechunkStandings = (sortFunction, fullStandings) => (newStandingChunk, standing, index, standings) => {
    const fullStanding = fullStandings.find(({ team }) => team === standing.team) || standing;
    if (index === 0 || sortFunction(standings[index - 1], standing) !== 0) {
        return [...newStandingChunk, [fullStanding]];
    }
    return [
        ...newStandingChunk.slice(0, -1),
        [...newStandingChunk.slice(-1).flat(), fullStanding],
    ];
};
const sortStandings = (standingChunks, results, sortInstructions, sortIndex = 0) => {
    console.log(sortIndex);
    const { sort: sortFunction, useAll } = sortInstructions[sortIndex];
    const rechunkedStandings = standingChunks
        .map((standings) => {
        const standingsForSort = useAll
            ? standings
            : calculateHeadToHeadStandings(standings, results);
        const sortedStandings = standings.length > 1
            ? sortChunk(standingsForSort, sortFunction)
            : standings;
        return sortedStandings.reduce(rechunkStandings(sortFunction, standings), []);
    })
        .flat();
    if (rechunkedStandings.some((standings) => standings.length > 1)) {
        return sortStandings(rechunkedStandings, results, sortInstructions, sortIndex + 1);
    }
    return rechunkedStandings;
};
function sortResults(results, useEuroTiebreakers) {
    const unsortedStandings = calculateStandings(results);
    return sortStandings([unsortedStandings], results, useEuroTiebreakers ? euroSortInstructions : worldCupSortInstructions);
}
exports.sortResults = sortResults;
