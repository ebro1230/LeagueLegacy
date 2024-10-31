"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import football from "@/assets/Fantasy-Football.png";
import hockey from "@/assets/Fantasy-Hockey.png";
import basketball from "@/assets/Fantasy-Basketball.png";
import baseball from "@/assets/Fantasy-Baseball.png";

import Link from "next/link";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Spinner from "react-bootstrap/Spinner";

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

        //console.log(singleLeagueAllSeasons);
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
        //console.log(RankingsPerSeason);
        uniqueManagers.forEach((manager) => {
          let managerData = {
            id: manager,
            teamKeys: [],
            name: [],
            currentName: "",
            teamName: [],
            currentTeamName: "",
            teamLogo: [],
            currentTeamLogo: "",
            memberSeasons: [],
            memberSince: "",
            memberUntil: "",
            wins: [],
            losses: [],
            ties: [],
            overallWins: 0,
            overallLosses: 0,
            overallTies: 0,
            winPercentage: [],
            overallWinPercentage: 0,
            finishes: [],
            championships: 0,
            bestFinish: "TBD",
            worstFinish: "TBD",
            pointsFor: [],
            pointsAgainst: [],
          };

          RankingsPerSeason.forEach((season) => {
            if (chosenSeason === "Overall") {
              season.forEach((team) => {
                console.log("TEAM:");
                console.log(team);
                if (team.managers[0].manager[0].guid[0] === manager) {
                  managerData.teamKeys = [
                    ...managerData.teamKeys,
                    team.team_key[0],
                  ];
                  managerData.wins = [
                    ...managerData.wins,
                    Number(team.team_standings[0].outcome_totals[0].wins[0]),
                  ];
                  managerData.losses = [
                    ...managerData.losses,
                    Number(team.team_standings[0].outcome_totals[0].losses[0]),
                  ];
                  managerData.ties = [
                    ...managerData.ties,
                    Number(team.team_standings[0].outcome_totals[0].ties[0]),
                  ];
                  managerData.winPercentage = [
                    ...managerData.winPercentage,
                    Number(
                      team.team_standings[0].outcome_totals[0].percentage[0]
                    ),
                  ];
                  managerData.pointsFor = [
                    ...managerData.pointsFor,
                    Number(team.team_standings[0].points_for[0]),
                  ];
                  managerData.pointsAgainst = [
                    ...managerData.pointsAgainst,
                    Number(team.team_standings[0].points_against[0]),
                  ];
                  if (team.managers[0].manager[0].nickname[0] != "--hidden--") {
                    managerData.name = [
                      ...managerData.name,
                      team.managers[0].manager[0].nickname[0],
                    ];
                  } else {
                    managerData.name = [...managerData.name, "Unknown"];
                  }
                  if (team.team_logos[0].team_logo[0].url[0] != "--hidden--") {
                    managerData.teamLogo = [
                      ...managerData.teamLogo,
                      team.team_logos[0].team_logo[0].url[0],
                    ];
                  } else {
                    managerData.teamLogo = [...managerData.teamLogo, ""];
                  }
                  managerData.memberSeasons = [
                    ...managerData.memberSeasons,
                    Number(team.team_points[0].season[0]),
                  ];
                  managerData.teamName = [
                    ...managerData.teamName,
                    team.name[0],
                  ];
                  managerData.finishes = [
                    ...managerData.finishes,
                    Number(team.team_standings[0].rank[0]),
                  ];
                }
              });
              managerData.overallWins = managerData.wins.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              );
              managerData.overallLosses = managerData.losses.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              );
              managerData.overallTies = managerData.ties.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              );
              if (
                managerData.overallWins +
                  managerData.overallLosses +
                  managerData.overallTies >
                0
              ) {
                managerData.overallWinPercentage = (
                  (managerData.overallWins /
                    (managerData.overallWins +
                      managerData.overallLosses +
                      managerData.overallTies)) *
                  100
                ).toFixed(2);
              }
              managerData.memberUntil =
                managerData.memberSeasons[managerData.memberSeasons.length - 1];
              managerData.memberSince = managerData.memberSeasons[0];
              managerData.currentTeamName =
                managerData.teamName[managerData.teamName.length - 1];
              managerData.currentName =
                managerData.name[managerData.name.length - 1];
              managerData.currentTeamLogo =
                managerData.teamLogo[managerData.teamLogo.length - 1];
              if (managerData.memberUntil === currentYear) {
                managerData.finishes.splice(managerData.finishes.length - 1, 1);
              }
              if (managerData.finishes.length) {
                managerData.worstFinish = managerData.finishes.reduce(
                  (max, current) => (current > max ? current : max),
                  -Infinity
                );
                managerData.bestFinish = managerData.finishes.reduce(
                  (min, current) => (current < min ? current : min),
                  Infinity
                );
                managerData.championships = managerData.finishes.filter(
                  (finish) => finish === 1
                ).length;
              }
            } else if (chosenSeason === season) {
              season.forEach((team) => {
                console.log("TEAM:");
                console.log(team);
                if (team.managers[0].manager[0].guid[0] === manager) {
                  managerData.teamKeys = [
                    ...managerData.teamKeys,
                    team.team_key[0],
                  ];
                  managerData.wins = [
                    ...managerData.wins,
                    Number(team.team_standings[0].outcome_totals[0].wins[0]),
                  ];
                  managerData.losses = [
                    ...managerData.losses,
                    Number(team.team_standings[0].outcome_totals[0].losses[0]),
                  ];
                  managerData.ties = [
                    ...managerData.ties,
                    Number(team.team_standings[0].outcome_totals[0].ties[0]),
                  ];
                  managerData.winPercentage = [
                    ...managerData.winPercentage,
                    Number(
                      team.team_standings[0].outcome_totals[0].percentage[0]
                    ),
                  ];
                  managerData.pointsFor = [
                    ...managerData.pointsFor,
                    Number(team.team_standings[0].points_for[0]),
                  ];
                  managerData.pointsAgainst = [
                    ...managerData.pointsAgainst,
                    Number(team.team_standings[0].points_against[0]),
                  ];
                  if (team.managers[0].manager[0].nickname[0] != "--hidden--") {
                    managerData.name = [
                      ...managerData.name,
                      team.managers[0].manager[0].nickname[0],
                    ];
                  } else {
                    managerData.name = [...managerData.name, "Unknown"];
                  }
                  if (team.team_logos[0].team_logo[0].url[0] != "--hidden--") {
                    managerData.teamLogo = [
                      ...managerData.teamLogo,
                      team.team_logos[0].team_logo[0].url[0],
                    ];
                  } else {
                    managerData.teamLogo = [...managerData.teamLogo, ""];
                  }
                  managerData.memberSeasons = [
                    ...managerData.memberSeasons,
                    Number(team.team_points[0].season[0]),
                  ];
                  managerData.teamName = [
                    ...managerData.teamName,
                    team.name[0],
                  ];
                  managerData.finishes = [
                    ...managerData.finishes,
                    Number(team.team_standings[0].rank[0]),
                  ];
                }
              });
              managerData.overallWins = managerData.wins.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              );
              managerData.overallLosses = managerData.losses.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              );
              managerData.overallTies = managerData.ties.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              );
              if (
                managerData.overallWins +
                  managerData.overallLosses +
                  managerData.overallTies >
                0
              ) {
                managerData.overallWinPercentage = (
                  (managerData.overallWins /
                    (managerData.overallWins +
                      managerData.overallLosses +
                      managerData.overallTies)) *
                  100
                ).toFixed(2);
              }
              managerData.memberUntil =
                managerData.memberSeasons[managerData.memberSeasons.length - 1];
              managerData.memberSince = managerData.memberSeasons[0];
              managerData.currentTeamName =
                managerData.teamName[managerData.teamName.length - 1];
              managerData.currentName =
                managerData.name[managerData.name.length - 1];
              managerData.currentTeamLogo =
                managerData.teamLogo[managerData.teamLogo.length - 1];
              if (managerData.memberUntil === currentYear) {
                managerData.finishes.splice(managerData.finishes.length - 1, 1);
              }
              if (managerData.finishes.length) {
                managerData.worstFinish = managerData.finishes.reduce(
                  (max, current) => (current > max ? current : max),
                  -Infinity
                );
                managerData.bestFinish = managerData.finishes.reduce(
                  (min, current) => (current < min ? current : min),
                  Infinity
                );
                managerData.championships = managerData.finishes.filter(
                  (finish) => finish === 1
                ).length;
              }
            }
          });
          managerSummaries = [...managerSummaries, managerData];
        });
        managerSummaries.sort((a, b) => b.wins - a.wins);
        managerSummaries.sort((a, b) => b.championships - a.championships);
        setLeagueSeasons(singleLeagueSeasonsArray);
        setManagers(managerSummaries);
      } finally {
        setLoading(false);
      }
    };

    getManagerInfo();
  }, [chosenSeason]);

  const handleSeasonSelect = (e) => {
    setChosenSeason(e);
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
          <Dropdown onSelect={handleSeasonSelect}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {chosenSeason}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="Overall" key="Overall">
                Overall
              </Dropdown.Item>
              {leagueSeasons.map((season) => (
                <Dropdown.Item eventKey={season} key={season}>
                  {season}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        managers.map((manager) => (
          <Link
            href={`/sport/${leagueType}/league/${leagueId}/manager/${manager.id}`}
          >
            <div className="manager-div" key={manager.id}>
              {manager.currentTeamLogo ? (
                <Image
                  src={manager.currentTeamLogo}
                  width={120}
                  height={120}
                  style={logoStyle}
                  alt={`${manager.currentTeamName}'s Logo`}
                />
              ) : (
                <h1>No valid team logo</h1>
              )}
              <p>Team Name: {manager.currentTeamName}</p>
              <p>Manager: {manager.currentName}</p>

              <p>
                {manager.memberSince} -{" "}
                {manager.memberUntil === currentYear
                  ? "Present"
                  : manager.memberUntil}
              </p>
              <p>
                {manager.overallWins} - {manager.overallLosses} -{" "}
                {manager.overallTies}
              </p>
              <p>Win %: {manager.OverallWinPercentage}%</p>
              {manager.championships > 0 ? (
                <p>Championships: {manager.championships}</p>
              ) : (
                <p>Top Finish: {manager.bestFinish}</p>
              )}
              <p>Bottom Finish: {manager.worstFinish}</p>
            </div>
          </Link>
        ))
      )}
    </>
  );
}
