# International Soccer Tournament Group Sort

A script to handle sorting standings for international soccer tournaments given a set of results.

## Usage

Two options for running:

1. `node build/index.js --source <CSV file path>` to run on any set of matches given in the CSV. The CSV should have 4 columns with each row including the result from one match in the following format:

| Team 1 Name | Team 1 Score | Team 2 Name | Team 2 Score |
| ----------- | ------------ | ----------- | ------------ |

2. `node build/index.js --sampleIndex 0` to run on one of two sample match sets.

There is a different set of tiebreakers used for World Cup and Euro tournaments. The default for the script is for the World Cup, but the `--useEuroTiebreakers` flag can be supplied to switch to Euro tiebreakers.

## Options

- `--source` or `-s` _(optional)_: Path to CSV with set of match results. Optional, but script will fail if neither source or sampleIndex are supplied.
- `--sampleIndex` or `-i` _(optional)_: Either 0 or 1 to denote one of two sample set of match results to run script with. Optional, but script will fail if neither source or sampleIndex are supplied.
- `--useEuroTiebreakers`or `-u` _(optional)_: Run with this flag to use the Euro tiebreaking rules instead of World Cup.

## Notes

- These tournaments are usually organized into 4 team groups where the teams play each other once. The program is not limited to that, it'll take any number of games, run the calculations, and spit out the results.
- The Euro tiebreakers are not quite strictly followed. If there are three or more teams tied on points and steps 1 to 3 leads to breaking the tie for one or more but not all of those teams, the rules state steps 1 to 3 should be repeated for the remaining teams. This program just goes through step by step to keep it from getting too complicated and difficult to follow.

## Reference

- [World Cup tiebreaking rules](https://en.wikipedia.org/wiki/2022_FIFA_World_Cup#Tiebreakers)
- [Euro tiebreaking rules](https://en.wikipedia.org/wiki/UEFA_Euro_2020#Tiebreakers)
