"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "react-bootstrap/Spinner";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

import football from "@/assets/Fantasy-Football.png";
import hockey from "@/assets/Fantasy-Hockey.png";
import basketball from "@/assets/Fantasy-Basketball.png";
import baseball from "@/assets/Fantasy-Baseball.png";

import ManagerGrid from "./manager-grid3";
import SeasonDropdown from "./season-dropdown";
import SeasonListGroup from "./season-listgroup";
import TeamDropdown from "./team-dropdown";
import ManagerComparison from "./manager-comparison";
import TrendsDropdown from "./trends-dropdown";
import TrendSeasonDropdown from "./trend-season-dropdown";
import LoadingIndicator from "./loading-indicator";
import TrendListGroup from "./trend-listgroup";

import Trends from "./trends";
import RecordGrid from "./record-grid";
import { useSession } from "next-auth/react";

import { Koulen } from "@next/font/google";
const koulen = Koulen({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

import { Inter } from "@next/font/google";
const inter = Inter({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

export default function LeagueOverview({ leagueType, leagueKeysString }) {
  const { data: session, status } = useSession();
  const date = new Date();
  const currentYear = date.getFullYear();
  const logoStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
    margin: "1.5rem",
    objectFit: "contain",
  };
  const predefinedColors = [
    "yellow",
    "cyan",
    "magenta",
    "white",
    "chartreuse",
    "gold",
    "orange",
    "red",
    "lime",
    "deepskyblue",
    "fuchsia",
    "springgreen",
    "aquamarine",
  ];

  const [leagueLogo, setLeagueLogo] = useState();
  const [leagueName, setLeagueName] = useState();
  const [leagueInfo, setLeagueInfo] = useState([]);
  const [leagueSeasons, setLeagueSeasons] = useState([]);
  const [chosenSeason, setChosenSeason] = useState("---");
  const [chosenSeasonKey, setChosenSeasonKey] = useState([]);
  const [chosenSeasonTeams, setChosenSeasonTeams] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState([]);

  const [chosenTrend, setChosenTrend] = useState({
    name: "Regular Season Wins",
    value: "regularSeasonRecord",
    trend: "wins",
  });
  const [trendSeasonArray, setTrendSeasonArray] = useState([]);
  const [chosenSeason1, setChosenSeason1] = useState({ year: "Overall" });
  const [chosenSeason2, setChosenSeason2] = useState({ year: "---" });
  const [season2DropdownActive, setSeason2DropdownActive] = useState(false);

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

  const [records, setRecords] = useState();
  const [isRecordTeamDropdown, setIsRecordTeamDropdown] = useState(true);
  const [chosenRecordTeam, setChosenRecordTeam] = useState({
    managerName: "Overall",
  });

  const [chartData, setChartData] = useState({
    labels: ["Loading..."],
    datasets: [
      {
        label: "Loading",
        data: [0],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  // Function to generate a random color if predefined colors are exhausted
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  };

  const getColor = (index) => {
    return predefinedColors[index] || getRandomColor();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Change this breakpoint as needed
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    const getLeagueInfo = (leagueKeys, accessToken) => {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/yahooAuth/leagues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: accessToken,
          leagueKeys: leagueKeys,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `HTTP error when requesting league info! status: ${response.status}`
            );
          }
          return response.json();
        })
        .then((leagueData) => {
          const fetchResponse = leagueData;
          let n = 1;
          setLeagueInfo(fetchResponse);
          setLeagueName(fetchResponse[fetchResponse.length - 1].name);
          const reversedLeagueSeasons = fetchResponse.map((season) => {
            return {
              key: season.key,
              year: season.season,
              weeks: season.leagueWeeks,
              leagueLogo: season.mostRecentLogo
                ? season.mostRecentLogo
                : season.logo,
              leagueName: season.name,
            };
          });
          const reversedLeagueSeasonsNoOverall = reversedLeagueSeasons.slice(
            0,
            -1
          );
          setLeagueSeasons(reversedLeagueSeasons);
          setTrendSeasonArray(reversedLeagueSeasonsNoOverall);
          setChosenSeason({
            key: fetchResponse[fetchResponse.length - 1].key,
            year: fetchResponse[fetchResponse.length - 1].season,
            leagueLogo: fetchResponse[fetchResponse.length - 1].mostRecentLogo,
            leagueName: fetchResponse[fetchResponse.length - 1].name,
          });
          // fetchResponse[fetchResponse.length - 1].teams = fetchResponse[
          //   fetchResponse.length - 1
          // ].teams.map((manager) => {
          //   let overallCumulativeRecord = [];
          //   let previousCumulativeRecord = {
          //     season: "",
          //     regularSeasonRecord: {
          //       wins: 0,
          //       losses: 0,
          //       ties: 0,
          //       pointsFor: 0,
          //       pointsAgainst: 0,
          //       projectedPointsFor: 0,
          //       projectedPointsAgainst: 0,
          //     },
          //     playoffSeasonRecord: {
          //       wins: 0,
          //       losses: 0,
          //       ties: 0,
          //       pointsFor: 0,
          //       pointsAgainst: 0,
          //       projectedPointsFor: 0,
          //       projectedPointsAgainst: 0,
          //     },
          //     consolationSeasonRecord: {
          //       wins: 0,
          //       losses: 0,
          //       ties: 0,
          //       pointsFor: 0,
          //       pointsAgainst: 0,
          //       projectedPointsFor: 0,
          //       projectedPointsAgainst: 0,
          //     },
          //   };
          //   manager.cumulativeRecord.forEach((season) => {
          //     const newCumulativeRecord = {
          //       season: season.season,
          //       regularSeasonRecord: {
          //         wins:
          //           previousCumulativeRecord.regularSeasonRecord.wins +
          //           season.regularSeasonRecord.wins,
          //         losses:
          //           previousCumulativeRecord.regularSeasonRecord.losses +
          //           season.regularSeasonRecord.losses,
          //         ties:
          //           previousCumulativeRecord.regularSeasonRecord.ties +
          //           season.regularSeasonRecord.ties,
          //         pointsFor:
          //           previousCumulativeRecord.regularSeasonRecord.pointsFor +
          //           season.regularSeasonRecord.pointsFor,
          //         pointsAgainst:
          //           previousCumulativeRecord.regularSeasonRecord
          //             .pointsAgainst +
          //           season.regularSeasonRecord.pointsAgainst,
          //         projectedPointsFor:
          //           previousCumulativeRecord.regularSeasonRecord
          //             .projectedPointsFor +
          //           season.regularSeasonRecord.projectedPointsFor,
          //         projectedPointsAgainst:
          //           previousCumulativeRecord.regularSeasonRecord
          //             .projectedPointsAgainst +
          //           season.regularSeasonRecord.projectedPointsAgainst,
          //       },
          //       playoffSeasonRecord: {
          //         wins:
          //           previousCumulativeRecord.playoffSeasonRecord.wins +
          //           season.playoffSeasonRecord.wins,
          //         losses:
          //           previousCumulativeRecord.playoffSeasonRecord.losses +
          //           season.playoffSeasonRecord.losses,
          //         ties:
          //           previousCumulativeRecord.playoffSeasonRecord.ties +
          //           season.playoffSeasonRecord.ties,
          //         pointsFor:
          //           previousCumulativeRecord.playoffSeasonRecord.pointsFor +
          //           season.playoffSeasonRecord.pointsFor,
          //         pointsAgainst:
          //           previousCumulativeRecord.playoffSeasonRecord
          //             .pointsAgainst +
          //           season.playoffSeasonRecord.pointsAgainst,
          //         projectedPointsFor:
          //           previousCumulativeRecord.playoffSeasonRecord
          //             .projectedPointsFor +
          //           season.playoffSeasonRecord.projectedPointsFor,
          //         projectedPointsAgainst:
          //           previousCumulativeRecord.playoffSeasonRecord
          //             .projectedPointsAgainst +
          //           season.playoffSeasonRecord.projectedPointsAgainst,
          //       },
          //       consolationSeasonRecord: {
          //         wins:
          //           previousCumulativeRecord.consolationSeasonRecord.wins +
          //           season.consolationSeasonRecord.wins,
          //         losses:
          //           previousCumulativeRecord.consolationSeasonRecord.losses +
          //           season.consolationSeasonRecord.losses,
          //         ties:
          //           previousCumulativeRecord.consolationSeasonRecord.ties +
          //           season.consolationSeasonRecord.ties,
          //         pointsFor:
          //           previousCumulativeRecord.consolationSeasonRecord
          //             .pointsFor + season.consolationSeasonRecord.pointsFor,
          //         pointsAgainst:
          //           previousCumulativeRecord.consolationSeasonRecord
          //             .pointsAgainst +
          //           season.consolationSeasonRecord.pointsAgainst,
          //         projectedPointsFor:
          //           previousCumulativeRecord.consolationSeasonRecord
          //             .projectedPointsFor +
          //           season.consolationSeasonRecord.projectedPointsFor,
          //         projectedPointsAgainst:
          //           previousCumulativeRecord.consolationSeasonRecord
          //             .projectedPointsAgainst +
          //           season.consolationSeasonRecord.projectedPointsAgainst,
          //       },
          //     };
          //     overallCumulativeRecord.push(newCumulativeRecord);
          //     previousCumulativeRecord = newCumulativeRecord;
          //   });
          //   let overallCumulativeWeeks = [];
          //   let previousWeek = {
          //     isConsolation: [],
          //     isPlayoff: [],
          //     losses: [],
          //     pointsAgainst: [],
          //     pointsFor: [],
          //     projectedPointsAgainst: [],
          //     projectedPointsFor: [],
          //     season: "",
          //     ties: [],
          //     week: [],
          //     wins: [],
          //   };
          //   manager.cumulativeRecord.forEach((season) => {
          //     season.week.forEach((week) => {
          //       const currentWeek = {
          //         isConsolation: [
          //           ...previousWeek.isConsolation,
          //           week.isConsolation,
          //         ],
          //         isPlayoff: [...previousWeek.isPlayoff, week.isPlayoff],
          //         season: season.season,
          //         week: week.week,
          //         wins: [...previousWeek.wins, previousWeek.wins + week.wins],
          //         losses: [
          //           ...previousWeek.losses,
          //           previousWeek.losses + week.losses,
          //         ],
          //         ties: [...previousWeek.ties, previousWeek.ties + week.ties],
          //         pointsFor: [
          //           ...previousWeek.pointsFor,
          //           previousWeek.pointsFor + week.pointsFor,
          //         ],
          //         pointsAgainst: [
          //           ...previousWeek.pointsAgainst,
          //           previousWeek.pointsAgainst + week.pointsAgainst,
          //         ],
          //         projectedPointsFor: [
          //           ...previousWeek.projectedPointsFor,
          //           previousWeek.projectedPointsFor + week.projectedPointsFor,
          //         ],
          //         projectedPointsAgainst: [
          //           ...previousWeek.projectedPointsAgainst,
          //           previousWeek.projectedPointsAgainst +
          //             week.projectedPointsAgainst,
          //         ],
          //       };
          //       overallCumulativeWeeks.push(currentWeek);
          //       previousWeek = currentWeek;
          //     });
          //   });
          //   overallCumulativeRecord.week = overallCumulativeWeeks;
          //   return { ...manager, overallCumulativeRecord };
          // });
          setChosenSeasonTeams(fetchResponse[fetchResponse.length - 1].teams);
          setRecords(fetchResponse[fetchResponse.length - 1].overallRecords);
          setChartData({
            labels: reversedLeagueSeasonsNoOverall.map((season) => season.year),
            datasets: fetchResponse[fetchResponse.length - 1].teams.map(
              (team, index) => {
                let previous = {
                  regularSeasonRecord: {
                    wins: 0,
                  },
                };
                return {
                  label: team.managerName,
                  data: fetchResponse
                    .map((season) => {
                      return season.season;
                    })
                    .slice(0, -1)
                    .map((season) => {
                      // Find if the current season exists in array2

                      const matchingSeason = team.overallCumulativeRecord.find(
                        (seasonRecord) => seasonRecord.season === season
                      );
                      if (matchingSeason) {
                        previous = matchingSeason;
                      }
                      // If found, return the matching object, otherwise return the default object
                      return matchingSeason
                        ? matchingSeason.regularSeasonRecord.wins
                        : previous.regularSeasonRecord.wins;
                    }),
                  borderColor: getColor(index), // Line color
                  backgroundColor: getColor(index).replace("1)", "0.2)"), // Fill color (translucent)
                  pointBackgroundColor: getColor(index), // Color of the points
                  borderWidth: 1,
                  options: {
                    transitions: {
                      show: {
                        animations: {
                          x: {
                            from: 0,
                          },
                          y: {
                            from: 0,
                          },
                        },
                      },
                      hide: {
                        animations: {
                          x: {
                            to: 0,
                          },
                          y: {
                            to: 0,
                          },
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: "white", // Change legend text color
                        },
                      },
                    },
                  },
                };
              }
            ),
          });
          let logoUrl = fetchResponse[fetchResponse.length - 1].logo.filter(
            (logo) => logo
          );
          logoUrl = logoUrl[logoUrl.length - 1];
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
        })
        .finally(() => {
          setLoading(false);
        });
    };
    if (status === "unauthenticated" || session.expires < Date.now()) {
      setLoading(false);
      return <h1>Please Sign In</h1>;
    } else if (status === "authenticated") {
      setLoading(true);
      getLeagueInfo(leagueKeys, session.accessToken);
    } else if (status === "loading") {
      setLoading(true);
    }

    // Clean up listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [status]);

  const handleSeasonSelect = (e) => {
    let chosenSeason = JSON.parse(e);
    setChosenSeason(chosenSeason);
    setChosenTeam1({ managerName: "---" });
    setChosenTeam2({ managerName: "---" });
    setChosenRecordTeam({ managerName: "Overall" });
    setChosenTeamId1("---");
    setChosenTeamId2("---");
    setMatchups([]);
    setFilteredMatchups([]);
    setSummary([]);
    setFilteredSummary([]);
    setTeam2Active(false);
    setChosenSeasonKey(chosenSeason.key);
    leagueInfo.forEach((season) => {
      if (season.season === chosenSeason.year) {
        setChosenSeasonTeams(season.teams);
        if (chosenSeason.year === "Overall") {
          setRecords(season.overallRecords);
        } else {
          setRecords(season.seasonRecords);
        }
      }
    });
  };

  const handleTeamSelect1 = async (e) => {
    let manager = JSON.parse(e);
    let team2 = chosenTeam2;
    setTeam2Active(true);
    setChosenTeam1(manager);
    if (chosenTeam2.managerName === "---") {
      setChosenTeam2({ managerName: "Overall" });
    }
    if (manager.managerName === team2.managerName) {
      setChosenTeam2(manager);
      setChosenTeam1(team2);
      team2 = chosenTeam1;
      manager = chosenTeam2;
    }

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
    manager.weeklyRecord.forEach((season) => {
      season.matchups.forEach((matchup) => {
        if (matchup.wins === 1) {
          if (matchup.isPlayoff && !matchup.isConsolation) {
            allMatchupsSummary.playoffWins = allMatchupsSummary.playoffWins + 1;
          } else if (matchup.isPlayoff && matchup.isConsolation) {
            allMatchupsSummary.consolationWins =
              allMatchupsSummary.consolationWins + 1;
          } else {
            allMatchupsSummary.wins = allMatchupsSummary.wins + 1;
          }
        }

        if (matchup.losses === 1) {
          if (matchup.isPlayoff && !matchup.isConsolation) {
            allMatchupsSummary.playoffLosses =
              allMatchupsSummary.playoffLosses + 1;
          } else if (matchup.isPlayoff && matchup.isConsolation) {
            allMatchupsSummary.consolationLosses =
              allMatchupsSummary.consolationLosses + 1;
          } else {
            allMatchupsSummary.losses = allMatchupsSummary.losses + 1;
          }
        }
        if (matchup.ties === 1) {
          allMatchupsSummary.ties = allMatchupsSummary.ties + 1;
        }
        allMatchupsSummary.pointsFor =
          allMatchupsSummary.pointsFor + matchup.pointsFor;
        allMatchupsSummary.pointsAgainst =
          allMatchupsSummary.pointsAgainst + matchup.pointsAgainst;
        allMatchupsSummary.projectedPointsFor =
          allMatchupsSummary.projectedPointsFor + matchup.projectedPointsFor;
        allMatchupsSummary.projectedPointsAgainst =
          allMatchupsSummary.projectedPointsAgainst +
          matchup.projectedPointsAgainst;
      });
    });

    if (
      chosenTeam2.managerName != "Overall" &&
      chosenTeam2.managerName != "---"
    ) {
      let mutatedMatchups = manager.weeklyRecord.map((season) => {
        return {
          season: season.season ? season.season : chosenSeason.year,
          seasonKey: season.seasonKey ? season.seasonKey : chosenSeason.key,
          matchups: season.matchups.filter(
            (week) => week.opponentManagerId === team2.managerId
          ),
        };
      });
      let onlyActiveSeasons = mutatedMatchups.filter(
        (season) => season.matchups.length
      );
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
        id: manager.id,
        key: manager.key,
        managerName: manager.managerName,
        name: manager.name,
        logo: manager.logo,
        opponentId: team2.managerId,
        opponentKey: team2.key,
        opponentManagerName: team2.managerName,
        opponentName: team2.name,
        opponentLogo: team2.logo,
      };
      onlyActiveSeasons.forEach((season) => {
        season.matchups.forEach((matchup) => {
          if (matchup.wins === 1) {
            if (matchup.isPlayoff && !matchup.isConsolation) {
              mutatedMatchupsSummary.playoffWins =
                mutatedMatchupsSummary.playoffWins + 1;
            } else if (matchup.isPlayoff && matchup.isConsolation) {
              mutatedMatchupsSummary.consolationWins =
                mutatedMatchupsSummary.consolationWins + 1;
            } else {
              mutatedMatchupsSummary.wins = mutatedMatchupsSummary.wins + 1;
            }
          }

          if (matchup.losses === 1) {
            if (matchup.isPlayoff && !matchup.isConsolation) {
              mutatedMatchupsSummary.playoffLosses =
                mutatedMatchupsSummary.playoffLosses + 1;
            } else if (matchup.isPlayoff && matchup.isConsolation) {
              mutatedMatchupsSummary.consolationLosses =
                mutatedMatchupsSummary.consolationLosses + 1;
            } else {
              mutatedMatchupsSummary.losses = mutatedMatchupsSummary.losses + 1;
            }
          }
          if (matchup.ties === 1) {
            mutatedMatchupsSummary.ties = mutatedMatchupsSummary.ties + 1;
          }
          mutatedMatchupsSummary.pointsFor =
            mutatedMatchupsSummary.pointsFor + matchup.pointsFor;
          mutatedMatchupsSummary.pointsAgainst =
            mutatedMatchupsSummary.pointsAgainst + matchup.pointsAgainst;
          mutatedMatchupsSummary.projectedPointsFor =
            mutatedMatchupsSummary.projectedPointsFor +
            matchup.projectedPointsFor;
          mutatedMatchupsSummary.projectedPointsAgainst =
            mutatedMatchupsSummary.projectedPointsAgainst +
            matchup.projectedPointsAgainst;
        });
      });
      setMatchups(manager.weeklyRecord);
      setSummary(allMatchupsSummary);
      setFilteredMatchups(onlyActiveSeasons);
      setFilteredSummary(mutatedMatchupsSummary);
    } else {
      setMatchups(manager.weeklyRecord);
      setSummary(allMatchupsSummary);
      setFilteredMatchups(manager.weeklyRecord);
      setFilteredSummary(allMatchupsSummary);
    }
  };

  const handleTeamSelect2 = (e) => {
    const manager = JSON.parse(e);

    setChosenTeam2(manager);
    if (manager.managerName != "Overall") {
      let mutatedMatchups = chosenTeam1.weeklyRecord.map((season) => {
        return {
          season: season.season ? season.season : chosenSeason.year,
          seasonKey: season.seasonKey ? season.seasonKey : chosenSeason.key,
          matchups: season.matchups.filter(
            (week) => week.opponentManagerId === manager.managerId
          ),
        };
      });
      let onlyActiveSeasons = mutatedMatchups.filter(
        (season) => season.matchups.length
      );
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
        season.matchups.forEach((matchup) => {
          if (matchup.wins === 1) {
            if (matchup.isPlayoff && !matchup.isConsolation) {
              mutatedMatchupsSummary.playoffWins =
                mutatedMatchupsSummary.playoffWins + 1;
            } else if (matchup.isPlayoff && matchup.isConsolation) {
              mutatedMatchupsSummary.consolationWins =
                mutatedMatchupsSummary.consolationWins + 1;
            } else {
              mutatedMatchupsSummary.wins = mutatedMatchupsSummary.wins + 1;
            }
          }

          if (matchup.losses === 1) {
            if (matchup.isPlayoff && !matchup.isConsolation) {
              mutatedMatchupsSummary.playoffLosses =
                mutatedMatchupsSummary.playoffLosses + 1;
            } else if (matchup.isPlayoff && matchup.isConsolation) {
              mutatedMatchupsSummary.consolationLosses =
                mutatedMatchupsSummary.consolationLosses + 1;
            } else {
              mutatedMatchupsSummary.losses = mutatedMatchupsSummary.losses + 1;
            }
          }
          if (matchup.ties === 1) {
            mutatedMatchupsSummary.ties = mutatedMatchupsSummary.ties + 1;
          }
          mutatedMatchupsSummary.pointsFor =
            mutatedMatchupsSummary.pointsFor + matchup.pointsFor;
          mutatedMatchupsSummary.pointsAgainst =
            mutatedMatchupsSummary.pointsAgainst + matchup.pointsAgainst;
          mutatedMatchupsSummary.projectedPointsFor =
            mutatedMatchupsSummary.projectedPointsFor +
            matchup.projectedPointsFor;
          mutatedMatchupsSummary.projectedPointsAgainst =
            mutatedMatchupsSummary.projectedPointsAgainst +
            matchup.projectedPointsAgainst;
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

  const updateTrendChart = (trend, season1, season2) => {
    let seasonArray;
    let teamsArray;
    let recordType;
    let seasonType;
    let objectKey;
    if (season1.year != "Overall" && season2.year != "---") {
      seasonArray = leagueSeasons
        .slice(0, -1)
        .filter(
          (season) =>
            Number(season.year) >= Number(season1.year) &&
            Number(season.year) <= Number(season2.year)
        );
      teamsArray = leagueInfo[leagueInfo.length - 1].teams.filter((team) =>
        team.memberSeasons.some((memberSeason) =>
          seasonArray.some((season) => memberSeason.seasonYear === season.year)
        )
      );
      recordType = "overallCumulativeRecord";
    } else if (season1.year != "Overall" && season2.year === "---") {
      seasonArray = leagueSeasons
        .slice(0, -1)
        .filter((season) => Number(season.year) === Number(season1.year));

      teamsArray = leagueInfo[leagueInfo.length - 1].teams.filter((team) =>
        team.memberSeasons.some((memberSeason) =>
          seasonArray.some((season) => memberSeason.seasonYear === season.year)
        )
      );
      recordType = "cumulativeRecord";
    } else {
      seasonArray = leagueSeasons.slice(0, -1);
      teamsArray = leagueInfo[leagueInfo.length - 1].teams;
      recordType = "overallCumulativeRecord";
    }

    objectKey = trend.trend;
    seasonType = trend.value;

    setChartData({
      labels:
        recordType === "overallCumulativeRecord"
          ? seasonArray.map((season) => {
              return season.year;
            })
          : seasonArray[0].weeks.map((week) => {
              return week;
            }),
      datasets: teamsArray.map((team, index) => {
        let previous = {
          championships: 0,
          regularSeasonRecord: {
            wins: 0,
            losses: 0,
            ties: 0,
            winDifferential: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            pointDifferential: 0,
          },
          consolationSeasonRecord: {
            wins: 0,
            losses: 0,
            winDifferential: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            consolationAppearances: 0,
          },
          playoffSeasonRecord: {
            wins: 0,
            losses: 0,
            winDifferential: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            playoffAppearances: 0,
          },
        };
        return {
          label: team.managerName,
          data:
            recordType === "overallCumulativeRecord"
              ? seasonArray
                  .map((season) => {
                    return season.year;
                  })
                  .map((season) => {
                    if (
                      objectKey != "championships" &&
                      objectKey != "playoffAppearances" &&
                      objectKey != "consolationAppearances"
                    ) {
                      // Find if the current season exists in array2
                      const matchingSeason = team.overallCumulativeRecord.find(
                        (seasonRecord) => seasonRecord.season === season
                      );

                      if (matchingSeason) {
                        previous[seasonType][objectKey] =
                          matchingSeason[seasonType][objectKey];
                      }
                      // If found, return the matching object, otherwise return the default object
                      return matchingSeason
                        ? previous[seasonType][objectKey]
                        : previous[seasonType][objectKey];
                    } else if (objectKey === "championships") {
                      const matchingSeason = team.championships.find(
                        (seasonRecord) => seasonRecord.seasonYear === season
                      );
                      if (matchingSeason) {
                        previous.championships = previous.championships + 1;
                      }
                      // If found, return the matching object, otherwise return the default object
                      return matchingSeason
                        ? previous.championships
                        : previous.championships;
                    } else {
                      const matchingSeason = team[recordType].find(
                        (seasonRecord) => seasonRecord.season === season
                      );
                      //.find((appearance) => appearance === season);
                      if (matchingSeason) {
                        if (matchingSeason[seasonType][objectKey]) {
                          previous[seasonType][objectKey] =
                            matchingSeason[seasonType][objectKey].length;
                        }
                      }
                      // If found, return the matching object, otherwise return the default object
                      return matchingSeason
                        ? previous[seasonType][objectKey]
                        : previous[seasonType][objectKey];
                    }
                  })
              : team[recordType].filter(
                  (season) => season.season === seasonArray[0].year
                )[0][seasonType][objectKey]
              ? team[recordType]
                  .filter((season) => season.season === seasonArray[0].year)[0]
                  [seasonType][objectKey].map((week) => {
                    return week;
                  })
              : 0,
          borderColor: getColor(index), // Line color
          backgroundColor: getColor(index).replace("1)", "0.2)"), // Fill color (translucent)
          pointBackgroundColor: getColor(index), // Color of the points
          borderWidth: 1,
          options: {
            transitions: {
              show: {
                animations: {
                  x: {
                    from: 0,
                  },
                  y: {
                    from: 0,
                  },
                },
              },
              hide: {
                animations: {
                  x: {
                    to: 0,
                  },
                  y: {
                    to: 0,
                  },
                },
              },
            },
          },
        };
      }),
    });
  };

  const handleTrendSelect = (e) => {
    const trend = JSON.parse(e);
    setChosenTrend(trend);
    updateTrendChart(trend, chosenSeason1, chosenSeason2);
  };

  const handleTrendSeason1Select = (e) => {
    const chosenSeason = JSON.parse(e);
    setChosenSeason1(chosenSeason);
    if (chosenSeason.year === "Overall") {
      setSeason2DropdownActive(false);
      setChosenSeason2({ year: "---" });
      updateTrendChart(chosenTrend, chosenSeason, { year: "---" });
    } else if (
      chosenSeason2.year != "---" &&
      Number(chosenSeason.year) >= Number(chosenSeason2.year)
    ) {
      setChosenSeason2({ year: "---" });
      setSeason2DropdownActive(true);
      updateTrendChart(chosenTrend, chosenSeason, { year: "---" });
    } else {
      setSeason2DropdownActive(true);
      if (
        chosenTrend.name === "Championships" ||
        chosenTrend.name === "Playoff Appearances" ||
        chosenTrend.name === "Playoff Wins" ||
        chosenTrend.name === "Playoff Losses" ||
        chosenTrend.name === "Playoff Win Differential" ||
        chosenTrend.name === "Consolation Appearances" ||
        chosenTrend.name === "Consolation Wins" ||
        chosenTrend.name === "Consolation Losses" ||
        chosenTrend.name === "Consolation Win Differential"
      ) {
        setChosenTrend({
          name: "Regular Season Wins",
          value: "regularSeasonRecord",
          trend: "wins",
        });
        updateTrendChart(
          {
            name: "Regular Season Wins",
            value: "regularSeasonRecord",
            trend: "wins",
          },
          chosenSeason,
          chosenSeason2
        );
      } else {
        updateTrendChart(chosenTrend, chosenSeason, chosenSeason2);
      }
    }
  };
  const handleTrendSeason2Select = (e) => {
    const chosenSeason = JSON.parse(e);
    setChosenSeason2(chosenSeason);
    updateTrendChart(chosenTrend, chosenSeason1, chosenSeason);
  };

  const handleRecordsTeamSelect = async (e) => {
    let manager = JSON.parse(e);
    setChosenRecordTeam(manager);

    leagueInfo.forEach((season) => {
      if (season.season === chosenSeason.year) {
        if (
          chosenSeason.year === "Overall" &&
          manager.managerName === "Overall"
        ) {
          setRecords(season.overallRecords);
        } else if (manager.managerName === "Overall") {
          setRecords(season.seasonRecords);
        } else {
          season.teams.forEach((team) => {
            if (team.managerName === manager.managerName) {
              setRecords(team.gameRecords);
            }
          });
        }
      }
    });
  };

  const handleIsOpen = (e) => {
    console.log("WEEK OPENED");
    console.log(e);
    if (!isOpen.some((week) => week === JSON.stringify(e))) {
      setIsOpen([...isOpen, JSON.stringify(e)]);
    } else {
      setIsOpen(isOpen.filter((week) => week !== JSON.stringify(e)));
    }
  };

  return (
    <>
      <div className="normal-background">
        {loading ? (
          <div className="spacing-div">
            <div className="loading-div">
              <LoadingIndicator>
                <span className="visually-hidden">Loading...</span>
              </LoadingIndicator>
            </div>
          </div>
        ) : (
          <>
            <div className="league-title-div">
              <div className="specific-league-logo-div">
                {leagueLogo ? (
                  <Image
                    src={leagueLogo}
                    height={60}
                    style={logoStyle}
                    alt={`Picture for fantasy ${leagueType} league`}
                  />
                ) : null}
              </div>
              <div className="title-div">
                {leagueName ? (
                  <h2 className={koulen.className}>
                    {leagueName} League Legacy
                  </h2>
                ) : (
                  <h2 className={koulen.className}>
                    Fantasy{" "}
                    {leagueType.charAt(0).toUpperCase() + leagueType.slice(1)}{" "}
                    League Legacy
                  </h2>
                )}
              </div>
            </div>
            <div style={{ padding: "0rem 4rem" }}>
              <Tabs
                defaultActiveKey="Standings"
                id="justify-tab-example"
                className="mb-3 custom-tabs"
                justify
                variant="pills"
              >
                <Tab eventKey="Standings" title="Standings">
                  {isMobile ? (
                    <SeasonDropdown
                      onSeasonSelect={handleSeasonSelect}
                      leagueSeasons={leagueSeasons}
                      chosenSeason={chosenSeason}
                      seasonDropdownActive={seasonDropdownActive}
                    />
                  ) : (
                    <SeasonListGroup
                      onSeasonSelect={handleSeasonSelect}
                      leagueSeasons={leagueSeasons}
                      chosenSeason={chosenSeason}
                      seasonDropdownActive={seasonDropdownActive}
                    />
                  )}
                  <ManagerGrid
                    managers={chosenSeasonTeams}
                    chosenSeason={chosenSeason}
                    logoStyle={logoStyle}
                    currentYear={currentYear}
                  />
                </Tab>
                <Tab eventKey="Matchups" title="Matchups">
                  {isMobile ? (
                    <SeasonDropdown
                      onSeasonSelect={handleSeasonSelect}
                      leagueSeasons={leagueSeasons}
                      chosenSeason={chosenSeason}
                      seasonDropdownActive={seasonDropdownActive}
                    />
                  ) : (
                    <SeasonListGroup
                      onSeasonSelect={handleSeasonSelect}
                      leagueSeasons={leagueSeasons}
                      chosenSeason={chosenSeason}
                      seasonDropdownActive={seasonDropdownActive}
                    />
                  )}
                  <div className="teams-dropdown-div">
                    {/* <TeamDropdown
                      onTeamSelect={handleTeamSelect1}
                      managers={chosenSeasonTeams}
                      chosenSeason={chosenSeason}
                      chosenTeam1={chosenTeam1}
                      chosenTeam2={chosenTeam2}
                      isActive={team1Active}
                      isTeam2={false}
                      isRecordTeamDropdown={false}
                      logoStyle={logoStyle}
                    /> */}
                    {/* <SeasonDropdown
                      onSeasonSelect={handleSeasonSelect}
                      leagueSeasons={leagueSeasons}
                      chosenSeason={chosenSeason}
                      seasonDropdownActive={seasonDropdownActive}
                    /> */}
                    {/* <TeamDropdown
                      onTeamSelect={handleTeamSelect2}
                      managers={chosenSeasonTeams}
                      chosenSeason={chosenSeason}
                      chosenTeam1={chosenTeam1}
                      chosenTeam2={chosenTeam2}
                      isActive={team2Active}
                      isTeam2={true}
                      isRecordTeamDropdown={false}
                      logoStyle={logoStyle}
                    /> */}
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
                      leagueType={leagueType}
                      accessToken={session.accessToken}
                      onTeamSelect1={handleTeamSelect1}
                      onTeamSelect2={handleTeamSelect2}
                      managers={chosenSeasonTeams}
                      isTeam1Active={team1Active}
                      isTeam2Active={team2Active}
                      onIsOpen={handleIsOpen}
                      isOpen={isOpen}
                    />
                  </div>
                </Tab>
                <Tab eventKey="Trends" title="Trends">
                  <div className="trends-dropdown-div">
                    <Row style={{ width: "100%" }}>
                      <Col
                        className="d-flex align-items-center"
                        style={{ justifyContent: "space-evenly" }}
                      >
                        <h5
                          className={inter.className}
                          style={{ color: "#83A6CF", fontSize: "12px" }}
                        >
                          FROM
                        </h5>
                        <TrendSeasonDropdown
                          onSeasonSelect={handleTrendSeason1Select}
                          leagueSeasons={trendSeasonArray}
                          chosenSeason={chosenSeason1}
                          chosenSeason1={chosenSeason1}
                          isSeason2={false}
                          seasonDropdownActive={true}
                        />
                      </Col>
                      <Col
                        className="d-flex align-items-center"
                        style={{ justifyContent: "space-evenly" }}
                      >
                        <h5
                          className={inter.className}
                          style={{ color: "#83A6CF", fontSize: "12px" }}
                        >
                          TO
                        </h5>
                        <TrendSeasonDropdown
                          onSeasonSelect={handleTrendSeason2Select}
                          leagueSeasons={trendSeasonArray}
                          chosenSeason={chosenSeason2}
                          chosenSeason1={chosenSeason1}
                          isSeason2={true}
                          seasonDropdownActive={season2DropdownActive}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div
                    className="teams-dropdown-div"
                    style={{ justifyContent: "center" }}
                  >
                    {isMobile ? (
                      <TrendsDropdown
                        chosenSeason1={chosenSeason1}
                        chosenSeason2={chosenSeason2}
                        chosenTrend={chosenTrend}
                        onTrendSelect={handleTrendSelect}
                      />
                    ) : (
                      <TrendListGroup
                        chosenSeason1={chosenSeason1}
                        chosenSeason2={chosenSeason2}
                        chosenTrend={chosenTrend}
                        onTrendSelect={handleTrendSelect}
                      />
                    )}
                  </div>

                  <div className="team-comparison-div">
                    <Trends
                      chosenSeason1={chosenSeason1}
                      chosenSeason2={chosenSeason2}
                      chosenSeasonTeams={chosenSeasonTeams}
                      leagueInfo={leagueInfo}
                      chartData={chartData}
                      onTrendsSelect={handleTrendSelect}
                    />
                  </div>
                </Tab>
                <Tab eventKey="League Records" title="League Records">
                  <div
                  // className="teams-dropdown-div"
                  >
                    <Row style={{ width: "100%" }}>
                      <Col
                        className="d-flex align-items-center"
                        style={{ justifyContent: "space-evenly" }}
                      >
                        <h5
                          className={inter.className}
                          style={{ color: "#83A6CF", fontSize: "12px" }}
                        >
                          YEAR
                        </h5>
                        <SeasonDropdown
                          onSeasonSelect={handleSeasonSelect}
                          leagueSeasons={leagueSeasons}
                          chosenSeason={chosenSeason}
                          seasonDropdownActive={seasonDropdownActive}
                        />
                      </Col>
                      <Col
                        className="d-flex align-items-center"
                        style={{ justifyContent: "space-evenly" }}
                      >
                        <h5
                          className={inter.className}
                          style={{ color: "#83A6CF", fontSize: "12px" }}
                        >
                          TEAM
                        </h5>
                        <TeamDropdown
                          onTeamSelect={handleRecordsTeamSelect}
                          managers={chosenSeasonTeams}
                          chosenSeason={chosenSeason}
                          chosenTeam1={chosenRecordTeam}
                          chosenTeam2={chosenTeam2}
                          isActive={team1Active}
                          isTeam2={false}
                          isRecordTeamDropdown={isRecordTeamDropdown}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="team-comparison-div">
                    <RecordGrid
                      records={records}
                      logoStyle={logoStyle}
                      leagueType={leagueType}
                      chosenTeam={chosenRecordTeam}
                      accessToken={session.accessToken}
                      onIsOpen={handleIsOpen}
                    />
                  </div>
                </Tab>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </>
  );
}
