# International Soccer Tournament Group Sort

A script to handle sorting standings for international soccer tournaments given a set of results.

## Usage

Two options for running:

1. `node build/index.js --source <CSV file path>` to run on any set of matches given in the CSV. The CSV should have 4 columns with each row including the result from one match in the following format:

| Team 1 Name | Team 1 Score | Team 2 Name | Team 2 Score |
| ----------- | ------------ | ----------- | ------------ |

2. `node build/index.js --sampleIndex 0` to run on one of two sample match sets.

There is a different set of tiebreakers used for World Cup and Euro tournaments. The default for the script is for the World Cup, but the `--useEuroTiebreakers` flag can be supplied to switch to Euro tiebreakers.

[World Cup tiebreaking rules](https://en.wikipedia.org/wiki/2022_FIFA_World_Cup#Tiebreakers)
[Euro tiebreaking rules](https://en.wikipedia.org/wiki/UEFA_Euro_2020#Tiebreakers)

## Options

- `--source` or `-s` _(optional)_: Path to CSV with set of match results. Optional, but script will fail if neither source or sampleIndex are supplied.
- `--sampleIndex` or `-i` _(optional)_: Either 0 or 1 to denote one of two sample set of match results to run script with. Optional, but script will fail if neither source or sampleIndex are supplied.
- `--useEuroTiebreakers`or `-u` _(optional)_: Run with this flag to use the Euro tiebreaking rules instead of World Cup.
