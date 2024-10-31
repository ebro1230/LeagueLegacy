//import MealItem from "./meal-item";

import Link from "next/link";
import Image from "next/image";

export default function LeaguesGrid({ leagues, leagueType }) {
  const date = new Date();
  const currentYear = date.getFullYear();
  const logoStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
    margin: "1.5rem",
    objectFit: "contain",
  };

  // const allSeasons = leagues.map((seasons) => {
  //   return seasons.leagues[0].league;
  // });
  // console.log("ALL SEASONS");
  // console.log(allSeasons);
  // let allLeagues = [];
  // allSeasons.forEach((season) => {
  //   season.forEach((league) => {
  //     allLeagues.push(league);
  //   });
  // });

  // const uniqueLeagues = [
  //   ...new Set(allLeagues.map((league) => league.name[0])),
  // ];

  // // Group objects by the 'League Name' key
  // const groupedLeagues = allLeagues.reduce((acc, obj) => {
  //   const key = obj.name;
  //   if (!acc[key]) {
  //     acc[key] = [];
  //   }
  //   acc[key].push(obj);
  //   return acc;
  // }, {});

  // // Convert the grouped object into an array of arrays
  // const sortedLeagues = Object.values(groupedLeagues);

  // let leagueSummaries = [];

  // sortedLeagues.forEach((league) => {
  //   let leagueData = {
  //     id: "",
  //     leagueName: "",
  //     teamName: "",
  //     wins: 0,
  //     losses: 0,
  //     ties: 0,
  //     memberSince: "",
  //     memberUntil: "",
  //     memberYears: "",
  //     bestFinish: "TBD",
  //     worstFinish: "TBD",
  //     winPercentage: "TBD",
  //   };
  //   let finishes = [];
  //   leagueData.id = league[league.length - 1].league_key[0];
  //   leagueData.leagueName = league[0].name[0];
  //   leagueData.memberSince = Number(league[0].season[0]);
  //   if (Number(league[league.length - 1].season[0]) === currentYear) {
  //     leagueData.memberUntil = currentYear;
  //   } else {
  //     leagueData.memberUntil = Number(league[league.length - 1].season[0]);
  //   }
  //   leagueData.teamName = league[league.length - 1].teams[0].team[0].name[0];
  //   league.forEach((season) => {
  //     leagueData.wins =
  //       leagueData.wins +
  //       Number(
  //         season.teams[0].team[0].team_standings[0].outcome_totals[0].wins[0]
  //       );
  //     leagueData.losses =
  //       leagueData.losses +
  //       Number(
  //         season.teams[0].team[0].team_standings[0].outcome_totals[0].losses[0]
  //       );
  //     leagueData.ties =
  //       leagueData.ties +
  //       Number(
  //         season.teams[0].team[0].team_standings[0].outcome_totals[0].ties[0]
  //       );
  //     if (season.draft_status[0] === "postdraft") {
  //       finishes = [
  //         ...finishes,
  //         Number(season.teams[0].team[0].team_standings[0].rank[0]),
  //       ];
  //     }
  //   });
  //   if (leagueData.memberUntil === currentYear) {
  //     finishes.splice(finishes.length - 1, 1);
  //   }
  //   if (finishes.length) {
  //     leagueData.worstFinish = finishes.reduce(
  //       (max, current) => (current > max ? current : max),
  //       -Infinity
  //     );
  //     leagueData.bestFinish = finishes.reduce(
  //       (min, current) => (current < min ? current : min),
  //       Infinity
  //     );
  //   }
  //   if (leagueData.wins + leagueData.losses + leagueData.ties > 0)
  //     leagueData.winPercentage = (
  //       (leagueData.wins /
  //         (leagueData.wins + leagueData.losses + leagueData.ties)) *
  //       100
  //     ).toFixed(2);

  //   leagueData.memberYears =
  //     leagueData.memberUntil - leagueData.memberSince + 1;

  //   leagueSummaries = [...leagueSummaries, leagueData];
  // });

  // leagueSummaries.sort((a, b) => b.memberYears - a.memberYears);
  // leagueSummaries.sort((a, b) => b.memberUntil - a.memberUntil);
  // console.log(leagueSummaries);
  // wins =
  //   wins + season.teams.team[0].team_standings[0].outcome_totals[0].wins[0];
  //   console.log("WINS");
  //   console.log(wins);
  //   console.log("ALL LEAGUES:");
  //   console.log(allLeagues);
  //   console.log("UNIQUE LEAGUE NAMES");
  //   console.log(uniqueLeagues);
  //   console.log("LEAGUES SORTED BY LEAGUE NAME");
  //   console.log(sortedLeagues);
  //   sortedLeagues.forEach((league) => {
  //     console.log(league[0].name[0]);
  //   });
  return (
    <>
      {leagues.map((league) => (
        <Link href={`/sport/${leagueType}/league/${league.leagueKeys}`}>
          <div className="league-div" key={league.leagueKeys}>
            {league.leagueLogo ? (
              <Image
                src={league.leagueLogo}
                width={120}
                height={120}
                style={logoStyle}
                alt={`${league.leagueName}'s Logo`}
              />
            ) : null}
            <p>League: {league.leagueName}</p>
            <p>Team Name: {league.teamName}</p>
            <p>
              {league.memberSince} -{" "}
              {league.memberUntil === currentYear
                ? "Present"
                : league.memberUntil}
            </p>
            <p>
              {league.wins} - {league.losses} - {league.ties}
            </p>
            <p>Win Percentage: {league.winPercentage}%</p>
            <p>Top Finish: {league.bestFinish}</p>
            <p>Bottom Finish: {league.worstFinish}</p>
          </div>
        </Link>
      ))}
    </>
  );
}
