import { getCookie } from "@/actions/cookies";

export async function GetLeagues({ leagueKeys, team1, team2 }) {
  const tokens = await getCookie();
  fetch(`http://localhost:8000/api/yahooAuth/matchups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: tokens.accessToken,
      leagues: leagueKeys,
      team1: team1,
      team2: team2,
    }),
  }).then(async (response) => {
    //console.log(await response.json());
  });
  return <h1>LEAGUE MATCHUPS</h1>;
}

export default function MatchupsPage() {
  const singleLeagueAllSeasons = [
    "331.l.1276276",
    "348.l.1066944",
    "359.l.902007",
    "371.l.486136",
    "380.l.740028",
    "390.l.612731",
    "399.l.529818",
    "406.l.345080",
    "414.l.441340",
    "423.l.113311",
    "449.l.210594",
  ];
  const team1 = "6PIBHSQ7MZXUFYXXPWEZCHQW64";
  const team2 = "HJLMEVB7BUQNTG5PC2NJIS3O3Q";
  return (
    <>
      <div className="title-div">
        <h1>League Legacy Mathcups</h1>
      </div>

      <div>
        <GetLeagues
          leagueKeys={singleLeagueAllSeasons}
          team1={team1}
          team2={team2}
        />
      </div>
    </>
  );
}
