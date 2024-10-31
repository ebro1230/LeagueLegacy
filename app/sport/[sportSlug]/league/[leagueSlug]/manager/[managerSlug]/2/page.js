import { getLeagueStandings } from "@/lib/leagues";
import ManagerStats from "@/components/manager-stats2";
import { leagueStandings } from "@/lib/leagues";
import { Suspense } from "react";

async function ManagerOverview({ leagueType, leagueId, managerId }) {
  const leagues = await getLeagueStandings(leagueType);
  //console.log(leagues);

  const logoStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
    margin: "1.5rem",
    objectFit: "contain",
  };
  const date = new Date();
  const currentYear = date.getFullYear();

  const getManagerData = async (leagueId, managerId, leagues) => {
    const date = new Date();
    const currentYear = date.getFullYear();

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

    let managerData = {
      id: managerId,
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
      finishesToManipulate: [],
      championships: 0,
      bestFinish: "TBD",
      worstFinish: "TBD",
      pointsFor: [],
      pointsAgainst: [],
    };
    uniqueManagers.forEach((manager) => {
      if (manager === managerId) {
        RankingsPerSeason.forEach((season) => {
          season.forEach((team) => {
            if (team.managers[0].manager[0].guid[0] === manager) {
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
                Number(team.team_standings[0].outcome_totals[0].percentage[0]),
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
              managerData.teamName = [...managerData.teamName, team.name[0]];
              managerData.finishes = [
                ...managerData.finishes,
                Number(team.team_standings[0].rank[0]),
              ];
              managerData.finishesToManipulate = [
                ...managerData.finishesToManipulate,
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
            managerData.finishesToManipulate.splice(
              managerData.finishesToManipulate.length - 1,
              1
            );
          }
          if (managerData.finishesToManipulate.length) {
            managerData.worstFinish = managerData.finishesToManipulate.reduce(
              (max, current) => (current > max ? current : max),
              -Infinity
            );
            managerData.bestFinish = managerData.finishesToManipulate.reduce(
              (min, current) => (current < min ? current : min),
              Infinity
            );
            managerData.championships = managerData.finishesToManipulate.filter(
              (finish) => finish === 1
            ).length;
          }
        });
      }
    });
    //console.log("MANAGER SUMMARY");
    //console.log(managerData);
    return managerData;
  };

  const manager = await getManagerData(leagueId, managerId, leagues);

  return (
    <ManagerStats
      managerData={manager}
      logoStyle={logoStyle}
      currentYear={currentYear}
    />
  );
}

export default function LeaguePage({ params }) {
  const leagueType = params.sportSlug;
  const leagueId = params.leagueSlug;
  const managerId = params.managerSlug;

  return (
    <>
      {/* <div className="title-div">
        <h1>
          Fantasy {leagueType.charAt(0).toUpperCase() + leagueType.slice(1)}{" "}
          League Legacy
        </h1>
      </div> */}

      <div>
        <Suspense fallback={<p>Loading Manager Data...</p>}>
          <ManagerOverview
            leagueType={leagueType}
            leagueId={leagueId}
            managerId={managerId}
          />
        </Suspense>
      </div>
    </>
  );
}
