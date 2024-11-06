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

handler.post(async (req) => {
  return req
    .json()
    .then(async (body) => {
      const { accessToken, teamKeys, week, leagueKey, weekDays, leagueType } =
        body;
      let rosters = [];
      let team1PlayerPoints = [];
      let team2PlayerPoints = [];
      if (leagueType === "football") {
        const fetchPromises = teamKeys.map(async (teamKey) => {
          const response = await fetch(
            `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster;week=${week}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (!response.ok) {
            let error = new Error(
              `Request failed when requesting the weekly lineup for football leagues with status ${response.status}`
            );
            error.status = response.status; // Add status property
            console.error(
              `Request failed when requesting the weekly lineup for football leagues with status ${response.status}`
            );
            throw error;
          } else {
            const data = await response.text();
            return data;
          }
        });
        try {
          const responses = await Promise.all(fetchPromises);
          responses.map((xml) => {
            parseString(xml, (err, result) => {
              if (err) {
                console.error("Error parsing XML:", err);
                throw new Error(
                  `Error parsing initial weekly lineup for football XML: ${err}`
                );
              }
              const players =
                result.fantasy_content.team[0].roster[0].players[0].player.map(
                  (player) => {
                    return {
                      playerKey: player.player_key[0],
                      playerName: player.name[0].full[0],
                      playerTeamName: player.editorial_team_full_name[0],
                      playerTeamAbbreviation: player.editorial_team_abbr[0],
                      playerImage: player.image_url[0],
                      playerPosition: player.selected_position[0].position[0],
                      playerIsFlex:
                        player.selected_position[0].is_flex[0] === 1
                          ? true
                          : false,
                      playerStatus: player.status
                        ? player.status[0]
                        : "Available",
                      playerId: player.player_id[0],
                      playerByeWeeks: player.bye_weeks
                        ? player.bye_weeks[0].week[0]
                        : null,
                    };
                  }
                );

              rosters.push(players);
            });
          });
        } catch (error) {
          console.error(
            "Error when parsing initial weekly lineup for football XML:",
            error
          );
          return NextResponse.json(
            {
              error: {
                message: `Error when parsing initial weekly lineup for football XML: ${error.message}`,
              },
              status: error.status,
            },
            { status: error.status }
          );
        } finally {
          const fetchTeam1PlayerPromises = rosters[0].map(async (player) => {
            const response = await fetch(
              `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;player_keys=${player.playerKey}/stats;type=week;week=${week}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            if (!response.ok) {
              let error = new Error(
                `Request failed when requesting Team 1 Player with status ${response.status}`
              );
              error.status = response.status; // Add status property
              console.error(
                `Request failed when requesting Team 1 Player with status ${response.status}`
              );
              throw error;
            } else {
              const data = await response.text();
              return data;
            }
          });
          try {
            const responses = await Promise.all(fetchTeam1PlayerPromises);
            responses.map((xml) => {
              parseString(xml, (err, result) => {
                if (err) {
                  console.error("Error parsing XML:", err);
                  throw new Error(
                    `Error parsing team 1 players for football XML: ${err}`
                  );
                }
                const players =
                  result.fantasy_content.league[0].players[0].player.map(
                    (player) => {
                      return {
                        playerKey: player.player_key[0],
                        playerPoints: Number(player.player_points[0].total[0]),
                      };
                    }
                  );
                team1PlayerPoints.push(players);
              });
            });
          } catch (error) {
            console.error(
              "Error when parsing team 1 players for football XML:",
              error
            );
            return NextResponse.json(
              {
                error: {
                  message: `Error when parsing team 1 players for football XML: ${error.message}`,
                },
                status: error.status,
              },
              { status: error.status }
            );
          } finally {
          }
          const fetchTeam2PlayerPromises = rosters[1].map(async (player) => {
            const response = await fetch(
              `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;player_keys=${player.playerKey}/stats;type=week;week=${week}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            if (!response.ok) {
              let error = new Error(
                `Request failed when requesting Team 2 Player with status ${response.status}`
              );
              error.status = response.status; // Add status property
              console.error(
                `Request failed when requesting Team 2 Player with status ${response.status}`
              );
              throw error;
            } else {
              const data = await response.text();
              return data;
            }
          });
          try {
            const responses = await Promise.all(fetchTeam2PlayerPromises);
            responses.map((xml) => {
              parseString(xml, (err, result) => {
                if (err) {
                  console.error("Error parsing XML:", err);
                  throw new Error(
                    `Error parsing team 2 players for football XML: ${err}`
                  );
                }
                const players =
                  result.fantasy_content.league[0].players[0].player.map(
                    (player) => {
                      return {
                        playerKey: player.player_key[0],
                        playerPoints: Number(player.player_points[0].total[0]),
                      };
                    }
                  );
                team2PlayerPoints.push(players);
              });
            });
          } catch (error) {
            console.error(
              "Error when parsing team 2 players for football XML:",
              error
            );
            return NextResponse.json(
              {
                error: {
                  message: `Error when parsing team 2 players for football XML: ${error.message}`,
                },
                status: error.status,
              },
              { status: error.status }
            );
          } finally {
          }
          rosters[0].forEach((player) => {
            team1PlayerPoints.forEach((teamMember) => {
              if (player.playerKey === teamMember[0].playerKey) {
                player.playerPoints = teamMember[0].playerPoints;
              }
            });
          });
          rosters[1].forEach((player) => {
            team2PlayerPoints.forEach((teamMember) => {
              if (player.playerKey === teamMember[0].playerKey) {
                player.playerPoints = teamMember[0].playerPoints;
              }
            });
          });
          return NextResponse.json(rosters, { status: 200 });
        }
      } else {
        rosters = {
          team1Roster: [],
          team2Roster: [],
        };
        const fetchPromises = teamKeys.map(
          async (teamKey) =>
            await Promise.all(
              weekDays.map(async (weekDay) => {
                const response = await fetch(
                  `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster;date=${weekDay}`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );
                if (!response.ok) {
                  let error = new Error(
                    `Request failed when requesting Team 1 Player with status ${response.status}`
                  );
                  error.status = response.status; // Add status property
                  console.error(
                    `Request failed when requesting Team 1 Player with status ${response.status}`
                  );
                  throw error;
                } else {
                  const data = await response.text();
                  return data;
                }
              })
            )
        );
        try {
          const responses = await Promise.all(fetchPromises);

          responses[0].map((xml) => {
            parseString(xml, (err, result) => {
              if (err) {
                console.error("Error parsing XML:", err);
                throw new Error(
                  `Error parsing daily rosters for team 1 XML: ${err}`
                );
              }
              const players =
                result.fantasy_content.team[0].roster[0].players[0].player.map(
                  (player) => {
                    return {
                      date: player.selected_position[0].date[0],
                      playerKey: player.player_key[0],
                      playerName: player.name[0].full[0],
                      playerTeamName: player.editorial_team_full_name[0],
                      playerTeamAbbreviation: player.editorial_team_abbr[0],
                      playerImage: player.image_url[0],
                      playerPosition: player.selected_position[0].position[0],
                      playerIsFlex:
                        player.selected_position[0].is_flex[0] === 1
                          ? true
                          : false,
                      playerStatus: player.status
                        ? player.status[0]
                        : "Available",
                      playerId: player.player_id[0],
                      playerByeWeeks: player.bye_weeks
                        ? player.bye_weeks[0].week[0]
                        : null,
                    };
                  }
                );

              rosters.team1Roster.push(players);
            });
          });
          responses[1].map((xml) => {
            parseString(xml, (err, result) => {
              if (err) {
                console.error("Error parsing XML:", err);
                throw new Error(
                  `Error parsing daily rosters for team 2 XML: ${err}`
                );
              }
              const players =
                result.fantasy_content.team[0].roster[0].players[0].player.map(
                  (player) => {
                    return {
                      date: player.selected_position[0].date[0],
                      playerKey: player.player_key[0],
                      playerName: player.name[0].full[0],
                      playerTeamName: player.editorial_team_full_name[0],
                      playerTeamAbbreviation: player.editorial_team_abbr[0],
                      playerImage: player.image_url[0],
                      playerPosition: player.selected_position[0].position[0],
                      playerIsFlex:
                        player.selected_position[0].is_flex[0] === 1
                          ? true
                          : false,
                      playerStatus: player.status
                        ? player.status[0]
                        : "Available",
                      playerId: player.player_id[0],
                      playerByeWeeks: player.bye_weeks
                        ? player.bye_weeks[0].week[0]
                        : null,
                    };
                  }
                );

              rosters.team2Roster.push(players);
            });
          });
        } catch (error) {
          console.error("Error when parsing daily rosters XML:", error);
          return NextResponse.json(
            {
              error: {
                message: `Error when parsing daily rosters XML: ${error.message}`,
              },
              status: error.status,
            },
            { status: error.status }
          );
        } finally {
          const fetchTeam1PlayerPromises = rosters.team1Roster.map(
            async (day) =>
              await Promise.all(
                day.map(async (player) => {
                  const response = await fetch(
                    `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;player_keys=${player.playerKey}/stats;type=date;date=${player.date}`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    }
                  );
                  if (!response.ok) {
                    let error = new Error(
                      `Request failed when requesting team 1 player info for each day with status ${response.status}`
                    );
                    error.status = response.status; // Add status property
                    console.error(
                      `Request failed when requesting team 1 player info for each day with status ${response.status}`
                    );
                    throw error;
                  } else {
                    const data = await response.text();
                    return data;
                  }
                })
              )
          );
          try {
            const responses = await Promise.all(fetchTeam1PlayerPromises);

            responses.forEach((day) =>
              day.forEach((xml) => {
                parseString(xml, (err, result) => {
                  if (err) {
                    console.error("Error parsing XML:", err);
                    throw new Error(
                      `Error parsing team 1 player info for each day XML: ${err}`
                    );
                  }
                  const players =
                    result.fantasy_content.league[0].players[0].player.map(
                      (player) => {
                        return {
                          playerKey: player.player_key[0],
                          playerPoints: Number(
                            player.player_points[0].total[0]
                          ),
                          date: player.player_points[0].date[0],
                        };
                      }
                    );
                  team1PlayerPoints.push(players[0]);
                });
              })
            );
          } catch (error) {
            console.error(
              "Error when parsing team 1 player info for each day XML:",
              error
            );
            return NextResponse.json(
              {
                error: {
                  message: `Error when parsing team 1 player info for each day XML: ${error.message}`,
                },
                status: error.status,
              },
              { status: error.status }
            );
          } finally {
          }
          const fetchTeam2PlayerPromises = rosters.team2Roster.map(
            async (day) =>
              await Promise.all(
                day.map(async (player) => {
                  const response = await fetch(
                    `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;player_keys=${player.playerKey}/stats;type=date;date=${player.date}`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    }
                  );
                  if (!response.ok) {
                    let error = new Error(
                      `Request failed when requesting team 2 player info for each day with status ${response.status}`
                    );
                    error.status = response.status; // Add status property
                    console.error(
                      `Request failed when requesting team 2 player info for each day with status ${response.status}`
                    );
                    throw error;
                  } else {
                    const data = await response.text();
                    return data;
                  }
                })
              )
          );
          try {
            const responses = await Promise.all(fetchTeam2PlayerPromises);

            responses.forEach((day) =>
              day.forEach((xml) => {
                parseString(xml, (err, result) => {
                  if (err) {
                    console.error("Error parsing XML:", err);
                    throw new Error(
                      `Error parsing team 2 player info for each day XML: ${err}`
                    );
                  }
                  const players =
                    result.fantasy_content.league[0].players[0].player.map(
                      (player) => {
                        return {
                          playerKey: player.player_key[0],
                          playerPoints: Number(
                            player.player_points[0].total[0]
                          ),
                          date: player.player_points[0].date[0],
                        };
                      }
                    );
                  team2PlayerPoints.push(players[0]);
                });
              })
            );
          } catch (error) {
            console.error(
              "Error when parsing team 2 player info for each day XML:",
              error
            );
            return NextResponse.json(
              {
                error: {
                  message: `Error when parsing team 2 player info for each day XML: ${error.message}`,
                },
                status: error.status,
              },
              { status: error.status }
            );
          } finally {
          }

          rosters.team1Roster.forEach((day) => {
            day.forEach((player) => {
              team1PlayerPoints.forEach((teamMember) => {
                if (
                  player.playerKey === teamMember.playerKey &&
                  player.date === teamMember.date
                ) {
                  player.playerPoints = teamMember.playerPoints;
                }
              });
            });
          });
          rosters.team2Roster.forEach((day) => {
            day.forEach((player) => {
              team2PlayerPoints.forEach((teamMember) => {
                if (
                  player.playerKey === teamMember.playerKey &&
                  player.date === teamMember.date
                ) {
                  player.playerPoints = teamMember.playerPoints;
                }
              });
            });
          });

          let allTeam1PlayerKeys = [];
          rosters.team1Roster.forEach((day) => {
            day.forEach((player) => {
              allTeam1PlayerKeys.push(player.playerKey);
            });
          });
          // Flatten the array of arrays into a single array
          const allTeam1PlayerKeysFlattened = allTeam1PlayerKeys.flat();

          // Create a Set to remove duplicates and convert it back to an array
          const uniqueTeam1PlayerKeys = [
            ...new Set(allTeam1PlayerKeysFlattened),
          ];

          let overallTeam1Rosters = [];
          uniqueTeam1PlayerKeys.forEach((playerKey) => {
            let overall = {
              date: "Week",
              playerKey: playerKey,
              playerName: "",
              playerTeamName: "",
              playerTeamAbbreviation: "",
              playerImage: "",
              playerPosition: "",
              playerIsFlex: "",
              playerStatus: "",
              playerId: "",
              playerByeWeeks: "",
              playerPoints: 0,
              playerActivePoints: 0,
              playerBenchPoints: 0,
            };
            rosters.team1Roster.forEach((day) => {
              day.forEach((rosterPlayer) => {
                if (rosterPlayer.playerKey === playerKey) {
                  overall.playerName = rosterPlayer.playerName;
                  overall.playerTeamName = rosterPlayer.playerTeamName;
                  overall.playerTeamAbbreviation =
                    rosterPlayer.playerTeamAbbreviation;
                  overall.playerImage = rosterPlayer.playerImage;
                  overall.playerPosition = rosterPlayer.playerPosition;
                  overall.playerIsFlex = rosterPlayer.playerIsFlex;
                  overall.playerStatus = rosterPlayer.playerStatus;
                  overall.playerId = rosterPlayer.playerId;
                  overall.playerByeWeeks = rosterPlayer.playerByeWeeks;
                  overall.playerPoints =
                    overall.playerPoints + rosterPlayer.playerPoints;
                  if (rosterPlayer.playerPosition != "BN") {
                    overall.playerActivePoints =
                      overall.playerActivePoints + rosterPlayer.playerPoints;
                  } else {
                    overall.playerBenchPoints =
                      overall.playerBenchPoints + rosterPlayer.playerPoints;
                  }
                }
              });
            });
            overallTeam1Rosters.push(overall);
          });

          let allTeam2PlayerKeys = [];
          rosters.team2Roster.forEach((day) => {
            day.forEach((player) => {
              allTeam2PlayerKeys.push(player.playerKey);
            });
          });
          // Flatten the array of arrays into a single array
          const allTeam2PlayerKeysFlattened = allTeam2PlayerKeys.flat();

          // Create a Set to remove duplicates and convert it back to an array
          const uniqueTeam2PlayerKeys = [
            ...new Set(allTeam2PlayerKeysFlattened),
          ];

          let overallTeam2Rosters = [];
          uniqueTeam2PlayerKeys.forEach((playerKey) => {
            let overall = {
              date: "Week",
              playerKey: playerKey,
              playerName: "",
              playerTeamName: "",
              playerTeamAbbreviation: "",
              playerImage: "",
              playerPosition: "",
              playerIsFlex: "",
              playerStatus: "",
              playerId: "",
              playerByeWeeks: "",
              playerPoints: 0,
              playerActivePoints: 0,
              playerBenchPoints: 0,
            };
            rosters.team2Roster.forEach((day) => {
              day.forEach((rosterPlayer) => {
                if (rosterPlayer.playerKey === playerKey) {
                  overall.playerName = rosterPlayer.playerName;
                  overall.playerTeamName = rosterPlayer.playerTeamName;
                  overall.playerTeamAbbreviation =
                    rosterPlayer.playerTeamAbbreviation;
                  overall.playerImage = rosterPlayer.playerImage;
                  overall.playerPosition = rosterPlayer.playerPosition;
                  overall.playerIsFlex = rosterPlayer.playerIsFlex;
                  overall.playerStatus = rosterPlayer.playerStatus;
                  overall.playerId = rosterPlayer.playerId;
                  overall.playerByeWeeks = rosterPlayer.playerByeWeeks;
                  overall.playerPoints =
                    overall.playerPoints + rosterPlayer.playerPoints;
                  if (rosterPlayer.playerPosition != "BN") {
                    overall.playerActivePoints =
                      overall.playerActivePoints + rosterPlayer.playerPoints;
                  } else {
                    overall.playerBenchPoints =
                      overall.playerBenchPoints + rosterPlayer.playerPoints;
                  }
                }
              });
            });
            overallTeam2Rosters.push(overall);
          });
          rosters.team1Roster.push(overallTeam1Rosters);
          rosters.team2Roster.push(overallTeam2Rosters);
          return NextResponse.json(rosters, { status: 200 });
        }
      }
    })
    .catch((error) => {
      console.error("Request body parsing error:", error);
      return NextResponse.json(
        {
          error: { message: `Request body parsing error: ${error.message}` },
          status: error.status,
        },
        { status: error.status }
      );
    });
});

export async function POST(request, context) {
  return handler.run(request, context);
}
