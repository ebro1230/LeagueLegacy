import { getLeagueStandings } from "@/lib/leagues";
import LeagueOverview from "@/components/league-overview4";

// async function Overview({ leagueType, leagueKeysString }) {
//   // const leagues = await getLeagueStandings(leagueType);
//   // console.log("LEAGUES");
//   // console.log(leagues);
//   return (

//   );
// }

export default function LeaguePage({ params }) {
  const leagueType = params.sportSlug;
  const leagueKeysString = params.leagueSlug;
  return (
    <>
      {/* <div className="title-div">
        <h1>
          Fantasy {leagueType.charAt(0).toUpperCase() + leagueType.slice(1)}{" "}
          League Legacy
        </h1>
      </div> */}

      <div>
        <LeagueOverview
          leagueType={leagueType}
          leagueKeysString={leagueKeysString}
        />
      </div>
    </>
  );
}
