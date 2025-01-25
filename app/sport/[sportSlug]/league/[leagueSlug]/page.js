import LeagueOverview from "@/components/league-overview4";
import { Suspense } from "react";
import LoadingIndicator from "@/components/loading-indicator";

export default function LeaguePage({ params }) {
  const leagueType = params.sportSlug;
  const leagueKeysString = params.leagueSlug;
  return (
    <>
      <LeagueOverview
        leagueType={leagueType}
        leagueKeysString={leagueKeysString}
      />
    </>
  );
}
