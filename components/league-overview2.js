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

import ManagerGrid from "./manager-grid";
import SeasonDropdown from "./season-dropdown";
import TeamDropdown from "./team-dropdown";
import ManagerComparison from "./manager-comparison";

export default function LeagueOverview({ leagues, leagueType, leagueId }) {
  const date = new Date();
  const currentYear = date.getFullYear();
  const logoStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
    margin: "1.5rem",
    objectFit: "contain",
  };
  const [imageSource, setImageSource] = useState();
  const [managers, setManagers] = useState([]);
  const [leagueSeasons, setLeagueSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chosenSeason, setChosenSeason] = useState("Overall");
  const [chosenTeam1, setChosenTeam1] = useState("---");
  const [chosenTeam2, setChosenTeam2] = useState("Overall");
  const [chosenTeamId1, setChosenTeamId1] = useState("---");
  const [chosenTeamId2, setChosenTeamId2] = useState("---");
  const [chosenTeamKey1, setChosenTeamKey1] = useState([]);
  const [leagueKeys, setLeagueKeys] = useState([]);
  const [chosenLeagueKey, setChosenLeagueKey] = useState([]);
  const [team1Active, setTeam1Active] = useState(true);
  const [team2Active, setTeam2Active] = useState(false);

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
                rank: Number(team.team_standings[0].rank[0]),
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
                    seasonKey: season.key,
                    seasonYear: season.season,
                    rank: team.rank,
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
              (season) =>
                season.rank === overall.rank[overall.rank.length - 1].rank
            );
            overall.worstFinish = overall.rank.filter(
              (season) => season.rank === overall.rank[0].rank
            );
            overall.championships = overall.rank.filter(
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
        console.log("SINGLE LEAGUE ALL SEASONS WITH OVERALL");
        console.log(singleLeagueAllSeasons2WithOverall);

        // console.log(overallManagerSummaries);

        let singleLeagueLeagueKeys = [];
        singleLeagueAllSeasons.forEach((league) => {
          if (league.season[0] === chosenSeason || chosenSeason === "Overall");
          singleLeagueLeagueKeys = [
            ...singleLeagueLeagueKeys,
            league.league_key[0],
          ];
        });
        setLeagueKeys(singleLeagueLeagueKeys);
        setChosenLeagueKey(singleLeagueLeagueKeys);
        if (logoUrl) {
          setImageSource(logoUrl);
        } else {
          if (leagueType === "football") {
            setImageSource(football);
          } else if (leagueType === "hockey") {
            setImageSource(hockey);
          } else if (leagueType === "basketball") {
            setImageSource(basketball);
          } else if (leagueType === "baseball") {
            setImageSource(baseball);
          } else {
            setImageSource("");
          }
        }
        const RankingsPerSeason = singleLeagueAllSeasons.map((season) => {
          return season.standings[0].teams[0].team;
        });

        const managersPerSeason = RankingsPerSeason.map((season) => {
          return season.map((team) => {
            return team.managers[0].manager[0].guid[0];
          });
        });

        // Flatten the array of arrays into a single array
        const flattenedManagersArray = managersPerSeason.flat();

        // Create a Set to remove duplicates and convert it back to an array
        const uniqueManagers = [...new Set(flattenedManagersArray)];

        let managerSummaries = [];
        uniqueManagers.forEach((manager) => {
          let seasons = [];
          RankingsPerSeason.forEach((season) => {
            let managerData = {
              id: manager,
              season: "",
              teamKey: "",
              name: "",
              teamName: "",
              teamLogo: "",
              wins: 0,
              losses: 0,
              ties: 0,
              winPercentage: 0,
              finish: 0,
              pointsFor: 0,
              pointsAgainst: 0,
            };
            season.forEach((team) => {
              if (team.managers[0].manager[0].guid[0] === manager) {
                managerData.teamKey = team.team_key[0];
                managerData.wins = Number(
                  team.team_standings[0].outcome_totals[0].wins[0]
                );
                managerData.losses = Number(
                  team.team_standings[0].outcome_totals[0].losses[0]
                );
                managerData.ties = Number(
                  team.team_standings[0].outcome_totals[0].ties[0]
                );
                managerData.winPercentage = (
                  Number(
                    team.team_standings[0].outcome_totals[0].percentage[0]
                  ) * 100
                ).toFixed(2);
                managerData.pointsFor = Number(
                  team.team_standings[0].points_for[0]
                );
                managerData.pointsAgainst = Number(
                  team.team_standings[0].points_against[0]
                );
                if (team.managers[0].manager[0].nickname[0] != "--hidden--") {
                  managerData.name = team.managers[0].manager[0].nickname[0];
                } else {
                  managerData.name = "Unknown";
                }
                if (team.team_logos[0].team_logo[0].url[0] != "--hidden--") {
                  managerData.teamLogo = team.team_logos[0].team_logo[0].url[0];
                } else {
                  managerData.teamLogo = "";
                }
                managerData.season = Number(team.team_points[0].season[0]);
                managerData.teamName = team.name[0];
                managerData.finish = Number(team.team_standings[0].rank[0]);
              }
            });
            if (managerData.season) {
              seasons.push(managerData);
            }
          });
          managerSummaries.push(seasons);
        });
        managerSummaries.forEach((manager) => {
          let overall = {
            id: manager[0].id,
            season: "Overall",
            teamKey: "",
            name: "",
            teamName: "",
            teamLogo: "",
            wins: 0,
            losses: 0,
            ties: 0,
            winPercentage: 0,
            bestFinish: 0,
            worstFinish: 0,
            championships: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            memberUntil: "",
            memberSince: "",
          };
          manager.forEach((season) => {
            overall.wins = overall.wins + season.wins;
            overall.losses = overall.losses + season.losses;
            overall.ties = overall.ties + season.ties;
            overall.pointsFor =
              overall.pointsFor + Number(season.pointsFor.toFixed(2));
            overall.pointsAgainst =
              overall.pointsAgainst + Number(season.pointsAgainst.toFixed(2));

            if (season.finish > 0 && overall.bestFinish) {
              if (season.finish < overall.bestFinish) {
                overall.bestFinish = season.finish;
              }
              if (season.finish > overall.worstFinish) {
                overall.worstFinish = season.finish;
              }
            } else if (season.finish > 0) {
              overall.bestFinish = season.finish;
              overall.worstFinish = season.finish;
            }
            if (season.finish === 1) {
              overall.championships = overall.championships + 1;
            }
          });

          if (overall.wins + overall.losses + overall.ties > 0) {
            overall.winPercentage = (
              (overall.wins / (overall.wins + overall.losses + overall.ties)) *
              100
            ).toFixed(2);
          }
          overall.memberUntil = manager[manager.length - 1].season;
          overall.memberSince = manager[0].season;
          if (overall.memberSince === currentYear) {
            overall.bestFinish = "TBD";
            overall.worstFinish = "TBD";
          }
          overall.teamName = manager[manager.length - 1].teamName;
          overall.name = manager[manager.length - 1].name;
          overall.teamLogo = manager[manager.length - 1].teamLogo;
          overall.teamKey = manager[manager.length - 1].teamKey;
          manager.push(overall);
        });

        setManagers(managerSummaries);

        let managerOverallSummaries = [];

        managerSummaries.forEach((manager) => {
          return manager.forEach((season) => {
            if (season.season === "Overall") {
              managerOverallSummaries.push(season);
            }
          });
        });
        managerOverallSummaries.sort((a, b) => b.wins - a.wins);
        managerOverallSummaries.sort((a, b) => a.losses - b.losses);
        managerOverallSummaries.sort(
          (a, b) => b.championships - a.championships
        );

        // managerSummaries.sort((a, b) => b.wins - a.wins);
        // managerSummaries.sort((a, b) => b.championships - a.championships);
        setLeagueSeasons(singleLeagueSeasonsArray, "Overall");
      } finally {
        setLoading(false);
      }
    };

    getManagerInfo();
  }, []);

  const handleSeasonSelect = (e) => {
    setChosenSeason(e);
    setChosenTeam1("---");
    setChosenTeam2("Overall");
    setChosenTeamId1("---");
    setChosenTeamId2("---");
    setTeam2Active(false);

    const seasonKeys = leagues.map((season) => {
      return {
        season: season.season[0],
        game_key: season.game_key[0],
      };
    });
    let chosenSeasonKey;
    if (e != "Overall") {
      seasonKeys.forEach((seasonKey) => {
        if (seasonKey.season === e) {
          chosenSeasonKey = leagueKeys.filter((leagueKey) =>
            leagueKey.includes(seasonKey.game_key)
          );
        }
      });
      setChosenLeagueKey(chosenSeasonKey);
    } else {
      setChosenLeagueKey(leagueKeys.slice(0, -1));
    }
  };
  //const indexofChosenSeason = leagueSeasons.indexOf(e);

  //   if (e === "Overall") {
  //     setChosenLeagueKey(leagueKeys.slice(0, -1));
  //   } else {
  //     setChosenLeagueKey(seasonKey);
  //   }
  // };

  const handleTeamSelect1 = (e) => {
    //setChosenTeam1(e);
    setChosenTeam2("Overall");

    let orderedSeason = [];
    let managerId = [];
    let unorderedSeason = managers.map((manager) => {
      return manager.map((season) => {
        if (season.season.toString() === chosenSeason) {
          return season;
        }
      });
    });
    unorderedSeason.map((manager) => {
      manager.map((season) => {
        if (season) {
          orderedSeason = [...orderedSeason, season];
        }
      });
    });
    orderedSeason.sort((a, b) => a.finish - b.finish);

    if (chosenSeason === "Overall") {
      orderedSeason.sort((a, b) => b.wins - a.wins);
      orderedSeason.sort((a, b) => a.losses - b.losses);
      orderedSeason.sort((a, b) => b.championships - a.championships);
      //orderedSeason.sort((a, b) => b.memberUntil - a.memberUntil);  Only if you want to sort it by current membership
    }

    orderedSeason.forEach((manager) => {
      if (manager.id === e) {
        setChosenTeam1(manager.name);
        setChosenTeamId1(manager.id);

        managerId = manager.id;
      }
    });
    let teamKeys = [];
    managers.forEach((manager) => {
      return manager.forEach((season) => {
        if (season.id === managerId) {
          teamKeys = [...teamKeys, season.teamKey];
        }
      });
    });
    // if (teamKeys.length > 1) {
    //   teamKeys = teamKeys.slice(0, -1);
    // }
    const seasonKeys = leagues.map((season) => {
      return {
        season: season.season[0],
        game_key: season.game_key[0],
      };
    });
    let chosenSeasonKey;
    if (chosenSeason != "Overall") {
      seasonKeys.forEach((seasonKey) => {
        if (seasonKey.season === chosenSeason) {
          chosenSeasonKey = leagueKeys.filter((leagueKey) =>
            leagueKey.includes(seasonKey.game_key)
          );
        }
      });
      setChosenTeamKey1(
        teamKeys.filter((teamKey) => teamKey.includes(chosenSeasonKey))
      );
    } else {
      setChosenTeamKey1(teamKeys.slice(0, -1));
    }
    //setChosenTeamKey1(teamKeys);
    setTeam2Active(true);
  };
  const handleTeamSelect2 = (e) => {
    let orderedSeason = [];
    let unorderedSeason = managers.map((manager) => {
      return manager.map((season) => {
        if (season.season.toString() === chosenSeason) {
          return season;
        }
      });
    });
    unorderedSeason.map((manager) => {
      manager.map((season) => {
        if (season) {
          orderedSeason = [...orderedSeason, season];
        }
      });
    });
    orderedSeason.sort((a, b) => a.finish - b.finish);

    if (chosenSeason === "Overall") {
      orderedSeason.sort((a, b) => b.wins - a.wins);
      orderedSeason.sort((a, b) => a.losses - b.losses);
      orderedSeason.sort((a, b) => b.championships - a.championships);
      //orderedSeason.sort((a, b) => b.memberUntil - a.memberUntil);  Only if you want to sort it by current membership
    }

    orderedSeason.forEach((manager) => {
      if (manager.id === e) {
        setChosenTeam2(manager.name);
        setChosenTeamId2(manager.id);
      }
    });
    if (e === "Overall") {
      setChosenTeam2("Overall");
      setChosenTeamId2("---");
    }
  };

  const handleCompareManager = (e) => {
    handleTeamSelect2(e.target.id);
  };

  return (
    <>
      <div className="league-logo-div">
        <div className="specific-league-logo-div">
          {imageSource ? (
            <Image
              src={imageSource}
              width={120}
              height={120}
              style={logoStyle}
              alt={`Picture for fantasy ${leagueType} league`}
            />
          ) : (
            <h1>Not a valid fantasy leauge</h1>
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
            <SeasonDropdown
              onSeasonSelect={handleSeasonSelect}
              leagueSeasons={leagueSeasons}
              chosenSeason={chosenSeason}
            />
            <Tabs
              defaultActiveKey="Standings"
              id="justify-tab-example"
              className="mb-3"
              justify
            >
              <Tab eventKey="Standings" title="Standings">
                <ManagerGrid
                  managers={managers}
                  chosenSeason={chosenSeason}
                  logoStyle={logoStyle}
                  currentYear={currentYear}
                />
              </Tab>
              <Tab eventKey="Matchups" title="Matchups">
                <div className="teams-dropdown-div">
                  <TeamDropdown
                    onTeamSelect={handleTeamSelect1}
                    managers={managers}
                    chosenSeason={chosenSeason}
                    chosenTeamId1={chosenTeamId1}
                    chosenTeam={chosenTeam1}
                    isActive={team1Active}
                    isTeam2={false}
                  />
                  <TeamDropdown
                    onTeamSelect={handleTeamSelect2}
                    managers={managers}
                    chosenSeason={chosenSeason}
                    chosenTeamId1={chosenTeamId1}
                    chosenTeam={chosenTeam2}
                    isActive={team2Active}
                    isTeam2={true}
                  />
                </div>
                <div className="team-comparison-div">
                  <ManagerComparison
                    managers={managers}
                    chosenSeason={chosenSeason}
                    chosenTeam2={chosenTeam2}
                    chosenTeamId1={chosenTeamId1}
                    chosenTeamId2={chosenTeamId2}
                    chosenTeamKey1={chosenTeamKey1}
                    leagueKeys={chosenLeagueKey}
                    logoStyle={logoStyle}
                    onCompareManager={handleCompareManager}
                  />
                </div>
              </Tab>
              <Tab eventKey="Placeholder 1" title="Placeholder 1">
                Tab content for Loooonger Tab
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
