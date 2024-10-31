"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "react-bootstrap/Spinner";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import Image from "next/image";
import { useEffect, useState } from "react";

import football from "@/assets/Fantasy-Football.png";
import hockey from "@/assets/Fantasy-Hockey.png";
import basketball from "@/assets/Fantasy-Basketball.png";
import baseball from "@/assets/Fantasy-Baseball.png";
import { getCookie } from "@/actions/cookies";

import ManagerGrid from "./manager-grid3";
import SeasonDropdown from "./season-dropdown";
import TeamDropdown from "./team-dropdown";
import ManagerComparison from "./manager-comparison";
import Trends from "./trends";

export default function LeagueOverview({
  leagues,
  leagueType,
  leagueKeysString,
}) {
  const date = new Date();
  const currentYear = date.getFullYear();
  const logoStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
    margin: "1.5rem",
    objectFit: "contain",
  };

  const [leagueLogo, setLeagueLogo] = useState();
  const [leagueInfo, setLeagueInfo] = useState([]);
  const [leagueSeasons, setLeagueSeasons] = useState([]);
  const [chosenSeason, setChosenSeason] = useState("---");
  const [chosenSeasonKey, setChosenSeasonKey] = useState([]);
  const [chosenSeasonTeams, setChosenSeasonTeams] = useState([]);

  const [matchupsLoading, setMatchupsLoading] = useState(false);
  const [matchups, setMatchups] = useState([]);
  const [summary, setSummary] = useState({});
  const [seasonDropdownActive, setSeasonDropdownActive] = useState(true);

  const [filteredMatchups, setFilteredMatchups] = useState([]);
  const [filteredSummary, setFilteredSummary] = useState({});

  const [managers, setManagers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [chosenTeam1, setChosenTeam1] = useState({ managerName: "---" });
  const [chosenTeam2, setChosenTeam2] = useState({ managerName: "---" });
  const [chosenTeamId1, setChosenTeamId1] = useState("---");
  const [chosenTeamId2, setChosenTeamId2] = useState("---");
  const [chosenTeamKey1, setChosenTeamKey1] = useState([]);
  const [leagueKeys, setLeagueKeys] = useState(
    decodeURIComponent(leagueKeysString).split(",")
  );

  const [team1Active, setTeam1Active] = useState(true);
  const [team2Active, setTeam2Active] = useState(false);
  console.log("LEAGUE OVERVIEW LEAGUE KEYS:");
  console.log(leagueKeys);
  useEffect(() => {
    const getManagerInfo = async () => {
      try {
        const allSeasons = leagues.map((seasons) => {
          return seasons.leagues[0].league;
        });
        let allLeagues = [];
        allSeasons.forEach((season) => {
          season.forEach((league) => {
            allLeagues.push(league);
          });
        });

        let leagueName = allLeagues.find(
          (league) => league.league_key[0] === leagueId
        );
        leagueName = leagueName.name[0];
        const singleLeagueAllSeasons = allLeagues.filter(
          (league) => league.name[0] === leagueName
        );
        let logoUrl = "";
        let singleLeagueSeasonsArray = [];
        singleLeagueAllSeasons.forEach((season) => {
          if (season.logo_url[0]) {
            logoUrl = season.logo_url[0];
          }
          singleLeagueSeasonsArray = [
            ...singleLeagueSeasonsArray,
            season.season[0],
          ];
        });
        if (logoUrl) {
          setLeagueLogo(logoUrl);
        } else {
          if (leagueType === "football") {
            setLeagueLogo(football);
          } else if (leagueType === "hockey") {
            setLeagueLogo(hockey);
          } else if (leagueType === "basketball") {
            setLeagueLogo(basketball);
          } else if (leagueType === "baseball") {
            setLeagueLogo(baseball);
          } else {
            setLeagueLogo("");
          }
        }
        const singleLeagueAllSeasons2 = singleLeagueAllSeasons.map((season) => {
          return {
            key: season.league_key[0],
            id: season.league_id[0],
            logo: season.logo_url[0],
            name: season.name[0],
            season: season.season[0],
            startDate: season.start_date[0],
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
                  Number(team.team_standings[0].points_against[0]).toFixed(2)
                ),
                rank: {
                  seasonKey: season.league_key[0],
                  seasonYear: season.season[0],
                  rank: Number(team.team_standings[0].rank[0]),
                },
                wins: Number(team.team_standings[0].outcome_totals[0].wins[0]),
                losses: Number(
                  team.team_standings[0].outcome_totals[0].losses[0]
                ),
                ties: Number(team.team_standings[0].outcome_totals[0].ties[0]),
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
            overall.bestFinish = overall.rank.filter((season) =>
              Number(season.seasonYear != currentYear)
            );
            overall.bestFinish = overall.bestFinish.filter(
              (season) =>
                season.rank ===
                overall.bestFinish[overall.bestFinish.length - 1].rank
            );
            overall.worstFinish = overall.rank.filter((season) =>
              Number(season.seasonYear != currentYear)
            );
            overall.worstFinish = overall.worstFinish.filter(
              (season) => season.rank === overall.worstFinish[0].rank
            );
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
            Number(a.championships.length) !== Number(b.championships.length)
          ) {
            return (
              Number(b.championships.length) - Number(a.championships.length)
            );
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
          if (a.memberSeasons.length !== b.memberSeasons.length) {
            return a.memberSeasons.length - b.memberSeasons.length;
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

        const singleLeagueAllSeasons2WithOverall = [
          ...singleLeagueAllSeasons2,
          {
            id: singleLeagueAllSeasons2.map((season) => {
              return season.id;
            }),
            key: singleLeagueAllSeasons2.map((season) => {
              return season.key;
            }),
            name: singleLeagueAllSeasons2[singleLeagueAllSeasons.length - 1]
              .name,
            season: "Overall",
            logo: singleLeagueAllSeasons2.map((season) => {
              return season.logo;
            }),
            mostRecentLogo: singleLeagueAllSeasons2.filter(
              (season) => season.logo
            )[
              singleLeagueAllSeasons2.filter((season) => season.logo).length - 1
            ].logo,
            startDate: singleLeagueAllSeasons2[0].startDate,
            teams: overallManagerSummaries,
          },
        ];

        setLeagueInfo(singleLeagueAllSeasons2WithOverall);
        setLeagueSeasons(
          singleLeagueAllSeasons2WithOverall
            .map((season) => {
              return {
                key: season.key,
                year: season.season,
              };
            })
            .reverse()
        );
        setChosenSeason({
          key: singleLeagueAllSeasons2WithOverall[
            singleLeagueAllSeasons2WithOverall.length - 1
          ].key,
          year: singleLeagueAllSeasons2WithOverall[
            singleLeagueAllSeasons2WithOverall.length - 1
          ].season,
        });
        setChosenSeasonTeams(
          singleLeagueAllSeasons2WithOverall[
            singleLeagueAllSeasons2WithOverall.length - 1
          ].teams
        );
      } finally {
        setLoading(false);
      }
    };

    getManagerInfo();
  }, []);

  const handleSeasonSelect = (e) => {
    const chosenSeason = JSON.parse(e);
    setChosenSeason(chosenSeason);
    setChosenTeam1({ managerName: "---" });
    setChosenTeam2({ managerName: "---" });
    setChosenTeamId1("---");
    setChosenTeamId2("---");
    setTeam2Active(false);
    setChosenSeasonKey(chosenSeason.key);
    leagueInfo.forEach((season) => {
      if (season.season === chosenSeason.year) {
        setChosenSeasonTeams(season.teams);
      }
    });
  };

  const handleTeamSelect1 = async (e) => {
    const manager = JSON.parse(e);
    setTeam2Active(false);
    setSeasonDropdownActive(false);
    setChosenTeam1(manager);
    setChosenTeam2({ managerName: "Overall" });
    setMatchupsLoading(true);
    const tokens = await getCookie();
    setMatchups([]);
    fetch(`http://localhost:8000/api/yahooAuth/matchups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: tokens.accessToken,
        teamKey1: manager.key,
      }),
    })
      .then(async (response) => {
        const fetchResponse = await response.json();
        const allMatchups = fetchResponse.map((season) => {
          return season[0].matchup.map((week) => {
            let seasonKey;
            if (!Array.isArray(chosenSeason.key)) {
              chosenSeason.key = [chosenSeason.key];
            }
            chosenSeason.key.forEach((key) => {
              if (week.teams[0].team[0].team_key[0].includes(key)) {
                seasonKey = key;
              }
            });
            return {
              season: Number(week.week_start[0].slice(0, 4)),
              seasonKey: seasonKey,
              week: Number(week.week[0]),
              weekStart: week.week_start[0],
              weekEnd: week.week_end[0],
              weekStatus: week.status[0],
              winnerTeamKey:
                week.status[0] === "postevent"
                  ? week.winner_team_key[0]
                  : "TBD",
              playoffs: week.is_playoffs[0] === "1" ? true : false,
              consolation: week.is_consolation[0] === "1" ? true : false,
              tied:
                week.status[0] === "postevent"
                  ? week.is_tied[0] === "1"
                    ? true
                    : false
                  : false,
              team1ManagerId:
                week.teams[0].team[0].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? week.teams[0].team[0].managers[0].manager[0].guid[0]
                  : week.teams[0].team[1].managers[0].manager[0].guid[0],
              team1ManagerName:
                week.teams[0].team[0].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? week.teams[0].team[0].managers[0].manager[0].nickname[0]
                  : week.teams[0].team[1].managers[0].manager[0].nickname[0],
              team1TeamName:
                week.teams[0].team[0].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? week.teams[0].team[0].name[0]
                  : week.teams[0].team[1].name[0],
              team1TeamKey:
                week.teams[0].team[0].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? week.teams[0].team[0].team_key[0]
                  : week.teams[0].team[1].team_key[0],
              team1TeamLogo:
                week.teams[0].team[0].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? week.teams[0].team[0].team_logos[0].team_logo[0].url[0]
                  : week.teams[0].team[1].team_logos[0].team_logo[0].url[0],
              team1Points:
                week.teams[0].team[0].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? Number(week.teams[0].team[0].team_points[0].total[0])
                  : Number(week.teams[0].team[1].team_points[0].total[0]),
              team1ProjectedPoints:
                week.teams[0].team[0].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? Number(
                      week.teams[0].team[0].team_projected_points[0].total[0]
                    )
                  : Number(
                      week.teams[0].team[1].team_projected_points[0].total[0]
                    ),
              team2ManagerId:
                week.teams[0].team[1].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? week.teams[0].team[0].managers[0].manager[0].guid[0]
                  : week.teams[0].team[1].managers[0].manager[0].guid[0],
              team2ManagerName:
                week.teams[0].team[1].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? week.teams[0].team[0].managers[0].manager[0].nickname[0]
                  : week.teams[0].team[1].managers[0].manager[0].nickname[0],
              team2TeamName:
                week.teams[0].team[1].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? week.teams[0].team[0].name[0]
                  : week.teams[0].team[1].name[0],
              team2TeamKey:
                week.teams[0].team[1].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? week.teams[0].team[0].team_key[0]
                  : week.teams[0].team[1].team_key[0],
              team2TeamLogo:
                week.teams[0].team[1].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? week.teams[0].team[0].team_logos[0].team_logo[0].url[0]
                  : week.teams[0].team[1].team_logos[0].team_logo[0].url[0],
              team2Points:
                week.teams[0].team[1].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? Number(week.teams[0].team[0].team_points[0].total[0])
                  : Number(week.teams[0].team[1].team_points[0].total[0]),
              team2ProjectedPoints:
                week.teams[0].team[1].managers[0].manager[0].guid[0] ===
                manager.managerId
                  ? Number(
                      week.teams[0].team[0].team_projected_points[0].total[0]
                    )
                  : Number(
                      week.teams[0].team[1].team_projected_points[0].total[0]
                    ),
            };
          });
        });
        let allMatchupsSummary = {
          wins: 0,
          playoffWins: 0,
          consolationWins: 0,
          losses: 0,
          playoffLosses: 0,
          consolationLosses: 0,
          ties: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          projectedPointsFor: 0,
          projectedPointsAgainst: 0,
          id: manager.id,
          key: manager.key,
          managerName: manager.managerName,
          name: manager.name,
          logo: manager.logo,
          opponentId: "",
          opponentKey: "",
          opponentManagerName: "",
          opponentName: leagueInfo[0].name,
          opponentLogo: leagueLogo ? leagueLogo : "",
        };
        allMatchups.forEach((season) => {
          season.forEach((matchup) => {
            if (matchup.winnerTeamKey === matchup.team1TeamKey) {
              if (matchup.consolation) {
                allMatchupsSummary.consolationWins =
                  allMatchupsSummary.consolationWins + 1;
              } else if (matchup.playoffs) {
                allMatchupsSummary.playoffWins =
                  allMatchupsSummary.playoffWins + 1;
              } else {
                allMatchupsSummary.wins = allMatchupsSummary.wins + 1;
              }
            }
            if (matchup.winnerTeamKey === matchup.team2TeamKey) {
              if (matchup.consolation) {
                allMatchupsSummary.consolationLosses =
                  allMatchupsSummary.consolationLosses + 1;
              } else if (matchup.playoffs) {
                allMatchupsSummary.playoffLosses =
                  allMatchupsSummary.playoffLosses + 1;
              } else {
                allMatchupsSummary.losses = allMatchupsSummary.losses + 1;
              }
            }
            if (matchup.tied) {
              allMatchupsSummary.ties = allMatchupsSummary.ties + 1;
            }
            allMatchupsSummary.pointsFor =
              Number(allMatchupsSummary.pointsFor.toFixed(2)) +
              Number(matchup.team1Points.toFixed(2));
            allMatchupsSummary.pointsAgainst =
              Number(allMatchupsSummary.pointsAgainst.toFixed(2)) +
              Number(matchup.team2Points.toFixed(2));
            allMatchupsSummary.projectedPointsFor =
              Number(allMatchupsSummary.projectedPointsFor.toFixed(2)) +
              Number(matchup.team1ProjectedPoints.toFixed(2));
            allMatchupsSummary.projectedPointsAgainst =
              Number(allMatchupsSummary.projectedPointsAgainst.toFixed(2)) +
              Number(matchup.team2ProjectedPoints.toFixed(2));
          });
        });
        setMatchups(allMatchups);
        setFilteredMatchups(allMatchups);
        setSummary(allMatchupsSummary);
        setFilteredSummary(allMatchupsSummary);
      })
      .finally(() => {
        setMatchupsLoading(false);
        setTeam2Active(true);
        setSeasonDropdownActive(true);
      });
  };

  const handleTeamSelect2 = (e) => {
    const manager = JSON.parse(e);
    setChosenTeam2(manager);

    if (manager.managerName != "Overall") {
      let mutatedMatchups = matchups.map((season) => {
        return season.filter(
          (week) => week.team2ManagerId === manager.managerId
        );
      });
      let onlyActiveSeasons = mutatedMatchups.filter((season) => season.length);
      let mutatedMatchupsSummary = {
        wins: 0,
        playoffWins: 0,
        consolationWins: 0,
        losses: 0,
        playoffLosses: 0,
        consolationLosses: 0,
        ties: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        projectedPointsFor: 0,
        projectedPointsAgainst: 0,
        id: chosenTeam1.id,
        key: chosenTeam1.key,
        managerName: chosenTeam1.managerName,
        name: chosenTeam1.name,
        logo: chosenTeam1.logo,
        opponentId: manager.managerId,
        opponentKey: manager.key,
        opponentManagerName: manager.managerName,
        opponentName: manager.name,
        opponentLogo: manager.logo,
      };
      onlyActiveSeasons.forEach((season) => {
        season.forEach((matchup) => {
          if (matchup.winnerTeamKey === matchup.team1TeamKey) {
            if (matchup.consolation) {
              mutatedMatchupsSummary.consolationWins =
                mutatedMatchupsSummary.consolationWins + 1;
            } else if (matchup.playoffs) {
              mutatedMatchupsSummary.playoffWins =
                mutatedMatchupsSummary.playoffWins + 1;
            } else {
              mutatedMatchupsSummary.wins = mutatedMatchupsSummary.wins + 1;
            }
          }
          if (matchup.winnerTeamKey === matchup.team2TeamKey) {
            if (matchup.consolation) {
              mutatedMatchupsSummary.consolationLosses =
                mutatedMatchupsSummary.consolationLosses + 1;
            } else if (matchup.playoffs) {
              mutatedMatchupsSummary.playoffLosses =
                mutatedMatchupsSummary.playoffLosses + 1;
            } else {
              mutatedMatchupsSummary.losses = mutatedMatchupsSummary.losses + 1;
            }
          }
          if (matchup.tied) {
            mutatedMatchupsSummary.ties = mutatedMatchupsSummary.ties + 1;
          }
          mutatedMatchupsSummary.pointsFor =
            Number(mutatedMatchupsSummary.pointsFor.toFixed(2)) +
            Number(matchup.team1Points.toFixed(2));
          mutatedMatchupsSummary.pointsAgainst =
            Number(mutatedMatchupsSummary.pointsAgainst.toFixed(2)) +
            Number(matchup.team2Points.toFixed(2));
          mutatedMatchupsSummary.projectedPointsFor =
            Number(mutatedMatchupsSummary.projectedPointsFor.toFixed(2)) +
            Number(matchup.team1ProjectedPoints.toFixed(2));
          mutatedMatchupsSummary.projectedPointsAgainst =
            Number(mutatedMatchupsSummary.projectedPointsAgainst.toFixed(2)) +
            Number(matchup.team2ProjectedPoints.toFixed(2));
        });
      });
      setFilteredMatchups(onlyActiveSeasons);
      setFilteredSummary(mutatedMatchupsSummary);
    } else {
      setFilteredMatchups(matchups);
      setFilteredSummary(summary);
    }
  };

  const handleCompareManager = (e) => {
    let compareManager;
    chosenSeasonTeams.forEach((team) => {
      if (team.managerId === e.target.id) {
        compareManager = JSON.stringify(team);
      }
    });
    handleTeamSelect2(compareManager);
  };

  return (
    <>
      <div className="league-logo-div">
        <div className="specific-league-logo-div">
          {leagueLogo ? (
            <Image
              src={leagueLogo}
              width={120}
              height={120}
              style={logoStyle}
              alt={`Picture for fantasy ${leagueType} league`}
            />
          ) : (
            <h1>Loading League Logo...</h1>
          )}
        </div>
      </div>
      <div>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <>
            <Tabs
              defaultActiveKey="Standings"
              id="justify-tab-example"
              className="mb-3"
              justify
            >
              <Tab eventKey="Standings" title="Standings">
                <SeasonDropdown
                  onSeasonSelect={handleSeasonSelect}
                  leagueSeasons={leagueSeasons}
                  chosenSeason={chosenSeason}
                  seasonDropdownActive={seasonDropdownActive}
                />
                <ManagerGrid
                  managers={chosenSeasonTeams}
                  chosenSeason={chosenSeason}
                  logoStyle={logoStyle}
                  currentYear={currentYear}
                />
              </Tab>
              <Tab eventKey="Matchups" title="Matchups">
                <div className="teams-dropdown-div">
                  <TeamDropdown
                    onTeamSelect={handleTeamSelect1}
                    managers={chosenSeasonTeams}
                    chosenSeason={chosenSeason}
                    chosenTeam1={chosenTeam1}
                    chosenTeam2={chosenTeam2}
                    isActive={team1Active}
                    isTeam2={false}
                  />
                  <SeasonDropdown
                    onSeasonSelect={handleSeasonSelect}
                    leagueSeasons={leagueSeasons}
                    chosenSeason={chosenSeason}
                    seasonDropdownActive={seasonDropdownActive}
                  />
                  <TeamDropdown
                    onTeamSelect={handleTeamSelect2}
                    managers={chosenSeasonTeams}
                    chosenSeason={chosenSeason}
                    chosenTeam1={chosenTeam1}
                    chosenTeam2={chosenTeam2}
                    isActive={team2Active}
                    isTeam2={true}
                  />
                </div>
                <div className="team-comparison-div">
                  <ManagerComparison
                    chosenSeason={chosenSeason}
                    chosenTeam1={chosenTeam1}
                    chosenTeam2={chosenTeam2}
                    logoStyle={logoStyle}
                    onCompareManager={handleCompareManager}
                    filteredMatchups={filteredMatchups}
                    filteredSummary={filteredSummary}
                    matchupsLoading={matchupsLoading}
                  />
                </div>
              </Tab>
              <Tab eventKey="Trends" title="Trends">
                <div className="teams-dropdown-div">
                  <SeasonDropdown
                    onSeasonSelect={handleSeasonSelect}
                    leagueSeasons={leagueSeasons}
                    chosenSeason={chosenSeason}
                    seasonDropdownActive={seasonDropdownActive}
                  />
                </div>
                <div className="team-comparison-div">
                  <Trends
                    chosenSeason={chosenSeason}
                    chosenSeasonTeams={chosenSeasonTeams}
                  />
                </div>
              </Tab>
              <Tab eventKey="Placeholder 2" title="Placeholder 2">
                Tab content for Contact
              </Tab>
            </Tabs>
          </>
        )}
      </div>
    </>
  );
}
