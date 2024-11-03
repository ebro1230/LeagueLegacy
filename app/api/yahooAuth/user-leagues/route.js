import { createRouter } from "next-connect";
import { NextResponse } from "next/server";
import bodyParser from "body-parser";
import bodyParserXml from "body-parser-xml";
import cors from "cors";
import { parseString } from "xml2js";

const handler = createRouter();
bodyParserXml(bodyParser);

// Attach bodyParser middleware
handler.use(
  cors({
    origin: "*", // Allow all origins
  })
);
handler.use(bodyParser.urlencoded({ extended: false }));
handler.use(bodyParser.json());
handler.use(bodyParser.xml());

handler.post((req) => {
  return req
    .json()
    .then(async (body) => {
      const accessToken = body.accessToken;
      const leagueType = body.leagueType;
      const date = new Date();
      const currentYear = date.getFullYear();
      // return NextResponse.json(
      //   { accessToken: accessToken, leagueType: leagueType },
      //   { status: 200 }
      // );
      if (leagueType === "football") {
        const response = await fetch(
          `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=57,49,79,101,124,153,175,199,222,242,257,273,314,331,348,359,371,380,390,399,406,414,423,449/leagues/teams/standings`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          let error = new Error(
            `Request failed when requesting all user football leagues with status ${response.status}`
          );
          error.status = response.status; // Add status property
          console.error(
            `Request failed when requesting all user football leagues with status ${response.status}`
          );
          throw error;
        } else {
          const data = await response.text();
          return NextResponse.text(data);
        }
      }

      // if (leagueType === "football") {
      //   // return NextResponse.json(
      //   //   { accessToken: "INSIDE IF STATEMENT", leagueType: leagueType },
      //   //   { status: 200 }
      //   // );
      //   fetch(
      //     `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=57,49,79,101,124,153,175,199,222,242,257,273,314,331,348,359,371,380,390,399,406,414,423,449/leagues/teams/standings`,
      //     {
      //       method: "GET",
      //       headers: {
      //         Authorization: `Bearer ${accessToken}`,
      //       },
      //     }
      //   )
      //     .then(async (response) => {
      //       console.log("RESPONSE OK:", response.ok);
      //       if (!response.ok) {
      //         let error = new Error(
      //           `Request failed when requesting all user football leagues with status ${response.status}`
      //         );
      //         error.status = response.status; // Add status property
      //         console.error(
      //           `Request failed when requesting all user football leagues with status ${response.status}`
      //         );
      //         throw error;
      //       } else {
      //         const data = await response.text();
      //         return NextResponse.text(data);
      //       }
      //     })
      //     .then((xml) => {
      //       return new Promise((resolve, reject) => {
      //         parseString(xml, (err, result) => {
      //           if (err) {
      //             console.error("Error parsing XML:", err);
      //             return reject(
      //               NextResponse.json({ error: `XML parsing error: ${err}` })
      //             );
      //           } else {
      //             const leagues =
      //               result.fantasy_content.users[0].user[0].games[0].game.filter(
      //                 (league) => league.leagues[0]
      //               );
      //             const allSeasons = leagues.map((seasons) => {
      //               return seasons.leagues[0].league;
      //             });
      //             let allLeagues = [];
      //             allSeasons.forEach((season) => {
      //               season.forEach((league) => {
      //                 allLeagues.push(league);
      //               });
      //             });
      //             const groupedLeagues = allLeagues.reduce((acc, obj) => {
      //               const key = obj.name;
      //               if (!acc[key]) {
      //                 acc[key] = [];
      //               }
      //               acc[key].push(obj);
      //               return acc;
      //             }, {});

      //             const SortedLeagues = Object.values(groupedLeagues);
      //             let leagueSummaries = [];
      //             SortedLeagues.forEach((league) => {
      //               let leagueData = {
      //                 leagueId: "",
      //                 leagueKeys: [],
      //                 leagueName: "",
      //                 leagueLogo: "",
      //                 teamName: "",
      //                 wins: 0,
      //                 losses: 0,
      //                 ties: 0,
      //                 memberSince: "",
      //                 memberUntil: "",
      //                 bestFinish: ["TBD"],
      //                 worstFinish: ["TBD"],
      //                 winPercentage: "TBD",
      //               };
      //               let finishes = [];
      //               leagueData.leagueName = league[0].name[0];
      //               leagueData.teamName =
      //                 league[league.length - 1].teams[0].team[0].name[0];

      //               leagueData.memberSince = Number(league[0].season[0]);
      //               if (
      //                 Number(league[league.length - 1].season[0]) ===
      //                 currentYear
      //               ) {
      //                 leagueData.memberUntil = currentYear;
      //               } else {
      //                 leagueData.memberUntil = Number(
      //                   league[league.length - 1].season[0]
      //                 );
      //               }

      //               league.forEach((season) => {
      //                 leagueData.leagueKeys = [
      //                   ...leagueData.leagueKeys,
      //                   season.league_key[0],
      //                 ];
      //                 leagueData.leagueLogo = [
      //                   ...leagueData.leagueLogo,
      //                   season.logo_url[0],
      //                 ];
      //                 if (
      //                   season.teams[0].team[0].team_standings[0].outcome_totals
      //                 ) {
      //                   leagueData.wins =
      //                     leagueData.wins +
      //                     Number(
      //                       season.teams[0].team[0].team_standings[0]
      //                         .outcome_totals[0].wins[0]
      //                     );
      //                   leagueData.losses =
      //                     leagueData.losses +
      //                     Number(
      //                       season.teams[0].team[0].team_standings[0]
      //                         .outcome_totals[0].losses[0]
      //                     );
      //                   leagueData.ties =
      //                     leagueData.ties +
      //                     Number(
      //                       season.teams[0].team[0].team_standings[0]
      //                         .outcome_totals[0].ties[0]
      //                     );
      //                 } else {
      //                   leagueData.wins = leagueData.wins + 0;
      //                   leagueData.losses = leagueData.losses + 0;
      //                   leagueData.ties = leagueData.ties + 0;
      //                 }
      //                 if (season.draft_status[0] === "postdraft") {
      //                   finishes = [
      //                     ...finishes,
      //                     Number(
      //                       season.teams[0].team[0].team_standings[0].rank[0]
      //                     ),
      //                   ];
      //                 }
      //               });
      //               leagueData.leagueLogo = leagueData.leagueLogo.filter(
      //                 (logo) => logo != ""
      //               );
      //               leagueData.leagueLogo =
      //                 leagueData.leagueLogo[leagueData.leagueLogo.length - 1];
      //               if (leagueData.memberUntil === currentYear) {
      //                 finishes.splice(finishes.length - 1, 1);
      //               }
      //               if (finishes.length) {
      //                 leagueData.worstFinish = finishes.reduce(
      //                   (max, current) => (current > max ? current : max),
      //                   -Infinity
      //                 );
      //                 leagueData.bestFinish = finishes.reduce(
      //                   (min, current) => (current < min ? current : min),
      //                   Infinity
      //                 );
      //               }
      //               if (
      //                 leagueData.wins + leagueData.losses + leagueData.ties >
      //                 0
      //               )
      //                 leagueData.winPercentage = (
      //                   (leagueData.wins /
      //                     (leagueData.wins +
      //                       leagueData.losses +
      //                       leagueData.ties)) *
      //                   100
      //                 ).toFixed(2);

      //               leagueData.memberYears =
      //                 leagueData.memberUntil - leagueData.memberSince + 1;
      //               leagueSummaries = [...leagueSummaries, leagueData];
      //             });
      //             leagueSummaries.sort((a, b) => {
      //               if (a.memberUntil != b.memberUntil) {
      //                 return b.memberUntil - a.memberUntil;
      //               }

      //               if (a.memberYears !== b.memberYears) {
      //                 return b.memberYears - a.memberYears;
      //               }
      //             });
      //             return resolve(NextResponse.json(leagueSummaries));
      //           }
      //         });

      //         //return NextResponse.json(leagueSummaries);
      //         //res.send(JSON.stringify(leagueSummaries));
      //       });
      //     })
      //     .catch((error) => {
      //       // console.error("Error parsing JSON or network issue:", error);
      //       // console.log(error.message);
      //       return NextResponse.json(
      //         { error: { message: error.message, status: error.status } },
      //         { status: error.status || 500 }
      //       );
      //       // res
      //       //   .status(error.status || 500)
      //       //   .json({ message: error.message, status: error.status });
      //     });
      // }
      // // else if (leagueType === "hockey") {
      // //   fetch(
      // //     `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=15,64,94,111,130,164,186,210,233,248,263,303,321,341,352,363,376,386,396,403,411,419,427,453/leagues/teams/standings`,
      // //     {
      // //       method: "GET",
      // //       headers: {
      // //         Authorization: `Bearer ${accessToken}`,
      // //       },
      // //     }
      // //   )
      // //     .then((response) => {
      // //       if (!response.ok) {
      // //         const error = new Error(
      // //           `Request failed when requesting all user hockey leagues with status ${response.status}`
      // //         );
      // //         error.status = response.status; // Add status property
      // //         throw error;
      // //       }
      // //       return response.text();
      // //     })
      // //     .then((data) => {
      // //       const xml = data;
      // //       parseString(xml, (err, result) => {
      // //         if (err) {
      // //           console.error("Error parsing XML:", err);
      // //           throw new Error(`Error parsing XML: ${err}`);
      // //         }
      // //         const leagues =
      // //           result.fantasy_content.users[0].user[0].games[0].game.filter(
      // //             (league) => league.leagues[0]
      // //           );
      // //         const allSeasons = leagues.map((seasons) => {
      // //           return seasons.leagues[0].league;
      // //         });
      // //         let allLeagues = [];
      // //         allSeasons.forEach((season) => {
      // //           season.forEach((league) => {
      // //             allLeagues.push(league);
      // //           });
      // //         });
      // //         const groupedLeagues = allLeagues.reduce((acc, obj) => {
      // //           const key = obj.name;
      // //           if (!acc[key]) {
      // //             acc[key] = [];
      // //           }
      // //           acc[key].push(obj);
      // //           return acc;
      // //         }, {});

      // //         const SortedLeagues = Object.values(groupedLeagues);
      // //         let leagueSummaries = [];
      // //         SortedLeagues.forEach((league) => {
      // //           let leagueData = {
      // //             leagueId: "",
      // //             leagueKeys: [],
      // //             leagueName: "",
      // //             leagueLogo: "",
      // //             teamName: "",
      // //             wins: 0,
      // //             losses: 0,
      // //             ties: 0,
      // //             memberSince: "",
      // //             memberUntil: "",
      // //             bestFinish: "TBD",
      // //             worstFinish: "TBD",
      // //             winPercentage: "TBD",
      // //           };
      // //           let finishes = [];

      // //           leagueData.leagueName = league[0].name[0];
      // //           leagueData.teamName =
      // //             league[league.length - 1].teams[0].team[0].name[0];

      // //           leagueData.memberSince = Number(league[0].season[0]);
      // //           if (Number(league[league.length - 1].season[0]) === currentYear) {
      // //             leagueData.memberUntil = currentYear;
      // //           } else {
      // //             leagueData.memberUntil = Number(
      // //               league[league.length - 1].season[0]
      // //             );
      // //           }

      // //           league.forEach((season) => {
      // //             leagueData.leagueKeys = [
      // //               ...leagueData.leagueKeys,
      // //               season.league_key[0],
      // //             ];
      // //             leagueData.leagueLogo = [
      // //               ...leagueData.leagueLogo,
      // //               season.logo_url[0],
      // //             ];
      // //             leagueData.wins =
      // //               leagueData.wins +
      // //               Number(
      // //                 season.teams[0].team[0].team_standings[0].outcome_totals[0]
      // //                   .wins[0]
      // //               );
      // //             leagueData.losses =
      // //               leagueData.losses +
      // //               Number(
      // //                 season.teams[0].team[0].team_standings[0].outcome_totals[0]
      // //                   .losses[0]
      // //               );
      // //             leagueData.ties =
      // //               leagueData.ties +
      // //               Number(
      // //                 season.teams[0].team[0].team_standings[0].outcome_totals[0]
      // //                   .ties[0]
      // //               );
      // //             if (season.draft_status[0] === "postdraft") {
      // //               finishes = [
      // //                 ...finishes,
      // //                 Number(season.teams[0].team[0].team_standings[0].rank[0]),
      // //               ];
      // //             }
      // //           });
      // //           leagueData.leagueLogo = leagueData.leagueLogo.filter(
      // //             (logo) => logo != ""
      // //           );
      // //           leagueData.leagueLogo =
      // //             leagueData.leagueLogo[leagueData.leagueLogo.length - 1];
      // //           if (leagueData.memberUntil === currentYear) {
      // //             finishes.splice(finishes.length - 1, 1);
      // //           }

      // //           if (finishes.length) {
      // //             leagueData.worstFinish = finishes.reduce(
      // //               (max, current) => (current > max ? current : max),
      // //               -Infinity
      // //             );
      // //             leagueData.bestFinish = finishes.reduce(
      // //               (min, current) => (current < min ? current : min),
      // //               Infinity
      // //             );
      // //           }
      // //           if (leagueData.wins + leagueData.losses + leagueData.ties > 0)
      // //             leagueData.winPercentage = (
      // //               (leagueData.wins /
      // //                 (leagueData.wins + leagueData.losses + leagueData.ties)) *
      // //               100
      // //             ).toFixed(2);

      // //           leagueData.memberYears =
      // //             leagueData.memberUntil - leagueData.memberSince + 1;

      // //           leagueSummaries = [...leagueSummaries, leagueData];
      // //         });
      // //         leagueSummaries.sort((a, b) => {
      // //           if (a.memberUntil != b.memberUntil) {
      // //             return b.memberUntil - a.memberUntil;
      // //           }

      // //           if (a.memberYears !== b.memberYears) {
      // //             return b.memberYears - a.memberYears;
      // //           }
      // //         });
      // //         return NextResponse.json(leagueSummaries);
      // //         //res.send(JSON.stringify(leagueSummaries));
      // //       });
      // //     })
      // //     .catch((error) => {
      // //       console.error("Error parsing JSON or network issue:", error);
      // //       console.log(error.message);
      // //       return NextResponse.json(
      // //         { error: { message: error.message, status: error.status } },
      // //         { status: error.status || 500 }
      // //       );
      // //       // res
      // //       //   .status(error.status || 500)
      // //       //   .json({ message: error.message, status: error.status });
      // //     });
      // // } else if (leagueType === "basketball") {
      // //   fetch(
      // //     `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=16,67,95,112,131,165,187,211,234,249,265,304,322,342,353,364,375,385,395,402,410,418,428,454/leagues/teams/standings`,
      // //     {
      // //       method: "GET",
      // //       headers: {
      // //         Authorization: `Bearer ${accessToken}`,
      // //       },
      // //     }
      // //   )
      // //     .then((response) => {
      // //       if (!response.ok) {
      // //         const error = new Error(
      // //           `Request failed when requesting all user basketball leagues with status ${response.status}`
      // //         );
      // //         error.status = response.status; // Add status property
      // //         throw error;
      // //       }
      // //       return response.text();
      // //     })
      // //     .then((data) => {
      // //       const xml = data;
      // //       parseString(xml, (err, result) => {
      // //         if (err) {
      // //           console.error("Error parsing XML:", err);
      // //           throw new Error(`Error parsing XML: ${err}`);
      // //         }
      // //         const leagues =
      // //           result.fantasy_content.users[0].user[0].games[0].game.filter(
      // //             (league) => league.leagues[0]
      // //           );
      // //         const allSeasons = leagues.map((seasons) => {
      // //           return seasons.leagues[0].league;
      // //         });
      // //         let allLeagues = [];
      // //         allSeasons.forEach((season) => {
      // //           season.forEach((league) => {
      // //             allLeagues.push(league);
      // //           });
      // //         });
      // //         const groupedLeagues = allLeagues.reduce((acc, obj) => {
      // //           const key = obj.name;
      // //           if (!acc[key]) {
      // //             acc[key] = [];
      // //           }
      // //           acc[key].push(obj);
      // //           return acc;
      // //         }, {});

      // //         const SortedLeagues = Object.values(groupedLeagues);
      // //         let leagueSummaries = [];
      // //         SortedLeagues.forEach((league) => {
      // //           let leagueData = {
      // //             leagueId: "",
      // //             leagueKeys: [],
      // //             leagueName: "",
      // //             leagueLogo: "",
      // //             teamName: "",
      // //             wins: 0,
      // //             losses: 0,
      // //             ties: 0,
      // //             memberSince: "",
      // //             memberUntil: "",
      // //             bestFinish: "TBD",
      // //             worstFinish: "TBD",
      // //             winPercentage: "TBD",
      // //           };
      // //           let finishes = [];
      // //           leagueData.leagueName = league[0].name[0];
      // //           leagueData.teamName =
      // //             league[league.length - 1].teams[0].team[0].name[0];

      // //           leagueData.memberSince = Number(league[0].season[0]);
      // //           if (Number(league[league.length - 1].season[0]) === currentYear) {
      // //             leagueData.memberUntil = currentYear;
      // //           } else {
      // //             leagueData.memberUntil = Number(
      // //               league[league.length - 1].season[0]
      // //             );
      // //           }

      // //           league.forEach((season) => {
      // //             leagueData.leagueKeys = [
      // //               ...leagueData.leagueKeys,
      // //               season.league_key[0],
      // //             ];
      // //             leagueData.leagueLogo = [
      // //               ...leagueData.leagueLogo,
      // //               season.logo_url[0],
      // //             ];
      // //             leagueData.wins =
      // //               leagueData.wins +
      // //               Number(
      // //                 season.teams[0].team[0].team_standings[0].outcome_totals[0]
      // //                   .wins[0]
      // //               );
      // //             leagueData.losses =
      // //               leagueData.losses +
      // //               Number(
      // //                 season.teams[0].team[0].team_standings[0].outcome_totals[0]
      // //                   .losses[0]
      // //               );
      // //             leagueData.ties =
      // //               leagueData.ties +
      // //               Number(
      // //                 season.teams[0].team[0].team_standings[0].outcome_totals[0]
      // //                   .ties[0]
      // //               );
      // //             if (season.draft_status[0] === "postdraft") {
      // //               finishes = [
      // //                 ...finishes,
      // //                 Number(season.teams[0].team[0].team_standings[0].rank[0]),
      // //               ];
      // //             }
      // //           });
      // //           leagueData.leagueLogo = leagueData.leagueLogo.filter(
      // //             (logo) => logo != ""
      // //           );
      // //           leagueData.leagueLogo =
      // //             leagueData.leagueLogo[leagueData.leagueLogo.length - 1];
      // //           if (leagueData.memberUntil === currentYear) {
      // //             finishes.splice(finishes.length - 1, 1);
      // //           }
      // //           if (finishes.length) {
      // //             leagueData.worstFinish = finishes.reduce(
      // //               (max, current) => (current > max ? current : max),
      // //               -Infinity
      // //             );
      // //             leagueData.bestFinish = finishes.reduce(
      // //               (min, current) => (current < min ? current : min),
      // //               Infinity
      // //             );
      // //           }
      // //           if (leagueData.wins + leagueData.losses + leagueData.ties > 0)
      // //             leagueData.winPercentage = (
      // //               (leagueData.wins /
      // //                 (leagueData.wins + leagueData.losses + leagueData.ties)) *
      // //               100
      // //             ).toFixed(2);

      // //           leagueData.memberYears =
      // //             leagueData.memberUntil - leagueData.memberSince + 1;

      // //           leagueSummaries = [...leagueSummaries, leagueData];
      // //         });
      // //         leagueSummaries.sort((a, b) => {
      // //           if (a.memberUntil != b.memberUntil) {
      // //             return b.memberUntil - a.memberUntil;
      // //           }

      // //           if (a.memberYears !== b.memberYears) {
      // //             return b.memberYears - a.memberYears;
      // //           }
      // //         });
      // //         return NextResponse.json(leagueSummaries);
      // //         //res.send(JSON.stringify(leagueSummaries));
      // //       });
      // //     })
      // //     .catch((error) => {
      // //       console.error("Error parsing JSON or network issue:", error);
      // //       console.log(error.message);
      // //       return NextResponse.json(
      // //         { error: { message: error.message, status: error.status } },
      // //         { status: error.status || 500 }
      // //       );
      // //       // res
      // //       //   .status(error.status || 500)
      // //       //   .json({ message: error.message, status: error.status });
      // //     });
      // // } else if (leagueType === "baseball") {
      // //   fetch(
      // //     `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=12,39,74,98,113,147,171,195,215,238,253,268,308,328,346,357,370,378,388,398,404,412,422,431/leagues/teams/standings`,
      // //     {
      // //       method: "GET",
      // //       headers: {
      // //         Authorization: `Bearer ${accessToken}`,
      // //       },
      // //     }
      // //   )
      // //     .then((response) => {
      // //       if (!response.ok) {
      // //         const error = new Error(
      // //           `Request failed when requesting all user baseball leagues with status ${response.status}`
      // //         );
      // //         error.status = response.status; // Add status property
      // //         throw error;
      // //       }
      // //       return response.text();
      // //     })
      // //     .then((data) => {
      // //       const xml = data;
      // //       parseString(xml, (err, result) => {
      // //         if (err) {
      // //           console.error("Error parsing XML:", err);
      // //           throw new Error(`Error parsing XML: ${err}`);
      // //         }
      // //         const leagues =
      // //           result.fantasy_content.users[0].user[0].games[0].game.filter(
      // //             (league) => league.leagues[0]
      // //           );
      // //         const allSeasons = leagues.map((seasons) => {
      // //           return seasons.leagues[0].league;
      // //         });
      // //         let allLeagues = [];
      // //         allSeasons.forEach((season) => {
      // //           season.forEach((league) => {
      // //             allLeagues.push(league);
      // //           });
      // //         });
      // //         const groupedLeagues = allLeagues.reduce((acc, obj) => {
      // //           const key = obj.name;
      // //           if (!acc[key]) {
      // //             acc[key] = [];
      // //           }
      // //           acc[key].push(obj);
      // //           return acc;
      // //         }, {});

      // //         const SortedLeagues = Object.values(groupedLeagues);
      // //         let leagueSummaries = [];
      // //         SortedLeagues.forEach((league) => {
      // //           let leagueData = {
      // //             leagueId: "",
      // //             leagueKeys: [],
      // //             leagueName: "",
      // //             leagueLogo: "",
      // //             teamName: "",
      // //             wins: 0,
      // //             losses: 0,
      // //             ties: 0,
      // //             memberSince: "",
      // //             memberUntil: "",
      // //             bestFinish: ["TBD"],
      // //             worstFinish: ["TBD"],
      // //             winPercentage: "TBD",
      // //           };
      // //           let finishes = [];
      // //           leagueData.leagueName = league[0].name[0];
      // //           leagueData.teamName =
      // //             league[league.length - 1].teams[0].team[0].name[0];

      // //           leagueData.memberSince = Number(league[0].season[0]);
      // //           if (Number(league[league.length - 1].season[0]) === currentYear) {
      // //             leagueData.memberUntil = currentYear;
      // //           } else {
      // //             leagueData.memberUntil = Number(
      // //               league[league.length - 1].season[0]
      // //             );
      // //           }

      // //           league.forEach((season) => {
      // //             leagueData.leagueKeys = [
      // //               ...leagueData.leagueKeys,
      // //               season.league_key[0],
      // //             ];
      // //             leagueData.leagueLogo = [
      // //               ...leagueData.leagueLogo,
      // //               season.logo_url[0],
      // //             ];
      // //             leagueData.wins =
      // //               leagueData.wins +
      // //               Number(
      // //                 season.teams[0].team[0].team_standings[0].outcome_totals[0]
      // //                   .wins[0]
      // //               );
      // //             leagueData.losses =
      // //               leagueData.losses +
      // //               Number(
      // //                 season.teams[0].team[0].team_standings[0].outcome_totals[0]
      // //                   .losses[0]
      // //               );
      // //             leagueData.ties =
      // //               leagueData.ties +
      // //               Number(
      // //                 season.teams[0].team[0].team_standings[0].outcome_totals[0]
      // //                   .ties[0]
      // //               );
      // //             if (season.draft_status[0] === "postdraft") {
      // //               finishes = [
      // //                 ...finishes,
      // //                 Number(season.teams[0].team[0].team_standings[0].rank[0]),
      // //               ];
      // //             }
      // //           });
      // //           leagueData.leagueLogo = leagueData.leagueLogo.filter(
      // //             (logo) => logo != ""
      // //           );
      // //           leagueData.leagueLogo =
      // //             leagueData.leagueLogo[leagueData.leagueLogo.length - 1];
      // //           if (leagueData.memberUntil === currentYear) {
      // //             finishes.splice(finishes.length - 1, 1);
      // //           }
      // //           if (finishes.length) {
      // //             leagueData.worstFinish = finishes.reduce(
      // //               (max, current) => (current > max ? current : max),
      // //               -Infinity
      // //             );
      // //             leagueData.bestFinish = finishes.reduce(
      // //               (min, current) => (current < min ? current : min),
      // //               Infinity
      // //             );
      // //           }
      // //           if (leagueData.wins + leagueData.losses + leagueData.ties > 0)
      // //             leagueData.winPercentage = (
      // //               (leagueData.wins /
      // //                 (leagueData.wins + leagueData.losses + leagueData.ties)) *
      // //               100
      // //             ).toFixed(2);

      // //           leagueData.memberYears =
      // //             leagueData.memberUntil - leagueData.memberSince + 1;

      // //           leagueSummaries = [...leagueSummaries, leagueData];
      // //         });
      // //         leagueSummaries.sort((a, b) => {
      // //           if (a.memberUntil != b.memberUntil) {
      // //             return b.memberUntil - a.memberUntil;
      // //           }

      // //           if (a.memberYears !== b.memberYears) {
      // //             return b.memberYears - a.memberYears;
      // //           }
      // //         });
      // //         return NextResponse.json(leagueSummaries);
      // //         //res.send(JSON.stringify(leagueSummaries));
      // //       });
      // //     })
      // //     .catch((error) => {
      // //       console.error("Error parsing JSON or network issue:", error);
      // //       console.log(error.message);
      // //       return NextResponse.json(
      // //         { error: { message: error.message, status: error.status } },
      // //         { status: error.status || 500 }
      // //       );
      // //       // res
      // //       //   .status(error.status || 500)
      // //       //   .json({ message: error.message, status: error.status });
      // //     });
      // // }
      // else {
      //   return NextResponse.json(
      //     { message: "League Type Missing in the else statement" },
      //     { status: 400 }
      //   );
      // }
      return NextResponse.json(
        {
          message: "League Type Missing outside the if/else statement",
          body: body,
          acessToken: accessToken,
          leagueType: leagueType,
        },
        { status: 400 }
      );
    })
    .catch((error) => {
      console.error("Request body parsing error:", error);
      return NextResponse.json(
        { error: { message: "Invalid request body" } },
        { status: 400 }
      );
    });
});
export async function POST(request, context) {
  return handler.run(request, context);
}
