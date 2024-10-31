import { getCookie } from "@/actions/cookies";
let leagues;
let leagueStandings;

export async function getLeagues(leagueType, accessToken) {
  storeLeagues(leagueType, accessToken);
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:8000/api/yahooAuth/user-leagues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: accessToken,
        leagueType: leagueType,
      }),
    }).then((response) => {
      resolve(response.json());
    });
  });
}

export async function storeLeagues(leagueType, tokens) {
  fetch(`http://localhost:8000/api/yahooAuth/user-leagues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: tokens.accessToken,
      leagueType: leagueType,
    }),
  }).then((response) => {
    leagues = response.json();
  });
}

export async function getStoredLeagues() {
  if (!leagues) {
    throw new Error("No League Data Found");
  } else {
    return leagues;
  }
}

export async function getLeagueStandings(leagueType) {
  const tokens = await getCookie();
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:8000/api/yahooAuth/league-standings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: tokens.accessToken,
        leagueType: leagueType,
      }),
    }).then((response) => {
      resolve(response.json());
    });
  });
}

export async function storeLeagueStandings(leagueType, tokens) {
  fetch(`http://localhost:8000/api/yahooAuth/league-standings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: tokens.accessToken,
      leagueType: leagueType,
    }),
  }).then((response) => {
    leagueStandings = response.json();
  });
}

export async function getStoredLeagueStandings() {
  if (!leagueStandings) {
    throw new Error("No League Data Found");
  } else {
    return leagueStandings;
  }
}

//     // console.log("FRONTEND RESPONSE:");
//     // const jsonobjectResponse = await response.json();
//     // console.log(jsonobjectResponse);
//     // return jsonobjectResponse;
//   });
//   .then((str) => {
//     const parser = new DOMParser();
//     const xml = parser.parseFromString(str, "application/xml");

//     // Print the XML
//     const xmlData = new XMLSerializer().serializeToString(xml);
//     parseString(xmlData, function (err, result) {
//       return result;
//     });
//   });
