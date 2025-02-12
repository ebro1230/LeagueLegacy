import LeagueOverview from "@/components/league-overview4";

export default function LeaguePage({ params }) {
  const leagueType = params.sportSlug;
  const leagueKeysString = params.leagueSlug;
  console.log("leagueSlug PARAMS");
  console.log(params);
  return (
    <>
      <LeagueOverview
        leagueType={leagueType}
        leagueKeysString={leagueKeysString}
      />
    </>
  );
}
