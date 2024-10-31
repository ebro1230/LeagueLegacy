import { getLeagueStandings } from "@/lib/leagues";
import ManagerStats from "@/components/manager-stats";
import { leagueStandings } from "@/lib/leagues";
import { Suspense } from "react";

async function ManagerOverview({ leagueType, leagueId, managerId }) {
  const leagues = await getLeagueStandings(leagueType);
  //console.log(leagues);

  return (
    <ManagerStats
      leagues={leagues}
      leagueType={leagueType}
      leagueId={leagueId}
      managerId={managerId}
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
        <ManagerOverview
          leagueType={leagueType}
          leagueId={leagueId}
          managerId={managerId}
        />
      </div>
    </>
  );
}
