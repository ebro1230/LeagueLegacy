import { useState } from "react";

import { useRouter } from "next/navigation";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import Image from "next/image";
import WeekDayDropdown from "./weekday-dropdown";
import unknownPlayer from "@/assets/Unknown-Player.jpg";
import { Inter } from "@next/font/google";
import { Koulen } from "@next/font/google";
const inter = Inter({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});
const koulen = Koulen({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});
import LoadingIndicator from "./loading-indicator";
import { Row, Col } from "react-bootstrap";

export default function RecordRoster({
  week,
  seasonKey,
  logoStyle,
  leagueType,
  accessToken,
  onIsOpen,
}) {
  const [loading, setLoading] = useState(true);
  const [rosters, setRosters] = useState([]);
  const [team1Roster, setTeam1Roster] = useState([]);
  const [team2Roster, setTeam2Roster] = useState([]);
  const [weekDays, setWeekDays] = useState(["Week"]);
  const [chosenDate, setChosenDate] = useState("Week");
  const router = useRouter();
  const formatDate = (date) => {
    let d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const getRoster = async (week) => {
    if (!rosters.length) {
      let weekDay = [];
      let currentDate = new Date(`${week.weekStart}T00:00:00Z`);
      let lastDate = new Date(`${week.weekEnd}T00:00:00Z`);
      while (currentDate <= lastDate) {
        weekDay.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1); // Move to next day
      }
      setWeekDays(weekDay);
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/yahooAuth/weekly-lineups`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: accessToken,
            teamKeys: [week.key, week.opponentKey],
            weekDays: weekDay,
            week: week.week,
            leagueKey: seasonKey,
            leagueType: leagueType,
          }),
        }
      )
        .then(async (response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              const error = new Error(
                errorData.message || "Failed to fetch data"
              );
              error.status = errorData.status;
              throw error;
            });
          }
          return response.json();
        })
        .then((data) => {
          const fetchResponse = data;
          setRosters(fetchResponse);
          if (leagueType != "football") {
            setTeam1Roster(
              fetchResponse.team1Roster[fetchResponse.team1Roster.length - 1]
            );
            setTeam2Roster(
              fetchResponse.team2Roster[fetchResponse.team2Roster.length - 1]
            );
          }
          setLoading(false);
        })
        .catch((error) => {
          router.push(
            `/error?message=${encodeURIComponent(
              error.message
            )}&status=${encodeURIComponent(error.status)}`
          );
        });
    }
  };

  const handleDateChange = (e) => {
    setChosenDate(e);
    let currentTeam1Roster = [];
    let currentTeam2Roster = [];
    rosters.team1Roster.forEach((day) => {
      day.forEach((player) => {
        if (player.date === e) {
          currentTeam1Roster.push(player);
        }
      });
    });
    setTeam1Roster(currentTeam1Roster);
    rosters.team2Roster.forEach((day) => {
      day.forEach((player) => {
        if (player.date === e) {
          currentTeam2Roster.push(player);
        }
      });
    });
    setTeam2Roster(currentTeam2Roster);
  };

  return (
    <Accordion.Body
      className={!loading ? "roster-body" : null}
      onEntering={() => {
        getRoster(week);
        onIsOpen(week);
      }}
      //onEntered={() => onIsOpen(week)}
      onExiting={() => onIsOpen(week)}
    >
      {loading ? (
        <div className="roster-loading-div">
          <LoadingIndicator />
        </div>
      ) : leagueType === "football" ? (
        <div>
          {rosters.length ? (
            <>
              <Row>
                <Col xs={6}>
                  <Table
                    key={rosters[0]}
                    striped
                    bordered
                    className="player-table"
                  >
                    <thead className={`${koulen.className} player-table-head`}>
                      <tr>
                        <th>POS.</th>
                        <th>Player</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody className="player-table-body">
                      {rosters[0].map((player) => {
                        return (
                          <tr key={player}>
                            <td>{player.playerPosition}</td>
                            <td>
                              <Image
                                src={player.playerImage}
                                width={25}
                                height={25}
                                style={logoStyle}
                                alt={unknownPlayer}
                              />{" "}
                              {player.playerName}
                            </td>
                            <td>{player.playerPoints}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
                <Col xs={6}>
                  <Table
                    key={rosters[1]}
                    striped
                    bordered
                    className="player-table"
                  >
                    <thead className={`${koulen.className} player-table-head`}>
                      <tr>
                        <th>POS.</th>
                        <th>Player</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody className="player-table-body">
                      {rosters[1].map((player) => {
                        return (
                          <tr key={player}>
                            <td>{player.playerPosition}</td>
                            <td>
                              <Image
                                src={player.playerImage}
                                width={25}
                                height={25}
                                style={logoStyle}
                                alt={unknownPlayer}
                              />{" "}
                              {player.playerName}
                            </td>
                            <td>{player.playerPoints}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </>
          ) : (
            <p>Weekly Lineup Unavailable</p>
          )}
        </div>
      ) : (
        <>
          <Row>
            <Col>
              <div className="weekday-dropdown-div">
                <WeekDayDropdown
                  weekDays={weekDays}
                  onDateChange={handleDateChange}
                  chosenDate={chosenDate}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              {team1Roster.length ? (
                <Table
                  key={team1Roster}
                  striped
                  bordered
                  className="player-table"
                >
                  <thead className={`${koulen.className} player-table-head`}>
                    <tr>
                      <th>POS.</th>
                      <th>Player</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody className="player-table-body">
                    {team1Roster.map((player) => {
                      return (
                        <tr key={player}>
                          <td>{player.playerPosition}</td>
                          <td>
                            <Image
                              src={player.playerImage}
                              width={25}
                              height={25}
                              style={logoStyle}
                              alt={unknownPlayer}
                            />{" "}
                            {player.playerName}
                          </td>
                          {chosenDate === "Week" ? (
                            <td>
                              {player.playerActivePoints
                                ? player.playerActivePoints.toFixed(2)
                                : 0}{" "}
                              (
                              {player.playerBenchPoints
                                ? player.playerBenchPoints.toFixed(2)
                                : 0}
                              )
                            </td>
                          ) : (
                            <td>
                              {player.playerPoints
                                ? player.playerPoints.toFixed(2)
                                : 0}{" "}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <p>No Data Available</p>
              )}
            </Col>
            <Col xs={6}>
              {team2Roster.length ? (
                <Table
                  key={team2Roster}
                  striped
                  bordered
                  className="player-table"
                >
                  <thead className={`${koulen.className} player-table-head`}>
                    <tr>
                      <th>POS.</th>
                      <th>Player</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody className="player-table-body">
                    {team2Roster.map((player) => {
                      return (
                        <tr key={player}>
                          <td>{player.playerPosition}</td>
                          <td>
                            <Image
                              src={player.playerImage}
                              width={25}
                              height={25}
                              style={logoStyle}
                              alt={unknownPlayer}
                            />{" "}
                            {player.playerName}
                          </td>
                          {chosenDate === "Week" ? (
                            <td>
                              {player.playerActivePoints
                                ? player.playerActivePoints.toFixed(2)
                                : 0}{" "}
                              (
                              {player.playerBenchPoints
                                ? player.playerBenchPoints.toFixed(2)
                                : 0}
                              )
                            </td>
                          ) : (
                            <td>
                              {player.playerPoints
                                ? player.playerPoints.toFixed(2)
                                : 0}{" "}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <p>No Data Available</p>
              )}
            </Col>
          </Row>
        </>
      )}
    </Accordion.Body>
  );
}
