import LeagueOverview from "@/components/league-overview4";
import { Suspense } from "react";
import LoadingIndicator from "@/components/loading-indicator";

export default function LeaguePage({ params }) {
  const leagueType = params.sportSlug;
  const leagueKeysString = params.leagueSlug;
  return (
    <div className="normal-background">
      <Suspense
        fallback={
          <div className="loading-div">
            <LoadingIndicator>
              <span className="visually-hidden">Loading...</span>
            </LoadingIndicator>
          </div>
        }
      >
        <LeagueOverview
          leagueType={leagueType}
          leagueKeysString={leagueKeysString}
        />
      </Suspense>
    </div>
  );
}
