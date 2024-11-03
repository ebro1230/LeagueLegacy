import { createRouter } from "next-connect";
import { NextResponse } from "next/server";
import bodyParser from "body-parser";
import bodyParserXml from "body-parser-xml";
import cors from "cors";
import { parseString } from "xml2js";

const handler = createRouter();
bodyParserXml(bodyParser);

// Attach bodyParser middleware
handler.use(
  cors({
    origin: "*", // Allow all origins
  })
);
handler.use(bodyParser.urlencoded({ extended: false }));
handler.use(bodyParser.json());
handler.use(bodyParser.xml());

handler.post(async (req) => {
  return req
    .json()
    .then(async (body) => {
      const accessToken = body.accessToken;
      const leagueKeys = body.leagueKeys;
      const date = new Date();
      const currentYear = date.getFullYear();
      let keys;
      let trends = [];
      let leagueTeams = [];
      let leagues = [];
      if (!Array.isArray(leagueKeys)) {
        keys = leagueKeys;
      } else {
        keys = leagueKeys.join(",");
      }
      const response = await fetch(
        `https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=${keys}/standings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        let error = new Error(
          `Request failed when requesting league data with status ${response.status}`
        );
        error.status = response.status; // Add status property
        console.error(
          `Request failed when requesting league data with status ${response.status}`
        );
        throw error;
      } else {
        const xml = await response.text();
        parseString(xml, (err, result) => {
          if (err) {
            console.error("Error parsing XML:", err);
            parsedData.error = `XML parsing error: ${err}`;
          } else {
            const league = result.fantasy_content.leagues[0].league;
            league.forEach((league) => {
              let leagueWeeks = "";
              let leagueWeeksArray = [];
              for (
                let i = Number(league.start_week[0]);
                i < Number(league.end_week) + 1;
                i++
              ) {
                leagueWeeks = leagueWeeks + i.toString() + ",";
                leagueWeeksArray.push(i);
              }
              leagues.push({
                key: league.league_key[0],
                season: league.season[0],
                weekStart: Number(league.start_week[0]),
                weekEnd: Number(league.end_week[0]),
                leagueWeeks: leagueWeeks,
                leagueWeeksArray: leagueWeeksArray,
              });
            });
            const singleLeagueAllSeasons2 = league.map((season) => {
              let leagueWeeksArray = [];
              for (
                let i = Number(season.start_week[0]);
                i < Number(season.end_week) + 1;
                i++
              ) {
                leagueWeeksArray.push(i);
              }
              return {
                key: season.league_key[0],
                id: season.league_id[0],
                logo: season.logo_url[0],
                name: season.name[0],
                season: season.season[0],
                leagueWeeks: leagueWeeksArray,
                startDate: season.start_date[0],
                endDate: season.end_date[0],
                teams: season.standings[0].teams[0].team.map((team) => {
                  return {
                    key: team.team_key[0],
                    id: team.team_id[0],
                    logo:
                      team.team_logos[0].team_logo[0].url[0] != "--hidden--"
                        ? team.team_logos[0].team_logo[0].url[0]
                        : "",
                    name: team.name[0],
                    managerName:
                      team.managers[0].manager[0].nickname[0] != "--hidden--"
                        ? team.managers[0].manager[0].nickname[0]
                        : "Unknown",
                    managerId: team.managers[0].manager[0].guid[0],
                    pointsFor: Number(
                      Number(team.team_standings[0].points_for[0]).toFixed(2)
                    ),
                    pointsAgainst: Number(
                      Number(team.team_standings[0].points_against[0]).toFixed(
                        2
                      )
                    ),
                    rank: {
                      seasonKey: season.league_key[0],
                      seasonYear: season.season[0],
                      rank: Number(team.team_standings[0].rank[0]),
                    },
                    wins: Number(
                      team.team_standings[0].outcome_totals[0].wins[0]
                    ),
                    losses: Number(
                      team.team_standings[0].outcome_totals[0].losses[0]
                    ),
                    ties: Number(
                      team.team_standings[0].outcome_totals[0].ties[0]
                    ),
                    winPercentage:
                      Number(
                        Number(
                          team.team_standings[0].outcome_totals[0].percentage[0]
                        ).toFixed(2)
                      ) * 100,
                    playoffSeed: team.team_standings[0].playoff_seed
                      ? Number(team.team_standings[0].playoff_seed[0])
                      : "N/A",
                    moves: Number(team.number_of_moves[0]),
                    trades: Number(team.number_of_trades[0]),
                    // madePlayoffs: team.clinched_playoffs
                    //   ? team.clinched_playoffs[0] === "1"
                    //     ? true
                    //     : false
                    //   : false,
                  };
                }),
              };
            });
            const allManagerIds = singleLeagueAllSeasons2.map((season) => {
              return season.teams.map((team) => {
                return team.managerId;
              });
            });
            // Flatten the array of arrays into a single array
            const allManagerIdsFlattened = allManagerIds.flat();

            // Create a Set to remove duplicates and convert it back to an array
            const uniqueManagerIds = [...new Set(allManagerIdsFlattened)];

            let overallManagerSummaries = [];
            uniqueManagerIds.forEach((id) => {
              let overall = {
                id: [],
                key: [],
                managerName: [],
                managerId: [],
                name: [],
                logo: [],
                wins: 0,
                losses: 0,
                ties: 0,
                pointsFor: 0,
                pointsAgainst: 0,
                winPercentage: 0,
                rank: [],
                // madePlayoffs: [],
                playoffSeed: [],
                bestFinish: 0,
                worstFinish: 0,
                championships: 0,
                moves: 0,
                trades: 0,
                memberSeasons: [],
                memberUntil: "",
                memberSince: "",
              };
              singleLeagueAllSeasons2.forEach((season) => {
                season.teams.forEach((team) => {
                  if (id === team.managerId) {
                    overall.id = [...overall.id, team.id];
                    overall.key = [...overall.key, team.key];
                    overall.managerName = team.managerName;
                    overall.managerId = team.managerId;
                    overall.name = team.name;
                    if (team.logo) {
                      overall.logo = team.logo;
                    }
                    overall.wins = overall.wins + team.wins;
                    overall.losses = overall.losses + team.losses;
                    overall.ties = overall.ties + team.ties;
                    overall.pointsFor =
                      Number(overall.pointsFor.toFixed(2)) +
                      Number(team.pointsFor.toFixed(2));
                    overall.pointsAgainst =
                      Number(overall.pointsAgainst.toFixed(2)) +
                      Number(team.pointsAgainst.toFixed(2));
                    overall.rank = [
                      ...overall.rank,
                      {
                        seasonKey: team.rank.seasonKey,
                        seasonYear: team.rank.seasonYear,
                        rank: team.rank.rank,
                      },
                    ];
                    // overall.madePlayoffs = [
                    //   ...overall.madePlayoffs,
                    //   {
                    //     seasonKey: season.key,
                    //     seasonYear: season.season,
                    //     madePlayoffs: team.madePlayoffs,
                    //   },
                    // ];
                    overall.playoffSeed = [
                      ...overall.playoffSeed,
                      {
                        seasonKey: season.key,
                        seasonYear: season.season,
                        playoffSeed: team.playoffSeed,
                      },
                    ];
                    overall.moves = overall.moves + team.moves;
                    overall.trades = overall.trades + team.trades;
                    overall.memberSeasons = [
                      ...overall.memberSeasons,
                      { seasonKey: season.key, seasonYear: season.season },
                    ];
                  }
                });
              });
              overall.memberSince = overall.memberSeasons[0];
              overall.memberUntil =
                overall.memberSeasons[overall.memberSeasons.length - 1];
              overall.rank = overall.rank.filter((season) => season.rank != 0);
              if (overall.rank.length) {
                overall.rank.sort((a, b) => b.rank - a.rank);
                overall.bestFinish = overall.rank.filter(
                  (season) => Number(season.seasonYear) != currentYear
                );
                if (!overall.bestFinish.length) {
                  overall.bestFinish = [
                    {
                      seasonKey: "Overall",
                      rank: ["TBD"],
                      seasonYear: currentYear.toString(),
                    },
                  ];
                } else {
                  overall.bestFinish = overall.bestFinish.filter(
                    (season) =>
                      season.rank ===
                      overall.bestFinish[overall.bestFinish.length - 1].rank
                  );
                }
                overall.worstFinish = overall.rank.filter(
                  (season) => Number(season.seasonYear) != currentYear
                );
                if (!overall.worstFinish.length) {
                  overall.worstFinish = [
                    {
                      seasonKey: "Overall",
                      rank: ["TBD"],
                      seasonYear: currentYear.toString(),
                    },
                  ];
                } else {
                  overall.worstFinish = overall.worstFinish.filter(
                    (season) => season.rank === overall.worstFinish[0].rank
                  );
                }
                overall.championships = overall.rank.filter(
                  (season) => Number(season.seasonYear) != currentYear
                );
                overall.championships = overall.championships.filter(
                  (season) => season.rank === 1
                );
              } else {
                overall.bestFinish = "TBD";
                overall.worstFinish = "TBD";
              }

              if (overall.wins + overall.losses + overall.ties > 0) {
                overall.winPercentage = Number(
                  (
                    (overall.wins /
                      (overall.wins + overall.losses + overall.ties)) *
                    100
                  ).toFixed(2)
                );
              } else {
                overall.winPercentage = 0;
              }
              overallManagerSummaries = [...overallManagerSummaries, overall];
            });

            overallManagerSummaries.sort((a, b) => {
              if (
                Number(a.championships.length) !==
                Number(b.championships.length)
              ) {
                return (
                  Number(b.championships.length) -
                  Number(a.championships.length)
                );
              }
              if (
                Number(a.memberUntil.seasonYear) !==
                Number(b.memberUntil.seasonYear)
              ) {
                return (
                  Number(b.memberUntil.seasonYear) -
                  Number(a.memberUntil.seasonYear)
                );
              }
              if (a.winPercentage !== b.winPercentage) {
                return b.winPercentage - a.winPercentage;
              }
              if (a.memberSeasons.length !== b.memberSeasons.length) {
                return a.memberSeasons.length - b.memberSeasons.length;
              }

              if (a.wins !== b.wins) {
                return b.wins - a.wins;
              }
              if (a.losses !== b.losses) {
                return a.losses - b.losses;
              }
              if (a.ties !== b.ties) {
                return b.ties - a.ties;
              }
            });
            let n = 0;
            overallManagerSummaries.forEach((manager) => {
              n = n + 1;
              manager.rank = {
                seasonKey: manager.key,
                seasonYear: manager.memberSeasons,
                rank: n,
              };
            });

            leagueTeams = [
              ...singleLeagueAllSeasons2,
              {
                id: singleLeagueAllSeasons2.map((season) => {
                  return season.id;
                }),
                key: singleLeagueAllSeasons2.map((season) => {
                  return season.key;
                }),
                name: singleLeagueAllSeasons2[league.length - 1].name,
                season: "Overall",
                logo: singleLeagueAllSeasons2.map((season) => {
                  if (season.logo) {
                    return season.logo;
                  } else return "";
                }),
                mostRecentLogo: singleLeagueAllSeasons2.filter(
                  (season) => season.logo
                ).length
                  ? singleLeagueAllSeasons2.filter((season) => season.logo)[
                      singleLeagueAllSeasons2.filter((season) => season.logo)
                        .length - 1
                    ].logo
                  : "",
                startDate: singleLeagueAllSeasons2[0].startDate,
                teams: overallManagerSummaries,
              },
            ];
          }
        });
        const fetchPromises = leagues.map(async (league) => {
          const response = await fetch(
            `https://fantasysports.yahooapis.com/fantasy/v2/league/${league.key}/scoreboard;week=${league.leagueWeeks}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                timeout: 5000,
              },
            }
          );
          if (!response.ok) {
            let error = new Error(
              `Request failed when fetching promises with status ${response.status}`
            );
            error.status = response.status; // Add status property
            console.error(
              `Request failed when fetching promises data with status ${response.status}`
            );
            throw error;
          } else {
            const data = await response.text();
            return data;
            //.then((response) => response.text())
          }
        });
        try {
          const responses = await Promise.all(fetchPromises);
          responses.map((xml) => {
            parseString(xml, (err, result) => {
              if (err) {
                console.error("Error parsing XML:", err);
                throw new Error(`Error parsing XML: ${err}`);
              }
              const league = result.fantasy_content.league[0];
              const matchup =
                result.fantasy_content.league[0].scoreboard[0].matchups[0].matchup.map(
                  (matchup) => {
                    return {
                      status: matchup.status[0],
                      week: Number(matchup.week[0]),
                      weekStart: matchup.week_start[0],
                      weekEnd: matchup.week_end[0],
                      isPlayoff: matchup.is_playoffs[0] === "1" ? true : false,
                      isConsolation:
                        matchup.is_consolation[0] === "1" ? true : false,
                      tied:
                        matchup.status[0] === "postevent"
                          ? matchup.is_tied[0] === "1"
                            ? true
                            : false
                          : false,
                      winnerTeamKey: matchup.winner_team_key
                        ? matchup.winner_team_key[0]
                        : "",
                      team1ManagerName:
                        matchup.teams[0].team[0].managers[0].manager[0]
                          .nickname[0],
                      team1ManagerId:
                        matchup.teams[0].team[0].managers[0].manager[0].guid[0],
                      team1Name: matchup.teams[0].team[0].name[0],
                      team1Key: matchup.teams[0].team[0].team_key[0],
                      team1Logo:
                        matchup.teams[0].team[0].team_logos[0].team_logo[0]
                          .url[0],
                      team1PointsFor: Number(
                        matchup.teams[0].team[0].team_points[0].total[0]
                      ),
                      team1ProjectedPointsFor: Number(
                        matchup.teams[0].team[0].team_projected_points[0]
                          .total[0]
                      ),
                      team1PointsAgainst: Number(
                        matchup.teams[0].team[1].team_points[0].total[0]
                      ),
                      team1ProjectedPointsAgainst: Number(
                        matchup.teams[0].team[1].team_projected_points[0]
                          .total[0]
                      ),
                      team2ManagerName:
                        matchup.teams[0].team[1].managers[0].manager[0]
                          .nickname[0],
                      team2ManagerId:
                        matchup.teams[0].team[1].managers[0].manager[0].guid[0],
                      team2Name: matchup.teams[0].team[1].name[0],
                      team2Key: matchup.teams[0].team[1].team_key[0],
                      team2Logo:
                        matchup.teams[0].team[1].team_logos[0].team_logo[0]
                          .url[0],
                      team2PointsFor: Number(
                        matchup.teams[0].team[1].team_points[0].total[0]
                      ),
                      team2ProjectedPointsFor: Number(
                        matchup.teams[0].team[1].team_projected_points[0]
                          .total[0]
                      ),
                      team2PointsAgainst: Number(
                        matchup.teams[0].team[0].team_points[0].total[0]
                      ),
                      team2ProjectedPointsAgainst: Number(
                        matchup.teams[0].team[0].team_projected_points[0]
                          .total[0]
                      ),
                    };
                  }
                );
              let leagueWeeksArray = [];
              for (
                let i = Number(league.start_week[0]);
                i < Number(league.end_week) + 1;
                i++
              ) {
                leagueWeeksArray.push(i);
              }
              trends.push({
                season: result.fantasy_content.league[0].season[0],
                seasonKey: result.fantasy_content.league[0].league_key[0],
                seasonStartWeek: Number(
                  result.fantasy_content.league[0].start_week[0]
                ),
                seasonEndWeek: Number(
                  result.fantasy_content.league[0].end_week[0]
                ),
                seasonWeeks: leagueWeeksArray,
                matchups: matchup,
              });
            });
          });

          leagueTeams.forEach((leagueSeason) => {
            if (leagueSeason.season != "Overall") {
              let seasonRecords = {
                winningStreak: [{ streak: 0 }],
                losingStreak: [{ streak: 0 }],
                mostPointsGame: [{ pointsFor: 0 }],
                leastPointsGame: [{ pointsFor: 1000000 }],
                mostPointsSeason: [{ pointsFor: 0 }],
                leastPointsSeason: [{ pointsFor: 1000000 }],
                mostPointsAgainstSeason: [{ pointsAgainst: 0 }],
                leastPointsAgainstSeason: [{ pointsAgainst: 1000000 }],
                biggestWin: [{ pointsFor: 0, pointsAgainst: 0 }],
                biggestLoss: [
                  {
                    pointsFor: 1000000,
                    pointsAgainst: 0,
                  },
                ],
                highestScoreVSProjection: [
                  {
                    pointsFor: 0,
                    projectedPointsFor: 1000000,
                  },
                ],
                mostAccurateProjection: [
                  {
                    pointsFor: 0,
                    projectedPointsFor: 1000000,
                  },
                ],
                closestMatch: [
                  {
                    pointsFor: 1000000,
                    pointsAgainst: -1000000,
                  },
                ],
                mostPointsInLoss: [{ pointsFor: 0, pointsAgainst: 0 }],
                leastPointsInWin: [
                  {
                    pointsFor: 1000000,
                    pointsAgainst: 0,
                  },
                ],
                mostWins: [{ wins: 0 }],
                mostLosses: [{ losses: 0 }],
              };
              leagueSeason.teams = leagueSeason.teams.map((team) => {
                let weeklyRecord = [];
                let cumulativeRecord;
                let winningStreak = 0;
                let losingStreak = 0;
                let bestWinningStreak = { streak: 0 };
                let bestLosingStreak = { streak: 0 };
                trends.forEach((season) => {
                  let matchups = [];
                  if (leagueSeason.key === season.seasonKey) {
                    season.matchups.forEach((matchup) => {
                      if (
                        team.managerId === matchup.team1ManagerId ||
                        team.managerId === matchup.team2ManagerId
                      ) {
                        if (team.managerId === matchup.team1ManagerId) {
                          matchups.push({
                            status: matchup.status,
                            season: matchup.season,
                            seasonKey: matchup.seasonKey,
                            week: matchup.week,
                            weekStart: matchup.weekStart,
                            weekEnd: matchup.weekEnd,
                            isPlayoff: matchup.isPlayoff,
                            isConsolation: matchup.isConsolation,
                            ties: matchup.tied ? 1 : 0,
                            wins: !matchup.tied
                              ? matchup.winnerTeamKey === matchup.team1Key
                                ? 1
                                : 0
                              : 0,
                            losses: !matchup.tied
                              ? matchup.winnerTeamKey === matchup.team2Key
                                ? 1
                                : 0
                              : 0,
                            managerName: matchup.team1ManagerName,
                            managerId: matchup.team1ManagerId,
                            name: matchup.team1Name,
                            key: matchup.team1Key,
                            logo: matchup.team1Logo,
                            pointsFor: matchup.team1PointsFor,
                            projectedPointsFor: matchup.team1ProjectedPointsFor,
                            pointsAgainst: matchup.team1PointsAgainst,
                            projectedPointsAgainst:
                              matchup.team1ProjectedPointsAgainst,
                            opponentManagerName: matchup.team2ManagerName,
                            opponentManagerId: matchup.team2ManagerId,
                            opponentName: matchup.team2Name,
                            opponentKey: matchup.team2Key,
                            opponentLogo: matchup.team2Logo,
                            opponentPointsFor: matchup.team2PointsFor,
                            opponentProjectedPointsFor:
                              matchup.team2ProjectedPointsFor,
                            opponentPointsAgainst: matchup.team2PointsAgainst,
                            opponentProjectedPointsAgainst:
                              matchup.team2ProjectedPointsAgainst,
                          });
                        } else {
                          matchups.push({
                            status: matchup.status,
                            week: matchup.week,
                            weekStart: matchup.weekStart,
                            weekEnd: matchup.weekEnd,
                            isPlayoff: matchup.isPlayoff,
                            isConsolation: matchup.isConsolation,
                            ties: matchup.tied ? 1 : 0,
                            wins: !matchup.tied
                              ? matchup.winnerTeamKey === matchup.team2Key
                                ? 1
                                : 0
                              : 0,
                            losses: !matchup.tied
                              ? matchup.winnerTeamKey === matchup.team1Key
                                ? 1
                                : 0
                              : 0,
                            managerName: matchup.team2ManagerName,
                            managerId: matchup.team2ManagerId,
                            name: matchup.team2Name,
                            key: matchup.team2Key,
                            logo: matchup.team2Logo,
                            pointsFor: matchup.team2PointsFor,
                            projectedPointsFor: matchup.team2ProjectedPointsFor,
                            pointsAgainst: matchup.team2PointsAgainst,
                            projectedPointsAgainst:
                              matchup.team2ProjectedPointsAgainst,
                            opponentManagerName: matchup.team1ManagerName,
                            opponentManagerId: matchup.team1ManagerId,
                            opponentName: matchup.team1Name,
                            opponentKey: matchup.team1Key,
                            opponentLogo: matchup.team1Logo,
                            opponentPointsFor: matchup.team1PointsFor,
                            opponentProjectedPointsFor:
                              matchup.team1ProjectedPointsFor,
                            opponentPointsAgainst: matchup.team1PointsAgainst,
                            opponentProjectedPointsAgainst:
                              matchup.team1ProjectedPointsAgainst,
                          });
                        }
                      }
                    });
                    weeklyRecord.push({
                      season: season.season,
                      seasonKey: season.seasonKey,
                      seasonStartWeek: season.seasonStartWeek,
                      seasonEndWeek: season.seasonEndWeek,
                      seasonWeeks: season.seasonWeeks,
                      matchups: matchups,
                    });
                  }
                });
                weeklyRecord.map((season) => {
                  let cumulativeWeeks = [];
                  let previousObject = {
                    wins: 0,
                    losses: 0,
                    ties: 0,
                    pointsFor: 0,
                    pointsAgainst: 0,
                    winDifferential: 0,
                    pointsDifferential: 0,
                    projectedPointsFor: 0,
                    projectedPointsAgainst: 0,
                    isPlayoff: false,
                    isConsolation: false,
                  };
                  let previousPlayoffObject = {
                    wins: 0,
                    losses: 0,
                    ties: 0,
                    pointsFor: 0,
                    pointsAgainst: 0,
                    winDifferential: 0,
                    pointsDifferential: 0,
                    projectedPointsFor: 0,
                    projectedPointsAgainst: 0,
                  };
                  let previousConsolationObject = {
                    wins: 0,
                    losses: 0,
                    ties: 0,
                    pointsFor: 0,
                    pointsAgainst: 0,
                    winDifferential: 0,
                    pointsDifferential: 0,
                    projectedPointsFor: 0,
                    projectedPointsAgainst: 0,
                  };
                  season.matchups.forEach((week) => {
                    const newObject = {
                      status: week.status,
                      week: week.week,
                      wins: Number(previousObject.wins) + Number(week.wins),
                      losses:
                        Number(previousObject.losses) + Number(week.losses),
                      ties: Number(previousObject.ties) + Number(week.ties),
                      pointsFor:
                        Number(previousObject.pointsFor) +
                        Number(week.pointsFor),
                      pointsAgainst:
                        Number(previousObject.pointsAgainst) +
                        Number(week.pointsAgainst),
                      winDifferential:
                        Number(previousObject.wins) +
                        Number(week.wins) -
                        (Number(previousObject.losses) + Number(week.losses)),
                      pointsDifferential:
                        Number(previousObject.pointsFor) +
                        Number(week.pointsFor) -
                        (Number(previousObject.pointsAgainst) +
                          Number(week.pointsAgainst)),
                      projectedPointsFor:
                        Number(previousObject.projectedPointsFor) +
                        Number(week.projectedPointsFor),
                      projectedPointsAgainst:
                        Number(previousObject.projectedPointsAgainst) +
                        Number(week.projectedPointsAgainst),
                      isPlayoff: week.isPlayoff,
                      isConsolation: week.isConsolation,
                    };
                    cumulativeWeeks.push(newObject);
                    if (
                      newObject.wins > previousObject.wins &&
                      !week.isPlayoff
                    ) {
                      winningStreak = winningStreak + 1;
                      if (winningStreak > bestWinningStreak.streak) {
                        bestWinningStreak = {
                          streak: winningStreak,
                          season: season.season,
                        };
                      }
                    } else {
                      winningStreak = 0;
                    }
                    if (
                      newObject.losses > previousObject.losses &&
                      !week.isPlayoff
                    ) {
                      losingStreak = losingStreak + 1;
                      if (losingStreak > bestLosingStreak.streak) {
                        bestLosingStreak = {
                          streak: losingStreak,
                          season: season.season,
                        };
                      }
                    } else {
                      losingStreak = 0;
                    }
                    previousObject = newObject;
                    if (week.isPlayoff && !week.isConsolation) {
                      const newPlayoffObject = {
                        wins:
                          Number(previousPlayoffObject.wins) +
                          Number(week.wins),
                        losses:
                          Number(previousPlayoffObject.losses) +
                          Number(week.losses),
                        ties:
                          Number(previousPlayoffObject.ties) +
                          Number(week.ties),
                        pointsFor:
                          Number(previousPlayoffObject.pointsFor) +
                          Number(week.pointsFor),
                        pointsAgainst:
                          Number(previousPlayoffObject.pointsAgainst) +
                          Number(week.pointsAgainst),
                        winDifferential:
                          Number(previousPlayoffObject.wins) +
                          Number(week.wins) -
                          (Number(previousPlayoffObject.losses) +
                            Number(week.losses)),
                        pointsDifferential:
                          Number(previousPlayoffObject.pointsFor) +
                          Number(week.pointsFor) -
                          (Number(previousPlayoffObject.pointsAgainst) +
                            Number(week.pointsAgainst)),
                        projectedPointsFor:
                          Number(previousPlayoffObject.projectedPointsFor) +
                          Number(week.projectedPointsFor),
                        projectedPointsAgainst:
                          Number(previousPlayoffObject.projectedPointsAgainst) +
                          Number(week.projectedPointsAgainst),
                      };
                      previousPlayoffObject = newPlayoffObject;
                    }
                    if (week.isPlayoff && week.isConsolation) {
                      const newConsolationObject = {
                        wins:
                          Number(previousConsolationObject.wins) +
                          Number(week.wins),
                        losses:
                          Number(previousConsolationObject.losses) +
                          Number(week.losses),
                        ties:
                          Number(previousConsolationObject.ties) +
                          Number(week.ties),
                        pointsFor:
                          Number(previousConsolationObject.pointsFor) +
                          Number(week.pointsFor),
                        pointsAgainst:
                          Number(previousConsolationObject.pointsAgainst) +
                          Number(week.pointsAgainst),
                        winDifferential:
                          Number(previousConsolationObject.wins) +
                          Number(week.wins) -
                          (Number(previousConsolationObject.losses) +
                            Number(week.losses)),
                        pointsDifferential:
                          Number(previousConsolationObject.pointsFor) +
                          Number(week.pointsFor) -
                          (Number(previousConsolationObject.pointsAgainst) +
                            Number(week.pointsAgainst)),
                        projectedPointsFor:
                          Number(previousConsolationObject.projectedPointsFor) +
                          Number(week.projectedPointsFor),
                        projectedPointsAgainst:
                          Number(
                            previousConsolationObject.projectedPointsAgainst
                          ) + Number(week.projectedPointsAgainst),
                      };
                      previousConsolationObject = newConsolationObject;
                    }
                  });
                  cumulativeRecord = {
                    season: season.season,
                    seasonKey: season.seasonKey,
                    seasonStartWeek: season.seasonStartWeek,
                    seasonEndWeek: season.seasonEndWeek,
                    seasonWeeks: season.seasonWeeks,
                    regularSeasonRecord: cumulativeWeeks.filter(
                      (week) => !week.isPlayoff && !week.isConsolation
                    )
                      ? cumulativeWeeks.filter(
                          (week) => !week.isPlayoff && !week.isConsolation
                        )[
                          cumulativeWeeks.filter(
                            (week) => !week.isPlayoff && !week.isConsolation
                          ).length - 1
                        ]
                      : "N/A",
                    playoffSeasonRecord: previousPlayoffObject,
                    consolationSeasonRecord: previousConsolationObject,
                    week: cumulativeWeeks,
                  };
                });

                let gameRecords = {
                  winningStreak: [
                    {
                      ...bestWinningStreak,
                      name: team.name,
                      managerName: team.managerName,
                      logo: team.logo,
                    },
                  ],
                  losingStreak: [
                    {
                      ...bestLosingStreak,
                      name: team.name,
                      managerName: team.managerName,
                      logo: team.logo,
                    },
                  ],
                  mostPointsGame: [{ pointsFor: 0 }],
                  leastPointsGame: [{ pointsFor: 1000000 }],
                  highestScoreVSProjection: [
                    {
                      pointsFor: 0,
                      projectedPointsFor: 1000000,
                    },
                  ],
                  mostAccurateProjection: [
                    {
                      pointsFor: 0,
                      projectedPointsFor: 1000000,
                    },
                  ],
                  biggestWin: [{ pointsFor: 0, pointsAgainst: 0 }],
                  biggestLoss: [{ pointsFor: 1000000, pointsAgainst: 0 }],
                  closestMatch: [
                    { pointsFor: 1000000, pointsAgainst: -1000000 },
                  ],
                  mostPointsInLoss: [{ pointsFor: 0, pointsAgainst: 0 }],
                  leastPointsInWin: [{ pointsFor: 1000000, pointsAgainst: 0 }],
                };
                weeklyRecord.forEach((season) => {
                  season.matchups.forEach((week) => {
                    if (
                      week.pointsFor > gameRecords.mostPointsGame[0].pointsFor
                    ) {
                      gameRecords.mostPointsGame = [
                        {
                          ...week,
                          season: season.season,
                          seasonKey: season.seasonKey,
                        },
                      ];
                    } else if (
                      week.pointsFor === gameRecords.mostPointsGame[0].pointsFor
                    ) {
                      gameRecords.mostPointsGame.push({
                        ...week,
                        season: season.season,
                        seasonKey: season.seasonKey,
                      });
                    }
                    if (
                      week.pointsFor <
                        gameRecords.leastPointsGame[0].pointsFor &&
                      week.status === "postevent"
                    ) {
                      gameRecords.leastPointsGame = [
                        {
                          ...week,
                          season: season.season,
                          seasonKey: season.seasonKey,
                        },
                      ];
                    } else if (
                      week.pointsFor ===
                        gameRecords.leastPointsGame[0].pointsFor &&
                      week.status === "postevent"
                    ) {
                      gameRecords.leastPointsGame.push({
                        ...week,
                        season: season.season,
                        seasonKey: season.seasonKey,
                      });
                    }
                    if (
                      week.pointsFor - week.pointsAgainst >
                      gameRecords.biggestWin[0].pointsFor -
                        gameRecords.biggestWin[0].pointsAgainst
                    ) {
                      gameRecords.biggestWin = [
                        {
                          ...week,
                          season: season.season,
                          seasonKey: season.seasonKey,
                        },
                      ];
                    } else if (
                      week.pointsFor - week.pointsAgainst ===
                      gameRecords.biggestWin[0].pointsFor -
                        gameRecords.biggestWin[0].pointsAgainst
                    ) {
                      gameRecords.biggestWin.push({
                        ...week,
                        season: season.season,
                        seasonKey: season.seasonKey,
                      });
                    }
                    if (
                      week.pointsFor - week.pointsAgainst <
                      gameRecords.biggestLoss[0].pointsFor -
                        gameRecords.biggestLoss[0].pointsAgainst
                    ) {
                      gameRecords.biggestLoss = [
                        {
                          ...week,
                          season: season.season,
                          seasonKey: season.seasonKey,
                        },
                      ];
                    } else if (
                      week.pointsFor - week.pointsAgainst ===
                      gameRecords.biggestLoss[0].pointsFor -
                        gameRecords.biggestLoss[0].pointsAgainst
                    ) {
                      gameRecords.biggestLoss.push({
                        ...week,
                        season: season.season,
                        seasonKey: season.seasonKey,
                      });
                    }
                    if (
                      week.pointsFor >
                        gameRecords.mostPointsInLoss[0].pointsFor &&
                      week.losses === 1
                    ) {
                      gameRecords.mostPointsInLoss = [
                        {
                          ...week,
                          season: season.season,
                          seasonKey: season.seasonKey,
                        },
                      ];
                    } else if (
                      week.pointsFor ===
                        gameRecords.mostPointsInLoss[0].pointsFor &&
                      week.losses === 1
                    ) {
                      gameRecords.mostPointsInLoss.push({
                        ...week,
                        season: season.season,
                        seasonKey: season.seasonKey,
                      });
                    }
                    if (
                      week.pointsFor <
                        gameRecords.leastPointsInWin[0].pointsFor &&
                      week.wins === 1
                    ) {
                      gameRecords.leastPointsInWin = [
                        {
                          ...week,
                          season: season.season,
                          seasonKey: season.seasonKey,
                        },
                      ];
                    } else if (
                      week.pointsFor ===
                        gameRecords.leastPointsInWin[0].pointsFor &&
                      week.wins === 1
                    ) {
                      gameRecords.leastPointsInWin.push({
                        ...week,
                        season: season.season,
                        seasonKey: season.seasonKey,
                      });
                    }
                    if (
                      Math.abs(week.pointsFor - week.pointsAgainst) <
                        Math.abs(
                          gameRecords.closestMatch[0].pointsFor -
                            gameRecords.closestMatch[0].pointsAgainst
                        ) &&
                      week.ties != 1 &&
                      week.status === "postevent"
                    ) {
                      gameRecords.closestMatch = [
                        {
                          ...week,
                          season: season.season,
                          seasonKey: season.seasonKey,
                        },
                      ];
                    } else if (
                      Math.abs(week.pointsFor - week.pointsAgainst) ===
                        Math.abs(
                          gameRecords.closestMatch[0].pointsFor -
                            gameRecords.closestMatch[0].pointsAgainst
                        ) &&
                      week.ties != 1 &&
                      week.status === "postevent"
                    ) {
                      gameRecords.closestMatch.push({
                        ...week,
                        season: season.season,
                        seasonKey: season.seasonKey,
                      });
                    }
                    if (
                      week.pointsFor - week.projectedPointsFor >
                      gameRecords.highestScoreVSProjection[0].pointsFor -
                        gameRecords.highestScoreVSProjection[0]
                          .projectedPointsFor
                    ) {
                      gameRecords.highestScoreVSProjection = [
                        {
                          ...week,
                          season: season.season,
                          seasonKey: season.seasonKey,
                        },
                      ];
                    } else if (
                      week.pointsFor - week.projectedPointsFor ===
                      gameRecords.highestScoreVSProjection[0].pointsFor -
                        gameRecords.highestScoreVSProjection[0]
                          .projectedPointsFor
                    ) {
                      gameRecords.highestScoreVSProjection.push({
                        ...week,
                        season: season.season,
                        seasonKey: season.seasonKey,
                      });
                    }
                    if (
                      Math.abs(week.pointsFor - week.projectedPointsFor) <
                      Math.abs(
                        gameRecords.mostAccurateProjection[0].pointsFor -
                          gameRecords.mostAccurateProjection[0]
                            .projectedPointsFor
                      )
                    ) {
                      gameRecords.mostAccurateProjection = [
                        {
                          ...week,
                          season: season.season,
                          seasonKey: season.seasonKey,
                        },
                      ];
                    } else if (
                      Math.abs(week.pointsFor - week.projectedPointsFor) ===
                      Math.abs(
                        gameRecords.mostAccurateProjection[0].pointsFor -
                          gameRecords.mostAccurateProjection[0]
                            .projectedPointsFor
                      )
                    ) {
                      gameRecords.mostAccurateProjection.push({
                        ...week,
                        season: season.season,
                        seasonKey: season.seasonKey,
                      });
                    }
                  });
                });
                return { ...team, weeklyRecord, cumulativeRecord, gameRecords };
              });
              leagueSeason.teams.forEach((team) => {
                if (
                  team.gameRecords.mostPointsGame[0].pointsFor >
                  seasonRecords.mostPointsGame[0].pointsFor
                ) {
                  seasonRecords.mostPointsGame =
                    team.gameRecords.mostPointsGame;
                } else if (
                  team.gameRecords.mostPointsGame[0].pointsFor ===
                  seasonRecords.mostPointsGame[0].pointsFor
                ) {
                  team.gameRecords.mostPointsGame.forEach((game) => {
                    seasonRecords.mostPointsGame.push(game);
                  });
                }
                if (
                  team.gameRecords.leastPointsGame[0].pointsFor <
                  seasonRecords.leastPointsGame[0].pointsFor
                ) {
                  seasonRecords.leastPointsGame =
                    team.gameRecords.leastPointsGame;
                } else if (
                  team.gameRecords.leastPointsGame[0].pointsFor ===
                  seasonRecords.leastPointsGame[0].pointsFor
                ) {
                  team.gameRecords.leastPointsGame.forEach((game) => {
                    seasonRecords.leastPointsGame.push(game);
                  });
                }
                if (
                  team.gameRecords.biggestWin[0].pointsFor -
                    team.gameRecords.biggestWin[0].pointsAgainst >
                  seasonRecords.biggestWin[0].pointsFor -
                    seasonRecords.biggestWin[0].pointsAgainst
                ) {
                  seasonRecords.biggestWin = team.gameRecords.biggestWin;
                } else if (
                  team.gameRecords.biggestWin[0].pointsFor -
                    team.gameRecords.biggestWin[0].pointsAgainst ===
                  seasonRecords.biggestWin[0].pointsFor -
                    seasonRecords.biggestWin[0].pointsAgainst
                ) {
                  team.gameRecords.biggestWin.forEach((game) => {
                    seasonRecords.biggestWin.push(game);
                  });
                }
                if (
                  team.gameRecords.biggestLoss[0].pointsFor -
                    team.gameRecords.biggestLoss[0].pointsAgainst <
                  seasonRecords.biggestLoss[0].pointsFor -
                    seasonRecords.biggestLoss[0].pointsAgainst
                ) {
                  seasonRecords.biggestLoss = team.gameRecords.biggestLoss;
                } else if (
                  team.gameRecords.biggestLoss[0].pointsFor -
                    team.gameRecords.biggestLoss[0].pointsAgainst ===
                  seasonRecords.biggestLoss[0].pointsFor -
                    seasonRecords.biggestLoss[0].pointsAgainst
                ) {
                  team.gameRecords.biggestLoss.forEach((game) => {
                    seasonRecords.biggestLoss.push(game);
                  });
                }
                if (
                  team.gameRecords.mostPointsInLoss[0].pointsFor >
                  seasonRecords.mostPointsInLoss[0].pointsFor
                ) {
                  seasonRecords.mostPointsInLoss =
                    team.gameRecords.mostPointsInLoss;
                } else if (
                  team.gameRecords.mostPointsInLoss[0].pointsFor ===
                  seasonRecords.mostPointsInLoss[0].pointsFor
                ) {
                  team.gameRecords.mostPointsInLoss.forEach((game) => {
                    seasonRecords.mostPointsInLoss.push(game);
                  });
                }
                if (
                  team.gameRecords.leastPointsInWin[0].pointsFor <
                  seasonRecords.leastPointsInWin[0].pointsFor
                ) {
                  seasonRecords.leastPointsInWin =
                    team.gameRecords.leastPointsInWin;
                } else if (
                  team.gameRecords.leastPointsInWin[0].pointsFor ===
                  seasonRecords.leastPointsInWin[0].pointsFor
                ) {
                  team.gameRecords.leastPointsInWin.forEach((game) => {
                    seasonRecords.leastPointsInWin.push(game);
                  });
                }
                if (team.wins > seasonRecords.mostWins[0].wins) {
                  seasonRecords.mostWins = [
                    {
                      wins: team.wins,
                      managerName: team.managerName,
                      name: team.name,
                      logo: team.logo,
                      season: leagueSeason.season,
                    },
                  ];
                } else if (team.wins === seasonRecords.mostWins[0].wins) {
                  seasonRecords.mostWins.push({
                    wins: team.wins,
                    managerName: team.managerName,
                    name: team.name,
                    logo: team.logo,
                    season: leagueSeason.season,
                  });
                }
                if (team.losses > seasonRecords.mostLosses[0].losses) {
                  seasonRecords.mostLosses = [
                    {
                      losses: team.losses,
                      managerName: team.managerName,
                      name: team.name,
                      logo: team.logo,
                      season: leagueSeason.season,
                    },
                  ];
                } else if (team.losses === seasonRecords.mostLosses[0].losses) {
                  seasonRecords.mostLosses.push({
                    losses: team.losses,
                    managerName: team.managerName,
                    name: team.name,
                    logo: team.logo,
                    season: leagueSeason.season,
                  });
                }
                if (
                  team.pointsFor > seasonRecords.mostPointsSeason[0].pointsFor
                ) {
                  seasonRecords.mostPointsSeason = [
                    {
                      pointsFor: team.pointsFor,
                      managerName: team.managerName,
                      name: team.name,
                      logo: team.logo,
                      season: leagueSeason.season,
                    },
                  ];
                } else if (
                  team.pointsFor === seasonRecords.mostPointsSeason[0].pointsFor
                ) {
                  seasonRecords.mostPointsSeason.push({
                    pointsFor: team.pointsFor,
                    managerName: team.managerName,
                    name: team.name,
                    logo: team.logo,
                    season: leagueSeason.season,
                  });
                }
                if (
                  team.pointsFor < seasonRecords.leastPointsSeason[0].pointsFor
                ) {
                  seasonRecords.leastPointsSeason = [
                    {
                      pointsFor: team.pointsFor,
                      managerName: team.managerName,
                      name: team.name,
                      logo: team.logo,
                      season: leagueSeason.season,
                    },
                  ];
                } else if (
                  team.pointsFor ===
                  seasonRecords.leastPointsSeason[0].pointsFor
                ) {
                  seasonRecords.leastPointsSeason.push({
                    pointsFor: team.pointsFor,
                    managerName: team.managerName,
                    name: team.name,
                    logo: team.logo,
                    season: leagueSeason.season,
                  });
                }
                if (
                  team.pointsAgainst >
                  seasonRecords.mostPointsAgainstSeason[0].pointsAgainst
                ) {
                  seasonRecords.mostPointsAgainstSeason = [
                    {
                      pointsAgainst: team.pointsAgainst,
                      managerName: team.managerName,
                      name: team.name,
                      logo: team.logo,
                      season: leagueSeason.season,
                    },
                  ];
                } else if (
                  team.pointsAgainst ===
                  seasonRecords.mostPointsAgainstSeason[0].pointsAgainst
                ) {
                  seasonRecords.mostPointsAgainstSeason.push({
                    pointsAgainst: team.pointsAgainst,
                    managerName: team.managerName,
                    name: team.name,
                    logo: team.logo,
                    season: leagueSeason.season,
                  });
                }
                if (
                  team.pointsAgainst <
                  seasonRecords.leastPointsAgainstSeason[0].pointsAgainst
                ) {
                  seasonRecords.leastPointsAgainstSeason = [
                    {
                      pointsAgainst: team.pointsAgainst,
                      managerName: team.managerName,
                      name: team.name,
                      logo: team.logo,
                      season: leagueSeason.season,
                    },
                  ];
                } else if (
                  team.pointsAgainst ===
                  seasonRecords.leastPointsAgainstSeason[0].pointsAgainst
                ) {
                  seasonRecords.leastPointsAgainstSeason.push({
                    pointsAgainst: team.pointsAgainst,
                    managerName: team.managerName,
                    name: team.name,
                    logo: team.logo,
                    season: leagueSeason.season,
                  });
                }

                if (
                  Math.abs(
                    team.gameRecords.closestMatch[0].pointsFor -
                      team.gameRecords.closestMatch[0].pointsAgainst
                  ) <
                  Math.abs(
                    seasonRecords.closestMatch[0].pointsFor -
                      seasonRecords.closestMatch[0].pointsAgainst
                  )
                ) {
                  seasonRecords.closestMatch = team.gameRecords.closestMatch;
                } else if (
                  Math.abs(
                    team.gameRecords.closestMatch[0].pointsFor -
                      team.gameRecords.closestMatch[0].pointsAgainst
                  ) ===
                    Math.abs(
                      seasonRecords.closestMatch[0].pointsFor -
                        seasonRecords.closestMatch[0].pointsAgainst
                    ) &&
                  seasonRecords.closestMatch[0].name !=
                    team.gameRecords.closestMatch[0].opponentName
                ) {
                  team.gameRecords.closestMatch.forEach((game) => {
                    seasonRecords.closestMatch.push(game);
                  });
                }
                if (
                  team.gameRecords.highestScoreVSProjection[0].pointsFor -
                    team.gameRecords.highestScoreVSProjection[0]
                      .projectedPointsFor >
                  seasonRecords.highestScoreVSProjection[0].pointsFor -
                    seasonRecords.highestScoreVSProjection[0].projectedPointsFor
                ) {
                  seasonRecords.highestScoreVSProjection =
                    team.gameRecords.highestScoreVSProjection;
                } else if (
                  team.gameRecords.highestScoreVSProjection[0].pointsFor -
                    team.gameRecords.highestScoreVSProjection[0]
                      .projectedPointsFor ===
                  seasonRecords.highestScoreVSProjection[0].pointsFor -
                    seasonRecords.highestScoreVSProjection.projectedPointsFor
                ) {
                  team.gameRecords.highestScoreVSProjection.forEach((game) => {
                    seasonRecords.highestScoreVSProjection.push(game);
                  });
                }
                if (
                  Math.abs(
                    team.gameRecords.mostAccurateProjection[0].pointsFor -
                      team.gameRecords.mostAccurateProjection[0]
                        .projectedPointsFor
                  ) <
                  Math.abs(
                    seasonRecords.mostAccurateProjection[0].pointsFor -
                      seasonRecords.mostAccurateProjection[0].projectedPointsFor
                  )
                ) {
                  seasonRecords.mostAccurateProjection =
                    team.gameRecords.mostAccurateProjection;
                } else if (
                  Math.abs(
                    team.gameRecords.mostAccurateProjection[0].pointsFor -
                      team.gameRecords.mostAccurateProjection[0]
                        .projectedPointsFor
                  ) ===
                  Math.abs(
                    seasonRecords.mostAccurateProjection[0].pointsFor -
                      seasonRecords.mostAccurateProjection[0].projectedPointsFor
                  )
                ) {
                  team.gameRecords.mostAccurateProjection.forEach((game) => {
                    seasonRecords.mostAccurateProjection.push(game);
                  });
                }
                if (
                  team.gameRecords.winningStreak[0].streak >
                  seasonRecords.winningStreak[0].streak
                ) {
                  seasonRecords.winningStreak = team.gameRecords.winningStreak;
                } else if (
                  team.gameRecords.winningStreak[0].streak ===
                  seasonRecords.winningStreak[0].streak
                ) {
                  team.gameRecords.winningStreak.forEach((game) => {
                    seasonRecords.winningStreak.push(game);
                  });
                }
                if (
                  team.gameRecords.losingStreak[0].streak >
                  seasonRecords.losingStreak[0].streak
                ) {
                  seasonRecords.losingStreak = team.gameRecords.losingStreak;
                } else if (
                  team.gameRecords.losingStreak[0].streak ===
                  seasonRecords.losingStreak[0].streak
                ) {
                  team.gameRecords.losingStreak.forEach((game) => {
                    seasonRecords.losingStreak.push(game);
                  });
                }
              });
              leagueSeason.seasonRecords = seasonRecords;
            }
          });

          leagueTeams[leagueTeams.length - 1].teams = leagueTeams[
            leagueTeams.length - 1
          ].teams.map((manager) => {
            let weeklyRecord = [];
            let cumulativeRecord = [];
            let winningStreak = 0;
            let losingStreak = 0;
            let bestWinningStreak = { streak: 0 };
            let bestLosingStreak = { streak: 0 };
            trends.forEach((season) => {
              let matchups = [];

              if (
                manager.memberSeasons.some(
                  (memberSeason) => memberSeason.seasonKey === season.seasonKey
                )
              ) {
                season.matchups.forEach((matchup) => {
                  if (
                    manager.managerId === matchup.team1ManagerId ||
                    manager.managerId === matchup.team2ManagerId
                  ) {
                    if (manager.managerId === matchup.team1ManagerId) {
                      matchups.push({
                        status: matchup.status,
                        season: season.season,
                        seasonKey: season.seasonKey,
                        week: matchup.week,
                        weekStart: matchup.weekStart,
                        weekEnd: matchup.weekEnd,
                        isPlayoff: matchup.isPlayoff,
                        isConsolation: matchup.isConsolation,
                        ties: matchup.tied ? 1 : 0,
                        wins: !matchup.tied
                          ? matchup.winnerTeamKey === matchup.team1Key
                            ? 1
                            : 0
                          : 0,
                        losses: !matchup.tied
                          ? matchup.winnerTeamKey === matchup.team2Key
                            ? 1
                            : 0
                          : 0,
                        managerName: matchup.team1ManagerName,
                        managerId: matchup.team1ManagerId,
                        name: matchup.team1Name,
                        key: matchup.team1Key,
                        logo: matchup.team1Logo,
                        pointsFor: matchup.team1PointsFor,
                        projectedPointsFor: matchup.team1ProjectedPointsFor,
                        pointsAgainst: matchup.team1PointsAgainst,
                        projectedPointsAgainst:
                          matchup.team1ProjectedPointsAgainst,
                        opponentManagerName: matchup.team2ManagerName,
                        opponentManagerId: matchup.team2ManagerId,
                        opponentName: matchup.team2Name,
                        opponentKey: matchup.team2Key,
                        opponentLogo: matchup.team2Logo,
                        opponentPointsFor: matchup.team2PointsFor,
                        opponentProjectedPointsFor:
                          matchup.team2ProjectedPointsFor,
                        opponentPointsAgainst: matchup.team2PointsAgainst,
                        opponentProjectedPointsAgainst:
                          matchup.team2ProjectedPointsAgainst,
                      });
                    } else {
                      matchups.push({
                        status: matchup.status,
                        season: season.season,
                        seasonKey: season.seasonKey,
                        week: matchup.week,
                        weekStart: matchup.weekStart,
                        weekEnd: matchup.weekEnd,
                        isPlayoff: matchup.isPlayoff,
                        isConsolation: matchup.isConsolation,
                        ties: matchup.tied ? 1 : 0,
                        wins: !matchup.tied
                          ? matchup.winnerTeamKey === matchup.team2Key
                            ? 1
                            : 0
                          : 0,
                        losses: !matchup.tied
                          ? matchup.winnerTeamKey === matchup.team1Key
                            ? 1
                            : 0
                          : 0,
                        managerName: matchup.team2ManagerName,
                        managerId: matchup.team2ManagerId,
                        name: matchup.team2Name,
                        key: matchup.team2Key,
                        logo: matchup.team2Logo,
                        pointsFor: matchup.team2PointsFor,
                        projectedPointsFor: matchup.team2ProjectedPointsFor,
                        pointsAgainst: matchup.team2PointsAgainst,
                        projectedPointsAgainst:
                          matchup.team2ProjectedPointsAgainst,
                        opponentManagerName: matchup.team1ManagerName,
                        opponentManagerId: matchup.team1ManagerId,
                        opponentName: matchup.team1Name,
                        opponentKey: matchup.team1Key,
                        opponentLogo: matchup.team1Logo,
                        opponentPointsFor: matchup.team1PointsFor,
                        opponentProjectedPointsFor:
                          matchup.team1ProjectedPointsFor,
                        opponentPointsAgainst: matchup.team1PointsAgainst,
                        opponentProjectedPointsAgainst:
                          matchup.team1ProjectedPointsAgainst,
                      });
                    }
                  }
                });
                weeklyRecord.push({
                  season: season.season,
                  seasonKey: season.seasonKey,
                  seasonStartWeek: season.seasonStartWeek,
                  seasonEndWeek: season.seasonEndWeek,
                  seasonWeeks: season.seasonWeeks,
                  matchups: matchups,
                });
              }
            });
            weeklyRecord.map((season) => {
              let cumulativeWeeks = [];
              let previousObject = {
                week: [0],
                wins: [0],
                losses: [0],
                ties: [0],
                pointsFor: [0],
                pointsAgainst: [0],
                winDifferential: [0],
                pointsDifferential: [0],
                projectedPointsFor: [0],
                projectedPointsAgainst: [0],
                isPlayoff: false,
                isConsolation: false,
              };
              let previousPlayoffObject = {
                week: [0],
                wins: [0],
                losses: [0],
                ties: [0],
                pointsFor: [0],
                pointsAgainst: [0],
                winDifferential: [0],
                pointsDifferential: [0],
                projectedPointsFor: [0],
                projectedPointsAgainst: [0],
              };
              let previousConsolationObject = {
                week: [0],
                wins: [0],
                losses: [0],
                ties: [0],
                pointsFor: [0],
                pointsAgainst: [0],
                winDifferential: [0],
                pointsDifferential: [0],
                projectedPointsFor: [0],
                projectedPointsAgainst: [0],
              };
              season.matchups.forEach((week) => {
                const newObject = {
                  week: [...previousObject.week, week.week],
                  wins: [
                    ...previousObject.wins,
                    Number(
                      previousObject.wins[previousObject.wins.length - 1]
                    ) + Number(week.wins),
                  ],
                  losses: [
                    ...previousObject.losses,
                    Number(
                      previousObject.losses[previousObject.losses.length - 1]
                    ) + Number(week.losses),
                  ],
                  ties: [
                    ...previousObject.ties,
                    Number(
                      previousObject.ties[previousObject.ties.length - 1]
                    ) + Number(week.ties),
                  ],
                  pointsFor: [
                    ...previousObject.pointsFor,
                    Number(
                      previousObject.pointsFor[
                        previousObject.pointsFor.length - 1
                      ]
                    ) + Number(week.pointsFor),
                  ],
                  pointsAgainst: [
                    ...previousObject.pointsAgainst,
                    Number(
                      previousObject.pointsAgainst[
                        previousObject.pointsAgainst.length - 1
                      ]
                    ) + Number(week.pointsAgainst),
                  ],
                  winDifferential: [
                    ...previousObject.winDifferential,
                    Number(
                      previousObject.wins[previousObject.wins.length - 1]
                    ) +
                      Number(week.wins) -
                      (Number(
                        previousObject.losses[previousObject.losses.length - 1]
                      ) +
                        Number(week.losses)),
                  ],
                  pointsDifferential: [
                    ...previousObject.pointsDifferential,
                    Number(
                      previousObject.pointsFor[
                        previousObject.pointsFor.length - 1
                      ]
                    ) +
                      Number(week.pointsFor) -
                      (Number(
                        previousObject.pointsAgainst[
                          previousObject.pointsAgainst.length - 1
                        ]
                      ) +
                        Number(week.pointsAgainst)),
                  ],
                  projectedPointsFor: [
                    ...previousObject.projectedPointsFor,
                    Number(
                      previousObject.projectedPointsFor[
                        previousObject.projectedPointsFor.length - 1
                      ]
                    ) + Number(week.projectedPointsFor),
                  ],
                  projectedPointsAgainst: [
                    ...previousObject.projectedPointsAgainst,
                    Number(
                      previousObject.projectedPointsAgainst[
                        previousObject.projectedPointsAgainst.length - 1
                      ]
                    ) + Number(week.projectedPointsAgainst),
                  ],
                  isPlayoff: week.isPlayoff,
                  isConsolation: week.isConsolation,
                };
                cumulativeWeeks.push(newObject);
                if (
                  newObject.wins[newObject.wins.length - 1] >
                    previousObject.wins[previousObject.wins.length - 1] &&
                  !week.isPlayoff
                ) {
                  winningStreak = winningStreak + 1;
                  if (winningStreak > bestWinningStreak.streak) {
                    bestWinningStreak = {
                      streak: winningStreak,
                      season: season.season,
                    };
                  }
                } else {
                  winningStreak = 0;
                }
                if (
                  newObject.losses[newObject.losses.length - 1] >
                    previousObject.losses[previousObject.losses.length - 1] &&
                  !week.isPlayoff
                ) {
                  losingStreak = losingStreak + 1;
                  if (losingStreak > bestLosingStreak.streak) {
                    bestLosingStreak = {
                      streak: losingStreak,
                      season: season.season,
                    };
                  }
                } else {
                  losingStreak = 0;
                }
                previousObject = newObject;

                if (week.isPlayoff && !week.isConsolation) {
                  const newPlayoffObject = {
                    week: [...previousPlayoffObject.week, week.week],
                    wins: [
                      ...previousPlayoffObject.wins,
                      Number(
                        previousPlayoffObject.wins[
                          previousPlayoffObject.wins.length - 1
                        ]
                      ) + Number(week.wins),
                    ],
                    losses: [
                      ...previousPlayoffObject.losses,
                      Number(
                        previousPlayoffObject.losses[
                          previousPlayoffObject.losses.length - 1
                        ]
                      ) + Number(week.losses),
                    ],
                    ties: [
                      ...previousPlayoffObject.ties,
                      Number(
                        previousPlayoffObject.ties[
                          previousPlayoffObject.ties.length - 1
                        ]
                      ) + Number(week.ties),
                    ],
                    pointsFor: [
                      ...previousPlayoffObject.pointsFor,
                      Number(
                        previousPlayoffObject.pointsFor[
                          previousPlayoffObject.pointsFor.length - 1
                        ]
                      ) + Number(week.pointsFor),
                    ],
                    pointsAgainst: [
                      ...previousPlayoffObject.pointsAgainst,
                      Number(
                        previousPlayoffObject.pointsAgainst[
                          previousPlayoffObject.pointsAgainst.length - 1
                        ]
                      ) + Number(week.pointsAgainst),
                    ],
                    winDifferential: [
                      ...previousPlayoffObject.winDifferential,
                      Number(
                        previousPlayoffObject.wins[
                          previousPlayoffObject.wins.length - 1
                        ]
                      ) +
                        Number(week.wins) -
                        (Number(
                          previousPlayoffObject.losses[
                            previousPlayoffObject.losses.length - 1
                          ]
                        ) +
                          Number(week.losses)),
                    ],
                    pointsDifferential: [
                      ...previousPlayoffObject.pointsDifferential,
                      Number(
                        previousPlayoffObject.pointsFor[
                          previousPlayoffObject.pointsFor.length - 1
                        ]
                      ) +
                        Number(week.pointsFor) -
                        (Number(
                          previousPlayoffObject.pointsAgainst[
                            previousPlayoffObject.pointsAgainst.length - 1
                          ]
                        ) +
                          Number(week.pointsAgainst)),
                    ],
                    projectedPointsFor: [
                      ...previousPlayoffObject.projectedPointsFor,
                      Number(
                        previousPlayoffObject.projectedPointsFor[
                          previousPlayoffObject.projectedPointsFor.length - 1
                        ]
                      ) + Number(week.projectedPointsFor),
                    ],
                    projectedPointsAgainst: [
                      ...previousPlayoffObject.projectedPointsAgainst,
                      Number(
                        previousPlayoffObject.projectedPointsAgainst[
                          previousPlayoffObject.projectedPointsAgainst.length -
                            1
                        ]
                      ) + Number(week.projectedPointsAgainst),
                    ],
                  };
                  previousPlayoffObject = newPlayoffObject;
                }
                if (week.isPlayoff && week.isConsolation) {
                  const newConsolationObject = {
                    week: [...previousConsolationObject.week, week.week],
                    wins: [
                      ...previousConsolationObject.wins,
                      Number(
                        previousConsolationObject.wins[
                          previousConsolationObject.wins.length - 1
                        ]
                      ) + Number(week.wins),
                    ],
                    losses: [
                      ...previousConsolationObject.losses,
                      Number(
                        previousConsolationObject.losses[
                          previousConsolationObject.losses.length - 1
                        ]
                      ) + Number(week.losses),
                    ],
                    ties: [
                      ...previousConsolationObject.ties,
                      Number(
                        previousConsolationObject.ties[
                          previousConsolationObject.ties.length - 1
                        ]
                      ) + Number(week.ties),
                    ],
                    pointsFor: [
                      ...previousConsolationObject.pointsFor,
                      Number(
                        previousConsolationObject.pointsFor[
                          previousConsolationObject.pointsFor.length - 1
                        ]
                      ) + Number(week.pointsFor),
                    ],
                    pointsAgainst: [
                      ...previousConsolationObject.pointsAgainst,
                      Number(
                        previousConsolationObject.pointsAgainst[
                          previousConsolationObject.pointsAgainst.length - 1
                        ]
                      ) + Number(week.pointsAgainst),
                    ],
                    winDifferential: [
                      ...previousConsolationObject.winDifferential,
                      Number(
                        previousConsolationObject.wins[
                          previousConsolationObject.wins.length - 1
                        ]
                      ) +
                        Number(week.wins) -
                        (Number(
                          previousConsolationObject.losses[
                            previousConsolationObject.losses.length - 1
                          ]
                        ) +
                          Number(week.losses)),
                    ],
                    pointsDifferential: [
                      ...previousConsolationObject.pointsDifferential,
                      Number(
                        previousConsolationObject.pointsFor[
                          previousConsolationObject.pointsFor.length - 1
                        ]
                      ) +
                        Number(week.pointsFor) -
                        (Number(
                          previousConsolationObject.pointsAgainst[
                            previousConsolationObject.pointsAgainst.length - 1
                          ]
                        ) +
                          Number(week.pointsAgainst)),
                    ],
                    projectedPointsFor: [
                      ...previousConsolationObject.projectedPointsFor,
                      Number(
                        previousConsolationObject.projectedPointsFor[
                          previousConsolationObject.projectedPointsFor.length -
                            1
                        ]
                      ) + Number(week.projectedPointsFor),
                    ],
                    projectedPointsAgainst: [
                      ...previousConsolationObject.projectedPointsAgainst,
                      Number(
                        previousConsolationObject.projectedPointsAgainst[
                          previousConsolationObject.projectedPointsAgainst
                            .length - 1
                        ]
                      ) + Number(week.projectedPointsAgainst),
                    ],
                  };
                  previousConsolationObject = newConsolationObject;
                }
              });
              cumulativeWeeks.forEach((week) => {
                week.week.shift();
                week.wins.shift();
                week.losses.shift();
                week.ties.shift();
                week.pointsFor.shift();
                week.pointsAgainst.shift();
                week.winDifferential.shift();
                week.pointsDifferential.shift();
                week.projectedPointsFor.shift();
                week.projectedPointsAgainst.shift();
              });

              // previousPlayoffObject.week.shift();
              // previousPlayoffObject.wins.shift();
              // previousPlayoffObject.losses.shift();
              // previousPlayoffObject.ties.shift();
              // previousPlayoffObject.pointsFor.shift();
              // previousPlayoffObject.pointsAgainst.shift();
              // previousPlayoffObject.winDifferential.shift();
              // previousPlayoffObject.pointsDifferential.shift();
              // previousPlayoffObject.projectedPointsFor.shift();
              // previousPlayoffObject.projectedPointsAgainst.shift();

              // previousConsolationObject.week.shift();
              // previousConsolationObject.wins.shift();
              // previousConsolationObject.losses.shift();
              // previousConsolationObject.ties.shift();
              // previousConsolationObject.pointsFor.shift();
              // previousConsolationObject.pointsAgainst.shift();
              // previousConsolationObject.winDifferential.shift();
              // previousConsolationObject.pointsDifferential.shift();
              // previousConsolationObject.projectedPointsFor.shift();
              // previousConsolationObject.projectedPointsAgainst.shift();

              cumulativeRecord.push({
                season: season.season,
                seasonKey: season.seasonKey,
                seasonStartWeek: season.seasonStartWeek,
                seasonEndWeek: season.seasonEndWeek,
                seasonWeeks: season.seasonWeeks,
                regularSeasonRecord: cumulativeWeeks.filter(
                  (week) => !week.isPlayoff && !week.isConsolation
                )
                  ? cumulativeWeeks.filter(
                      (week) => !week.isPlayoff && !week.isConsolation
                    )[
                      cumulativeWeeks.filter(
                        (week) => !week.isPlayoff && !week.isConsolation
                      ).length - 1
                    ]
                  : "N/A",
                playoffSeasonRecord: previousPlayoffObject,
                consolationSeasonRecord: previousConsolationObject,
                week: cumulativeWeeks,
              });
            });
            cumulativeRecord.forEach((season) => {
              //   season.regularSeasonRecord.week.shift();
              //   season.regularSeasonRecord.wins.shift();
              //   season.regularSeasonRecord.losses.shift();
              //   season.regularSeasonRecord.ties.shift();
              //   season.regularSeasonRecord.pointsFor.shift();
              //   season.regularSeasonRecord.pointsAgainst.shift();
              //   season.regularSeasonRecord.winDifferential.shift();
              //   season.regularSeasonRecord.pointsDifferential.shift();
              //   season.regularSeasonRecord.projectedPointsFor.shift();
              //   season.regularSeasonRecord.projectedPointsAgainst.shift();

              season.playoffSeasonRecord.week.shift();
              season.playoffSeasonRecord.wins.shift();
              season.playoffSeasonRecord.losses.shift();
              season.playoffSeasonRecord.ties.shift();
              season.playoffSeasonRecord.pointsFor.shift();
              season.playoffSeasonRecord.pointsAgainst.shift();
              season.playoffSeasonRecord.winDifferential.shift();
              season.playoffSeasonRecord.pointsDifferential.shift();
              season.playoffSeasonRecord.projectedPointsFor.shift();
              season.playoffSeasonRecord.projectedPointsAgainst.shift();

              season.consolationSeasonRecord.week.shift();
              season.consolationSeasonRecord.wins.shift();
              season.consolationSeasonRecord.losses.shift();
              season.consolationSeasonRecord.ties.shift();
              season.consolationSeasonRecord.pointsFor.shift();
              season.consolationSeasonRecord.pointsAgainst.shift();
              season.consolationSeasonRecord.winDifferential.shift();
              season.consolationSeasonRecord.pointsDifferential.shift();
              season.consolationSeasonRecord.projectedPointsFor.shift();
              season.consolationSeasonRecord.projectedPointsAgainst.shift();
            });
            let overallCumulativeRecord = [];
            let previousCumulativeRecord = {
              season: "",
              seasonWeeks: [],
              regularSeasonRecord: {
                wins: 0,
                losses: 0,
                ties: 0,
                pointsFor: 0,
                pointsAgainst: 0,
                winDifferential: 0,
                pointsDifferential: 0,
                projectedPointsFor: 0,
                projectedPointsAgainst: 0,
              },
              playoffSeasonRecord: {
                wins: 0,
                losses: 0,
                ties: 0,
                pointsFor: 0,
                pointsAgainst: 0,
                winDifferential: 0,
                pointsDifferential: 0,
                projectedPointsFor: 0,
                projectedPointsAgainst: 0,
                playoffAppearances: [],
              },
              consolationSeasonRecord: {
                wins: 0,
                losses: 0,
                ties: 0,
                pointsFor: 0,
                pointsAgainst: 0,
                winDifferential: 0,
                pointsDifferential: 0,
                projectedPointsFor: 0,
                projectedPointsAgainst: 0,
                consolationAppearances: [],
              },
            };
            cumulativeRecord.forEach((season) => {
              const newCumulativeRecord = {
                season: season.season,
                seasonWeeks: season.seasonWeeks,
                regularSeasonRecord: {
                  wins: Number(
                    season.regularSeasonRecord.wins[
                      season.regularSeasonRecord.wins.length - 1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.regularSeasonRecord.wins
                      ) +
                      Number(
                        season.regularSeasonRecord.wins[
                          season.regularSeasonRecord.wins.length - 1
                        ]
                      )
                    : Number(previousCumulativeRecord.regularSeasonRecord.wins),
                  losses: Number(
                    season.regularSeasonRecord.losses[
                      season.regularSeasonRecord.losses.length - 1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.regularSeasonRecord.losses
                      ) +
                      Number(
                        season.regularSeasonRecord.losses[
                          season.regularSeasonRecord.losses.length - 1
                        ]
                      )
                    : Number(
                        previousCumulativeRecord.regularSeasonRecord.losses
                      ),
                  ties: Number(
                    season.regularSeasonRecord.ties[
                      season.regularSeasonRecord.ties.length - 1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.regularSeasonRecord.ties
                      ) +
                      Number(
                        season.regularSeasonRecord.ties[
                          season.regularSeasonRecord.ties.length - 1
                        ]
                      )
                    : Number(previousCumulativeRecord.regularSeasonRecord.ties),
                  pointsFor: Number(
                    season.regularSeasonRecord.pointsFor[
                      season.regularSeasonRecord.pointsFor.length - 1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.regularSeasonRecord.pointsFor
                      ) +
                      Number(
                        season.regularSeasonRecord.pointsFor[
                          season.regularSeasonRecord.pointsFor.length - 1
                        ]
                      )
                    : Number(
                        previousCumulativeRecord.regularSeasonRecord.pointsFor
                      ),
                  pointsAgainst: Number(
                    season.regularSeasonRecord.pointsAgainst[
                      season.regularSeasonRecord.pointsAgainst.length - 1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.regularSeasonRecord
                          .pointsAgainst
                      ) +
                      Number(
                        season.regularSeasonRecord.pointsAgainst[
                          season.regularSeasonRecord.pointsAgainst.length - 1
                        ]
                      )
                    : Number(
                        previousCumulativeRecord.regularSeasonRecord
                          .pointsAgainst
                      ),
                  winDifferential:
                    Number(
                      season.regularSeasonRecord.wins[
                        season.regularSeasonRecord.wins.length - 1
                      ]
                    ) &&
                    Number(
                      season.regularSeasonRecord.losses[
                        season.regularSeasonRecord.losses.length - 1
                      ]
                    )
                      ? Number(
                          previousCumulativeRecord.regularSeasonRecord.wins
                        ) +
                        Number(
                          season.regularSeasonRecord.wins[
                            season.regularSeasonRecord.wins.length - 1
                          ]
                        ) -
                        (Number(
                          previousCumulativeRecord.regularSeasonRecord.losses
                        ) +
                          Number(
                            season.regularSeasonRecord.losses[
                              season.regularSeasonRecord.losses.length - 1
                            ]
                          ))
                      : Number(
                          season.regularSeasonRecord.wins[
                            season.regularSeasonRecord.wins.length - 1
                          ]
                        )
                      ? Number(
                          previousCumulativeRecord.regularSeasonRecord.wins
                        ) +
                        Number(
                          season.regularSeasonRecord.wins[
                            season.regularSeasonRecord.wins.length - 1
                          ]
                        ) -
                        Number(
                          previousCumulativeRecord.regularSeasonRecord.losses
                        )
                      : Number(
                          previousCumulativeRecord.regularSeasonRecord.wins
                        ) +
                        -Number(
                          previousCumulativeRecord.regularSeasonRecord.losses
                        ),
                  pointsDifferential:
                    Number(
                      season.regularSeasonRecord.pointsFor[
                        season.regularSeasonRecord.pointsFor.length - 1
                      ]
                    ) &&
                    Number(
                      season.regularSeasonRecord.pointsAgainst[
                        season.regularSeasonRecord.pointsAgainst.length - 1
                      ]
                    )
                      ? Number(
                          previousCumulativeRecord.regularSeasonRecord.pointsFor
                        ) +
                        Number(
                          season.regularSeasonRecord.pointsFor[
                            season.regularSeasonRecord.pointsFor.length - 1
                          ]
                        ) -
                        (Number(
                          previousCumulativeRecord.regularSeasonRecord
                            .pointsAgainst
                        ) +
                          Number(
                            season.regularSeasonRecord.pointsAgainst[
                              season.regularSeasonRecord.pointsAgainst.length -
                                1
                            ]
                          ))
                      : Number(
                          season.regularSeasonRecord.pointsFor[
                            season.regularSeasonRecord.pointsFor.length - 1
                          ]
                        )
                      ? Number(
                          previousCumulativeRecord.regularSeasonRecord.pointsFor
                        ) +
                        Number(
                          season.regularSeasonRecord.pointsFor[
                            season.regularSeasonRecord.pointsFor.length - 1
                          ]
                        ) -
                        Number(
                          previousCumulativeRecord.regularSeasonRecord
                            .pointsAgainst
                        )
                      : Number(
                          previousCumulativeRecord.regularSeasonRecord.pointsFor
                        ) -
                        Number(
                          previousCumulativeRecord.regularSeasonRecord
                            .pointsAgainst
                        ),
                  projectedPointsFor:
                    Number(
                      previousCumulativeRecord.regularSeasonRecord
                        .projectedPointsFor
                    ) +
                    Number(
                      season.regularSeasonRecord.projectedPointsFor[
                        season.regularSeasonRecord.projectedPointsFor.length - 1
                      ]
                    ),
                  projectedPointsAgainst: Number(
                    season.regularSeasonRecord.projectedPointsAgainst[
                      season.regularSeasonRecord.projectedPointsAgainst.length -
                        1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.regularSeasonRecord
                          .projectedPointsAgainst
                      ) +
                      Number(
                        season.regularSeasonRecord.projectedPointsAgainst[
                          season.regularSeasonRecord.projectedPointsAgainst
                            .length - 1
                        ]
                      )
                    : Number(
                        previousCumulativeRecord.regularSeasonRecord
                          .projectedPointsAgainst
                      ),
                },
                playoffSeasonRecord: {
                  wins: Number(
                    season.playoffSeasonRecord.wins[
                      season.playoffSeasonRecord.wins.length - 1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.playoffSeasonRecord.wins
                      ) +
                      Number(
                        season.playoffSeasonRecord.wins[
                          season.playoffSeasonRecord.wins.length - 1
                        ]
                      )
                    : Number(previousCumulativeRecord.playoffSeasonRecord.wins),
                  losses: Number(
                    season.playoffSeasonRecord.losses[
                      season.playoffSeasonRecord.losses.length - 1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.playoffSeasonRecord.losses
                      ) +
                      Number(
                        season.playoffSeasonRecord.losses[
                          season.playoffSeasonRecord.losses.length - 1
                        ]
                      )
                    : Number(
                        previousCumulativeRecord.playoffSeasonRecord.losses
                      ),
                  ties: Number(
                    season.playoffSeasonRecord.ties[
                      season.playoffSeasonRecord.ties.length - 1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.playoffSeasonRecord.ties
                      ) +
                      Number(
                        season.playoffSeasonRecord.ties[
                          season.playoffSeasonRecord.ties.length - 1
                        ]
                      )
                    : Number(previousCumulativeRecord.playoffSeasonRecord.ties),
                  pointsFor: Number(
                    season.playoffSeasonRecord.pointsFor[
                      season.playoffSeasonRecord.pointsFor.length - 1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.playoffSeasonRecord.pointsFor
                      ) +
                      Number(
                        season.playoffSeasonRecord.pointsFor[
                          season.playoffSeasonRecord.pointsFor.length - 1
                        ]
                      )
                    : Number(
                        previousCumulativeRecord.playoffSeasonRecord.pointsFor
                      ),
                  pointsAgainst: Number(
                    season.playoffSeasonRecord.pointsAgainst[
                      season.playoffSeasonRecord.pointsAgainst.length - 1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.playoffSeasonRecord
                          .pointsAgainst
                      ) +
                      Number(
                        season.playoffSeasonRecord.pointsAgainst[
                          season.playoffSeasonRecord.pointsAgainst.length - 1
                        ]
                      )
                    : Number(
                        previousCumulativeRecord.playoffSeasonRecord
                          .pointsAgainst
                      ),
                  winDifferential:
                    Number(
                      season.playoffSeasonRecord.wins[
                        season.playoffSeasonRecord.wins.length - 1
                      ]
                    ) &&
                    Number(
                      season.playoffSeasonRecord.losses[
                        season.playoffSeasonRecord.losses.length - 1
                      ]
                    )
                      ? Number(
                          previousCumulativeRecord.playoffSeasonRecord.wins
                        ) +
                        Number(
                          season.playoffSeasonRecord.wins[
                            season.playoffSeasonRecord.wins.length - 1
                          ]
                        ) -
                        (Number(
                          previousCumulativeRecord.playoffSeasonRecord.losses
                        ) +
                          Number(
                            season.playoffSeasonRecord.losses[
                              season.playoffSeasonRecord.losses.length - 1
                            ]
                          ))
                      : Number(
                          season.playoffSeasonRecord.wins[
                            season.playoffSeasonRecord.wins.length - 1
                          ]
                        )
                      ? Number(
                          previousCumulativeRecord.playoffSeasonRecord.wins
                        ) +
                        Number(
                          season.playoffSeasonRecord.wins[
                            season.playoffSeasonRecord.wins.length - 1
                          ]
                        ) -
                        Number(
                          previousCumulativeRecord.playoffSeasonRecord.losses
                        )
                      : Number(
                          previousCumulativeRecord.playoffSeasonRecord.wins
                        ) -
                        Number(
                          previousCumulativeRecord.playoffSeasonRecord.losses
                        ),
                  pointsDifferential:
                    Number(
                      season.playoffSeasonRecord.pointsFor[
                        season.playoffSeasonRecord.pointsFor.length - 1
                      ]
                    ) &&
                    Number(
                      season.playoffSeasonRecord.pointsAgainst[
                        season.playoffSeasonRecord.pointsAgainst.length - 1
                      ]
                    )
                      ? Number(
                          previousCumulativeRecord.playoffSeasonRecord.pointsFor
                        ) +
                        Number(
                          season.playoffSeasonRecord.pointsFor[
                            season.playoffSeasonRecord.pointsFor.length - 1
                          ]
                        ) -
                        (Number(
                          previousCumulativeRecord.playoffSeasonRecord
                            .pointsAgainst
                        ) +
                          Number(
                            season.playoffSeasonRecord.pointsAgainst[
                              season.playoffSeasonRecord.pointsAgainst.length -
                                1
                            ]
                          ))
                      : Number(
                          season.playoffSeasonRecord.pointsFor[
                            season.playoffSeasonRecord.pointsFor.length - 1
                          ]
                        )
                      ? Number(
                          previousCumulativeRecord.playoffSeasonRecord.pointsFor
                        ) +
                        Number(
                          season.playoffSeasonRecord.pointsFor[
                            season.playoffSeasonRecord.pointsFor.length - 1
                          ]
                        ) -
                        Number(
                          previousCumulativeRecord.playoffSeasonRecord
                            .pointsAgainst
                        )
                      : Number(
                          previousCumulativeRecord.playoffSeasonRecord.pointsFor
                        ) -
                        Number(
                          previousCumulativeRecord.playoffSeasonRecord
                            .pointsAgainst
                        ),
                  projectedPointsFor: Number(
                    season.playoffSeasonRecord.projectedPointsFor[
                      season.playoffSeasonRecord.projectedPointsFor.length - 1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.playoffSeasonRecord
                          .projectedPointsFor
                      ) +
                      Number(
                        season.playoffSeasonRecord.projectedPointsFor[
                          season.playoffSeasonRecord.projectedPointsFor.length -
                            1
                        ]
                      )
                    : Number(
                        previousCumulativeRecord.playoffSeasonRecord
                          .projectedPointsFor
                      ),
                  projectedPointsAgainst: Number(
                    season.playoffSeasonRecord.projectedPointsAgainst[
                      season.playoffSeasonRecord.projectedPointsAgainst.length -
                        1
                    ]
                  )
                    ? Number(
                        previousCumulativeRecord.playoffSeasonRecord
                          .projectedPointsAgainst
                      ) +
                      Number(
                        season.playoffSeasonRecord.projectedPointsAgainst[
                          season.playoffSeasonRecord.projectedPointsAgainst
                            .length - 1
                        ]
                      )
                    : Number(
                        previousCumulativeRecord.playoffSeasonRecord
                          .projectedPointsAgainst
                      ),
                  playoffAppearances: season.playoffSeasonRecord.week.length
                    ? [
                        ...previousCumulativeRecord.playoffSeasonRecord
                          .playoffAppearances,
                        season.season,
                      ]
                    : previousCumulativeRecord.playoffSeasonRecord
                        .playoffAppearances,
                },
                consolationSeasonRecord: {
                  wins: season.consolationSeasonRecord.wins[
                    season.consolationSeasonRecord.wins.length - 1
                  ]
                    ? previousCumulativeRecord.consolationSeasonRecord.wins +
                      season.consolationSeasonRecord.wins[
                        season.consolationSeasonRecord.wins.length - 1
                      ]
                    : previousCumulativeRecord.consolationSeasonRecord.wins,
                  losses: season.consolationSeasonRecord.losses[
                    season.consolationSeasonRecord.losses.length - 1
                  ]
                    ? previousCumulativeRecord.consolationSeasonRecord.losses +
                      season.consolationSeasonRecord.losses[
                        season.consolationSeasonRecord.losses.length - 1
                      ]
                    : previousCumulativeRecord.consolationSeasonRecord.losses,
                  ties: season.consolationSeasonRecord.ties[
                    season.consolationSeasonRecord.ties.length - 1
                  ]
                    ? previousCumulativeRecord.consolationSeasonRecord.ties +
                      season.consolationSeasonRecord.ties[
                        season.consolationSeasonRecord.ties.length - 1
                      ]
                    : previousCumulativeRecord.consolationSeasonRecord.ties,
                  pointsFor: season.consolationSeasonRecord.pointsFor[
                    season.consolationSeasonRecord.pointsFor.length - 1
                  ]
                    ? previousCumulativeRecord.consolationSeasonRecord
                        .pointsFor +
                      season.consolationSeasonRecord.pointsFor[
                        season.consolationSeasonRecord.pointsFor.length - 1
                      ]
                    : previousCumulativeRecord.consolationSeasonRecord
                        .pointsFor,
                  pointsAgainst: season.consolationSeasonRecord.pointsAgainst[
                    season.consolationSeasonRecord.pointsAgainst.length - 1
                  ]
                    ? previousCumulativeRecord.consolationSeasonRecord
                        .pointsAgainst +
                      season.consolationSeasonRecord.pointsAgainst[
                        season.consolationSeasonRecord.pointsAgainst.length - 1
                      ]
                    : previousCumulativeRecord.consolationSeasonRecord
                        .pointsAgainst,
                  winDifferential:
                    season.consolationSeasonRecord.wins[
                      season.consolationSeasonRecord.wins.length - 1
                    ] &&
                    season.consolationSeasonRecord.losses[
                      season.consolationSeasonRecord.losses.length - 1
                    ]
                      ? previousCumulativeRecord.consolationSeasonRecord.wins +
                        season.consolationSeasonRecord.wins[
                          season.consolationSeasonRecord.wins.length - 1
                        ] -
                        (previousCumulativeRecord.consolationSeasonRecord
                          .losses +
                          season.consolationSeasonRecord.losses[
                            season.consolationSeasonRecord.losses.length - 1
                          ])
                      : season.consolationSeasonRecord.wins[
                          season.consolationSeasonRecord.wins.length - 1
                        ]
                      ? previousCumulativeRecord.consolationSeasonRecord.wins +
                        season.consolationSeasonRecord.wins[
                          season.consolationSeasonRecord.wins.length - 1
                        ] -
                        previousCumulativeRecord.consolationSeasonRecord.losses
                      : previousCumulativeRecord.consolationSeasonRecord.wins -
                        previousCumulativeRecord.consolationSeasonRecord.losses,
                  pointsDifferential:
                    season.consolationSeasonRecord.pointsFor[
                      season.consolationSeasonRecord.pointsFor.length - 1
                    ] &&
                    season.consolationSeasonRecord.pointsAgainst[
                      season.consolationSeasonRecord.pointsAgainst.length - 1
                    ]
                      ? previousCumulativeRecord.consolationSeasonRecord
                          .pointsFor +
                        season.consolationSeasonRecord.pointsFor[
                          season.consolationSeasonRecord.pointsFor.length - 1
                        ] -
                        (previousCumulativeRecord.consolationSeasonRecord
                          .pointsAgainst +
                          season.consolationSeasonRecord.pointsAgainst[
                            season.consolationSeasonRecord.pointsAgainst
                              .length - 1
                          ])
                      : season.consolationSeasonRecord.pointsFor[
                          season.consolationSeasonRecord.pointsFor.length - 1
                        ]
                      ? previousCumulativeRecord.consolationSeasonRecord
                          .pointsFor +
                        season.consolationSeasonRecord.pointsFor[
                          season.consolationSeasonRecord.pointsFor.length - 1
                        ] -
                        previousCumulativeRecord.consolationSeasonRecord
                          .pointsAgainst
                      : previousCumulativeRecord.consolationSeasonRecord
                          .pointsFor -
                        previousCumulativeRecord.consolationSeasonRecord
                          .pointsAgainst,
                  projectedPointsFor: season.consolationSeasonRecord
                    .projectedPointsFor[
                    season.consolationSeasonRecord.projectedPointsFor.length - 1
                  ]
                    ? previousCumulativeRecord.consolationSeasonRecord
                        .projectedPointsFor +
                      season.consolationSeasonRecord.projectedPointsFor[
                        season.consolationSeasonRecord.projectedPointsFor
                          .length - 1
                      ]
                    : previousCumulativeRecord.consolationSeasonRecord
                        .projectedPointsFor,
                  projectedPointsAgainst: season.consolationSeasonRecord
                    .projectedPointsAgainst[
                    season.consolationSeasonRecord.projectedPointsAgainst
                      .length - 1
                  ]
                    ? previousCumulativeRecord.consolationSeasonRecord
                        .projectedPointsAgainst +
                      season.consolationSeasonRecord.projectedPointsAgainst[
                        season.consolationSeasonRecord.projectedPointsAgainst
                          .length - 1
                      ]
                    : previousCumulativeRecord.consolationSeasonRecord
                        .projectedPointsAgainst,
                  consolationAppearances: season.consolationSeasonRecord.week
                    .length
                    ? [
                        ...previousCumulativeRecord.consolationSeasonRecord
                          .consolationAppearances,
                        season.season,
                      ]
                    : previousCumulativeRecord.consolationSeasonRecord
                        .consolationAppearances,
                },
              };
              overallCumulativeRecord.push(newCumulativeRecord);
              previousCumulativeRecord = newCumulativeRecord;
            });
            // let overallCumulativeWeeks = [];
            // let previousWeek = {
            //   isConsolation: [],
            //   isPlayoff: [],
            //   losses: [],
            //   pointsAgainst: [],
            //   pointsFor: [],
            //   projectedPointsAgainst: [],
            //   projectedPointsFor: [],
            //   season: "",
            //   ties: [],
            //   week: [],
            //   wins: [],
            // };
            // cumulativeRecord.forEach((season) => {
            //   season.week.forEach((week) => {
            //     const currentWeek = {
            //       isConsolation: [
            //         ...previousWeek.isConsolation,
            //         week.isConsolation,
            //       ],
            //       isPlayoff: [...previousWeek.isPlayoff, week.isPlayoff],
            //       season: season.season,
            //       week: week.week,
            //       wins: [...previousWeek.wins, previousWeek.wins + week.wins],
            //       losses: [
            //         ...previousWeek.losses,
            //         previousWeek.losses + week.losses,
            //       ],
            //       ties: [...previousWeek.ties, previousWeek.ties + week.ties],
            //       pointsFor: [
            //         ...previousWeek.pointsFor,
            //         previousWeek.pointsFor + week.pointsFor,
            //       ],
            //       pointsAgainst: [
            //         ...previousWeek.pointsAgainst,
            //         previousWeek.pointsAgainst + week.pointsAgainst,
            //       ],
            //       projectedPointsFor: [
            //         ...previousWeek.projectedPointsFor,
            //         previousWeek.projectedPointsFor + week.projectedPointsFor,
            //       ],
            //       projectedPointsAgainst: [
            //         ...previousWeek.projectedPointsAgainst,
            //         previousWeek.projectedPointsAgainst +
            //           week.projectedPointsAgainst,
            //       ],
            //     };
            //     overallCumulativeWeeks.push(currentWeek);
            //     previousWeek = currentWeek;
            //   });
            // });
            // overallCumulativeRecord.week = overallCumulativeWeeks;
            // season.forEach((season) => {
            //   overallCumulativeRecord.regularSeasonRecord.wins =
            //     overallCumulativeRecord.regularSeasonRecord.wins +
            //     season.regularSeasonRecord.wins;
            //   overallCumulativeRecord.regularSeasonRecord.losses =
            //     overallCumulativeRecord.regularSeasonRecord.losses +
            //     season.regularSeasonRecord.losses;
            //   overallCumulativeRecord.regularSeasonRecord.ties =
            //     overallCumulativeRecord.regularSeasonRecord.ties +
            //     season.regularSeasonRecord.ties;
            //   overallCumulativeRecord.regularSeasonRecord.pointsFor =
            //     overallCumulativeRecord.regularSeasonRecord.pointsFor +
            //     season.regularSeasonRecord.pointsFor;
            //   overallCumulativeRecord.regularSeasonRecord.pointsAgainst =
            //     overallCumulativeRecord.regularSeasonRecord.pointsAgainst +
            //     season.regularSeasonRecord.pointsAgainst;
            //   overallCumulativeRecord.regularSeasonRecord.projectedPointsFor =
            //     overallCumulativeRecord.regularSeasonRecord.projectedPointsFor +
            //     season.regularSeasonRecord.projectedPointsFor;
            //   overallCumulativeRecord.regularSeasonRecord.projectedPointsAgainst =
            //     overallCumulativeRecord.regularSeasonRecord.projectedPointsAgainst +
            //     season.regularSeasonRecord.projectedPointsAgainst;
            //   if (
            //     season.playoffSeasonRecord.wins > 0 ||
            //     season.playoffSeasonRecord.losses > 0
            //   ) {
            //     overallCumulativeRecord.playoffRecord.playoffAppearances.push(
            //       season.season
            //     );
            //     overallCumulativeRecord.playoffRecord.wins =
            //       overallCumulativeRecord.playoffRecord.wins +
            //       season.playoffSeasonRecord.wins;
            //     overallCumulativeRecord.playoffRecord.losses =
            //       overallCumulativeRecord.playoffRecord.losses +
            //       season.playoffSeasonRecord.losses;
            //     overallCumulativeRecord.playoffRecord.pointsFor =
            //       overallCumulativeRecord.playoffRecord.pointsFor +
            //       season.playoffSeasonRecord.pointsFor;
            //     overallCumulativeRecord.playoffRecord.pointsAgainst =
            //       overallCumulativeRecord.playoffRecord.pointsAgainst +
            //       season.playoffSeasonRecord.pointsAgainst;
            //     overallCumulativeRecord.playoffRecord.projectedPointsFor =
            //       overallCumulativeRecord.playoffRecord.projectedPointsFor +
            //       season.playoffSeasonRecord.projectedPointsFor;
            //     overallCumulativeRecord.playoffRecord.projectedPointsAgainst =
            //       overallCumulativeRecord.playoffRecord.projectedPointsAgainst +
            //       season.playoffSeasonRecord.projectedPointsAgainst;
            //   }
            //   if (
            //     season.consolationSeasonRecord.wins > 0 ||
            //     season.consolationSeasonRecord.losses > 0
            //   ) {
            //     overallCumulativeRecord.consolationRecord.consolationAppearances.push(
            //       season.season
            //     );
            //     overallCumulativeRecord.consolationRecord.wins =
            //       overallCumulativeRecord.consolationRecord.wins +
            //       season.consolationSeasonRecord.wins;
            //     overallCumulativeRecord.consolationRecord.losses =
            //       overallCumulativeRecord.consolationRecord.losses +
            //       season.consolationSeasonRecord.losses;
            //     overallCumulativeRecord.consolationRecord.pointsFor =
            //       overallCumulativeRecord.consolationRecord.pointsFor +
            //       season.consolationSeasonRecord.pointsFor;
            //     overallCumulativeRecord.consolationRecord.pointsAgainst =
            //       overallCumulativeRecord.consolationRecord.pointsAgainst +
            //       season.consolationSeasonRecord.pointsAgainst;
            //     overallCumulativeRecord.consolationRecord.projectedPointsFor =
            //       overallCumulativeRecord.consolationRecord.projectedPointsFor +
            //       season.consolationSeasonRecord.projectedPointsFor;
            //     overallCumulativeRecord.consolationRecord.projectedPointsAgainst =
            //       overallCumulativeRecord.consolationRecord.projectedPointsAgainst +
            //       season.consolationSeasonRecord.projectedPointsAgainst;
            //   }
            // });

            let gameRecords = {
              winningStreak: [
                {
                  ...bestWinningStreak,
                  name: manager.name,
                  managerName: manager.managerName,
                  logo: manager.logo,
                },
              ],
              losingStreak: [
                {
                  ...bestLosingStreak,
                  name: manager.name,
                  managerName: manager.managerName,
                  logo: manager.logo,
                },
              ],
              mostPointsGame: [{ pointsFor: 0 }],
              leastPointsGame: [{ pointsFor: 1000000 }],
              highestScoreVSProjection: [
                {
                  pointsFor: 0,
                  projectedPointsFor: 1000000,
                },
              ],
              mostAccurateProjection: [
                {
                  pointsFor: 0,
                  projectedPointsFor: 1000000,
                },
              ],
              biggestWin: [{ pointsFor: 0, pointsAgainst: 0 }],
              biggestLoss: [{ pointsFor: 1000000, pointsAgainst: 0 }],
              closestMatch: [{ pointsFor: 1000000, pointsAgainst: -1000000 }],
              mostPointsInLoss: [{ pointsFor: 0, pointsAgainst: 0 }],
              leastPointsInWin: [{ pointsFor: 1000000, pointsAgainst: 0 }],
            };
            weeklyRecord.forEach((season) => {
              season.matchups.forEach((week) => {
                if (week.pointsFor > gameRecords.mostPointsGame[0].pointsFor) {
                  gameRecords.mostPointsGame = [
                    { ...week, season: season.season },
                  ];
                } else if (
                  week.pointsFor === gameRecords.mostPointsGame[0].pointsFor
                ) {
                  gameRecords.mostPointsGame.push({
                    ...week,
                    season: season.season,
                    seasonKey: season.seasonKey,
                  });
                }
                if (
                  week.pointsFor < gameRecords.leastPointsGame[0].pointsFor &&
                  week.status === "postevent"
                ) {
                  gameRecords.leastPointsGame = [
                    {
                      ...week,
                      season: season.season,
                      seasonKey: season.seasonKey,
                    },
                  ];
                } else if (
                  week.pointsFor === gameRecords.leastPointsGame[0].pointsFor &&
                  week.status === "postevent"
                ) {
                  gameRecords.leastPointsGame.push({
                    ...week,
                    season: season.season,
                    seasonKey: season.seasonKey,
                  });
                }
                if (
                  week.pointsFor - week.pointsAgainst >
                  gameRecords.biggestWin[0].pointsFor -
                    gameRecords.biggestWin[0].pointsAgainst
                ) {
                  gameRecords.biggestWin = [
                    {
                      ...week,
                      season: season.season,
                      seasonKey: season.seasonKey,
                    },
                  ];
                } else if (
                  week.pointsFor - week.pointsAgainst ===
                  gameRecords.biggestWin[0].pointsFor -
                    gameRecords.biggestWin[0].pointsAgainst
                ) {
                  gameRecords.biggestWin.push({
                    ...week,
                    season: season.season,
                    seasonKey: season.seasonKey,
                  });
                }
                if (
                  week.pointsFor - week.pointsAgainst <
                  gameRecords.biggestLoss[0].pointsFor -
                    gameRecords.biggestLoss[0].pointsAgainst
                ) {
                  gameRecords.biggestLoss = [
                    {
                      ...week,
                      season: season.season,
                      seasonKey: season.seasonKey,
                    },
                  ];
                } else if (
                  week.pointsFor - week.pointsAgainst ===
                  gameRecords.biggestLoss[0].pointsFor -
                    gameRecords.biggestLoss[0].pointsAgainst
                ) {
                  gameRecords.biggestLoss.push({
                    ...week,
                    season: season.season,
                    seasonKey: season.seasonKey,
                  });
                }
                if (
                  week.pointsFor > gameRecords.mostPointsInLoss[0].pointsFor &&
                  week.losses === 1
                ) {
                  gameRecords.mostPointsInLoss = [
                    {
                      ...week,
                      season: season.season,
                      seasonKey: season.seasonKey,
                    },
                  ];
                } else if (
                  week.pointsFor ===
                    gameRecords.mostPointsInLoss[0].pointsFor &&
                  week.losses === 1
                ) {
                  gameRecords.mostPointsInLoss.push({
                    ...week,
                    season: season.season,
                    seasonKey: season.seasonKey,
                  });
                }
                if (
                  week.pointsFor < gameRecords.leastPointsInWin[0].pointsFor &&
                  week.wins === 1
                ) {
                  gameRecords.leastPointsInWin = [
                    {
                      ...week,
                      season: season.season,
                      seasonKey: season.seasonKey,
                    },
                  ];
                } else if (
                  week.pointsFor ===
                    gameRecords.leastPointsInWin[0].pointsFor &&
                  week.wins === 1
                ) {
                  gameRecords.leastPointsInWin.push({
                    ...week,
                    season: season.season,
                    seasonKey: season.seasonKey,
                  });
                }
                if (
                  Math.abs(week.pointsFor - week.pointsAgainst) <
                    Math.abs(
                      gameRecords.closestMatch[0].pointsFor -
                        gameRecords.closestMatch[0].pointsAgainst
                    ) &&
                  week.ties != 1 &&
                  week.status === "postevent"
                ) {
                  gameRecords.closestMatch = [
                    {
                      ...week,
                      season: season.season,
                      seasonKey: season.seasonKey,
                    },
                  ];
                } else if (
                  Math.abs(week.pointsFor - week.pointsAgainst) ===
                    Math.abs(
                      gameRecords.closestMatch[0].pointsFor -
                        gameRecords.closestMatch[0].pointsAgainst
                    ) &&
                  week.ties != 1 &&
                  week.status === "postevent"
                ) {
                  gameRecords.closestMatch.push({
                    ...week,
                    season: season.season,
                    seasonKey: season.seasonKey,
                  });
                }
                if (
                  week.pointsFor - week.projectedPointsFor >
                  gameRecords.highestScoreVSProjection[0].pointsFor -
                    gameRecords.highestScoreVSProjection[0].projectedPointsFor
                ) {
                  gameRecords.highestScoreVSProjection = [
                    {
                      ...week,
                      season: season.season,
                      seasonKey: season.seasonKey,
                    },
                  ];
                } else if (
                  week.pointsFor - week.projectedPointsFor ===
                  gameRecords.highestScoreVSProjection[0].pointsFor -
                    gameRecords.highestScoreVSProjection[0].projectedPointsFor
                ) {
                  gameRecords.highestScoreVSProjection.push({
                    ...week,
                    season: season.season,
                    seasonKey: season.seasonKey,
                  });
                }
                if (
                  Math.abs(week.pointsFor - week.projectedPointsFor) <
                  Math.abs(
                    gameRecords.mostAccurateProjection[0].pointsFor -
                      gameRecords.mostAccurateProjection[0].projectedPointsFor
                  )
                ) {
                  gameRecords.mostAccurateProjection = [
                    {
                      ...week,
                      season: season.season,
                      seasonKey: season.seasonKey,
                    },
                  ];
                } else if (
                  Math.abs(week.pointsFor - week.projectedPointsFor) ===
                  Math.abs(
                    gameRecords.mostAccurateProjection[0].pointsFor -
                      gameRecords.mostAccurateProjection[0].projectedPointsFor
                  )
                ) {
                  gameRecords.mostAccurateProjection.push({
                    ...week,
                    season: season.season,
                    seasonKey: season.seasonKey,
                  });
                }
              });
            });

            return {
              ...manager,
              weeklyRecord,
              cumulativeRecord,
              overallCumulativeRecord,
              gameRecords,
            };
          });

          let overallRecords = {
            winningStreak: [{ streak: 0 }],
            losingStreak: [{ streak: 0 }],
            mostPointsGame: [{ pointsFor: 0 }],
            leastPointsGame: [{ pointsFor: 1000000 }],
            mostPointsSeason: [{ pointsFor: 0 }],
            leastPointsSeason: [{ pointsFor: 1000000 }],
            mostPointsAgainstSeason: [{ pointsAgainst: 0 }],
            leastPointsAgainstSeason: [{ pointsAgainst: 1000000 }],
            biggestWin: [{ pointsFor: 0, pointsAgainst: 0 }],
            biggestLoss: [
              {
                pointsFor: 1000000,
                pointsAgainst: 0,
              },
            ],
            highestScoreVSProjection: [
              {
                pointsFor: 0,
                projectedPointsFor: 1000000,
              },
            ],
            mostAccurateProjection: [
              {
                pointsFor: 0,
                projectedPointsFor: 1000000,
              },
            ],
            closestMatch: [
              {
                pointsFor: 1000000,
                pointsAgainst: -1000000,
              },
            ],
            mostPointsInLoss: [{ pointsFor: 0, pointsAgainst: 0 }],
            leastPointsInWin: [
              {
                pointsFor: 1000000,
                pointsAgainst: 0,
              },
            ],
            mostWins: [{ wins: 0 }],
            mostLosses: [{ losses: 0 }],
          };

          leagueTeams.forEach((season) => {
            if (season.season != "Overall") {
              if (
                season.seasonRecords.mostPointsGame[0].pointsFor >
                overallRecords.mostPointsGame[0].pointsFor
              ) {
                overallRecords.mostPointsGame =
                  season.seasonRecords.mostPointsGame;
              } else if (
                season.seasonRecords.mostPointsGame[0].pointsFor ===
                overallRecords.mostPointsGame[0].pointsFor
              ) {
                season.seasonRecords.mostPointsGame.forEach((game) => {
                  overallRecords.mostPointsGame.push(game);
                });
              }
              if (
                season.seasonRecords.leastPointsGame[0].pointsFor <
                overallRecords.leastPointsGame[0].pointsFor
              ) {
                overallRecords.leastPointsGame =
                  season.seasonRecords.leastPointsGame;
              } else if (
                season.seasonRecords.leastPointsGame[0].pointsFor ===
                overallRecords.leastPointsGame[0].pointsFor
              ) {
                season.seasonRecords.leastPoints.forEach((game) => {
                  overallRecords.leastPointsGame.push(game);
                });
              }
              if (
                season.seasonRecords.biggestWin[0].pointsFor -
                  season.seasonRecords.biggestWin[0].pointsAgainst >
                overallRecords.biggestWin[0].pointsFor -
                  overallRecords.biggestWin[0].pointsAgainst
              ) {
                overallRecords.biggestWin = season.seasonRecords.biggestWin;
              } else if (
                season.seasonRecords.biggestWin[0].pointsFor -
                  season.seasonRecords.biggestWin[0].pointsAgainst ===
                overallRecords.biggestWin[0].pointsFor -
                  overallRecords.biggestWin[0].pointsAgainst
              ) {
                season.seasonRecords.biggestWin.forEach((game) => {
                  overallRecords.biggestWin.push(game);
                });
              }
              if (
                season.seasonRecords.biggestLoss[0].pointsFor -
                  season.seasonRecords.biggestLoss[0].pointsAgainst <
                overallRecords.biggestLoss[0].pointsFor -
                  overallRecords.biggestLoss[0].pointsAgainst
              ) {
                overallRecords.biggestLoss = season.seasonRecords.biggestLoss;
              } else if (
                season.seasonRecords.biggestLoss[0].pointsFor -
                  season.seasonRecords.biggestLoss[0].pointsAgainst ===
                overallRecords.biggestLoss[0].pointsFor -
                  overallRecords.biggestLoss[0].pointsAgainst
              ) {
                season.seasonRecords.biggestLoss.forEach((game) => {
                  overallRecords.biggestLoss.push(game);
                });
              }
              if (
                season.seasonRecords.mostPointsInLoss[0].pointsFor >
                overallRecords.mostPointsInLoss[0].pointsFor
              ) {
                overallRecords.mostPointsInLoss =
                  season.seasonRecords.mostPointsInLoss;
              } else if (
                season.seasonRecords.mostPointsInLoss[0].pointsFor ===
                overallRecords.mostPointsInLoss[0].pointsFor
              ) {
                season.seasonRecords.mostPointsInLoss.forEach((game) => {
                  overallRecords.mostPointsInLoss.push(game);
                });
              }
              if (
                season.seasonRecords.leastPointsInWin[0].pointsFor <
                overallRecords.leastPointsInWin[0].pointsFor
              ) {
                overallRecords.leastPointsInWin =
                  season.seasonRecords.leastPointsInWin;
              } else if (
                season.seasonRecords.leastPointsInWin[0].pointsFor ===
                overallRecords.leastPointsInWin[0].pointsFor
              ) {
                season.seasonRecords.leastPointsInWin.forEach((game) => {
                  overallRecords.leastPointsInWin.push(game);
                });
              }
              if (
                season.seasonRecords.mostWins[0].wins >
                overallRecords.mostWins[0].wins
              ) {
                overallRecords.mostWins = season.seasonRecords.mostWins;
              } else if (
                season.seasonRecords.mostWins[0].wins ===
                overallRecords.mostWins[0].wins
              ) {
                season.seasonRecords.mostWins.forEach((person) => {
                  overallRecords.mostWins.push(person);
                });
              }
              if (
                season.seasonRecords.mostLosses[0].losses >
                overallRecords.mostLosses[0].losses
              ) {
                overallRecords.mostLosses = season.seasonRecords.mostLosses;
              } else if (
                season.seasonRecords.mostLosses[0].losses ===
                overallRecords.mostLosses[0].losses
              ) {
                season.seasonRecords.mostLosses.forEach((person) => {
                  overallRecords.mostLosses.push(person);
                });
              }
              if (
                season.seasonRecords.mostPointsSeason[0].pointsFor >
                overallRecords.mostPointsSeason[0].pointsFor
              ) {
                overallRecords.mostPointsSeason =
                  season.seasonRecords.mostPointsSeason;
              } else if (
                season.seasonRecords.mostPointsSeason[0].pointsFor ===
                overallRecords.mostPointsSeason[0].pointsFor
              ) {
                season.seasonRecords.mostPointsSeason.forEach((person) => {
                  overallRecords.mostPointsSeason.push(person);
                });
              }
              if (
                season.seasonRecords.leastPointsSeason[0].pointsFor <
                overallRecords.leastPointsSeason[0].pointsFor
              ) {
                overallRecords.leastPointsSeason =
                  season.seasonRecords.leastPointsSeason;
              } else if (
                season.seasonRecords.leastPointsSeason[0].pointsFor ===
                overallRecords.leastPointsSeason[0].pointsFor
              ) {
                season.seasonRecords.leastPointsSeason.forEach((person) => {
                  overallRecords.leastPointsSeason.push(person);
                });
              }
              if (
                season.seasonRecords.mostPointsAgainstSeason[0].pointsAgainst >
                overallRecords.mostPointsAgainstSeason[0].pointsAgainst
              ) {
                overallRecords.mostPointsAgainstSeason =
                  season.seasonRecords.mostPointsAgainstSeason;
              } else if (
                season.seasonRecords.mostPointsAgainstSeason[0]
                  .pointsAgainst ===
                overallRecords.mostPointsAgainstSeason[0].pointsAgainst
              ) {
                season.seasonRecords.mostPointsAgainstSeason.forEach(
                  (person) => {
                    overallRecords.mostPointsAgainstSeason.push(person);
                  }
                );
              }
              if (
                season.seasonRecords.leastPointsAgainstSeason[0].pointsAgainst <
                overallRecords.leastPointsAgainstSeason[0].pointsAgainst
              ) {
                overallRecords.leastPointsAgainstSeason =
                  season.seasonRecords.leastPointsAgainstSeason;
              } else if (
                season.seasonRecords.leastPointsAgainstSeason[0]
                  .pointsAgainst ===
                overallRecords.leastPointsAgainstSeason[0].pointsAgainst
              ) {
                season.seasonRecords.leastPointsAgainstSeason.forEach(
                  (person) => {
                    overallRecords.leastPointsAgainstSeason.push(person);
                  }
                );
              }

              if (
                Math.abs(
                  season.seasonRecords.closestMatch[0].pointsFor -
                    season.seasonRecords.closestMatch[0].pointsAgainst
                ) <
                Math.abs(
                  overallRecords.closestMatch[0].pointsFor -
                    overallRecords.closestMatch[0].pointsAgainst
                )
              ) {
                overallRecords.closestMatch = season.seasonRecords.closestMatch;
              } else if (
                Math.abs(
                  season.seasonRecords.closestMatch[0].pointsFor -
                    season.seasonRecords.closestMatch[0].pointsAgainst
                ) ===
                  Math.abs(
                    overallRecords.closestMatch[0].pointsFor -
                      overallRecords.closestMatch[0].pointsAgainst
                  ) &&
                overallRecords.closestMatch[0].name !=
                  season.seasonRecords.closestMatch[0].opponentName
              ) {
                season.seasonRecords.closestMatch.forEach((game) => {
                  overallRecords.closestMatch.push(game);
                });
              }
              if (
                season.seasonRecords.highestScoreVSProjection[0].pointsFor -
                  season.seasonRecords.highestScoreVSProjection[0]
                    .projectedPointsFor >
                overallRecords.highestScoreVSProjection[0].pointsFor -
                  overallRecords.highestScoreVSProjection[0].projectedPointsFor
              ) {
                overallRecords.highestScoreVSProjection =
                  season.seasonRecords.highestScoreVSProjection;
              } else if (
                season.seasonRecords.highestScoreVSProjection[0].pointsFor -
                  season.seasonRecords.highestScoreVSProjection[0]
                    .projectedPointsFor ===
                overallRecords.highestScoreVSProjection[0].pointsFor -
                  overallRecords.highestScoreVSProjection[0].projectedPointsFor
              ) {
                season.seasonRecords.highestScoreVSProjection.forEach(
                  (game) => {
                    overallRecords.highestScoreVSProjection.push(game);
                  }
                );
              }
              if (
                Math.abs(
                  season.seasonRecords.mostAccurateProjection[0].pointsFor -
                    season.seasonRecords.mostAccurateProjection[0]
                      .projectedPointsFor
                ) <
                Math.abs(
                  overallRecords.mostAccurateProjection[0].pointsFor -
                    overallRecords.mostAccurateProjection[0].projectedPointsFor
                )
              ) {
                overallRecords.mostAccurateProjection =
                  season.seasonRecords.mostAccurateProjection;
              } else if (
                Math.abs(
                  season.seasonRecords.mostAccurateProjection[0].pointsFor -
                    season.seasonRecords.mostAccurateProjection[0]
                      .projectedPointsFor
                ) ===
                Math.abs(
                  overallRecords.mostAccurateProjection[0].pointsFor -
                    overallRecords.mostAccurateProjection[0].projectedPointsFor
                )
              ) {
                season.seasonRecords.mostAccurateProjection.forEach((game) => {
                  overallRecords.mostAccurateProjection.push(game);
                });
              }
              if (
                season.seasonRecords.winningStreak[0].streak >
                overallRecords.winningStreak[0].streak
              ) {
                overallRecords.winningStreak =
                  season.seasonRecords.winningStreak;
              } else if (
                season.seasonRecords.winningStreak[0].streak ===
                overallRecords.winningStreak[0].streak
              ) {
                season.seasonRecords.winningStreak.forEach((game) => {
                  overallRecords.winningStreak.push(game);
                });
              }
              if (
                season.seasonRecords.losingStreak[0].streak >
                overallRecords.losingStreak[0].streak
              ) {
                overallRecords.losingStreak = season.seasonRecords.losingStreak;
              } else if (
                season.seasonRecords.losingStreak[0].streak ===
                overallRecords.losingStreak[0].streak
              ) {
                season.seasonRecords.losingStreak.forEach((game) => {
                  overallRecords.losingStreak.push(game);
                });
              }
            }
          });
          leagueTeams[leagueTeams.length - 1].overallRecords = overallRecords;

          return NextResponse(leagueTeams, { status: 200 });
        } catch (error) {
          console.error(
            "Error when requesting all the league promises:",
            error
          );
          return NextResponse.json(
            {
              error: {
                message: `Error when requesting all the league promises: ${error.message}`,
              },
              status: error.status,
            },
            { status: error.status }
          );
        } finally {
        }
      }
    })
    .catch((error) => {
      console.error("Request body parsing error:", error);
      return NextResponse.json(
        {
          error: { message: `Request body parsing error: ${error.message}` },
          status: error.status,
        },
        { status: error.status }
      );
    });
});

export async function POST(request, context) {
  return handler.run(request, context);
}
