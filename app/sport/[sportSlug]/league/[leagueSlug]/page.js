import LeagueOverview from "@/components/league-overview4";

export default function LeaguePage({ params }) {
  const leagueType = params.sportSlug;
  const leagueKeysString = params.leagueSlug;
  return (
    <>
      <div>
        <LeagueOverview
          leagueType={leagueType}
          leagueKeysString={leagueKeysString}
        />
      </div>
    </>
  );
}
