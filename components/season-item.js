import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import Image from "next/image";
import Roster from "./roster";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

export default function SeasonItem({
  season,
  logoStyle,
  onCompareManager,
  chosenTeam2,
  leagueType,
  accessToken,
}) {
  season.matchups.forEach((week) => {
    console.log(week);
  });
  return (
    <Accordion>
      {season.matchups.map((week) => {
        return (
          <Accordion.Item key={week} eventKey={`${season.season}+${week.week}`}>
            <Accordion.Header>
              <Container fluid>
                <Row>
                  <Col md={12} lg={2} className="d-flex align-items-center">
                    <h5 className={koulen.className}>{`Week ${week.week}`}</h5>
                  </Col>
                  <Col sm={12} md={6} lg={5}>
                    <div className="team-column-div">
                      <p className={inter.className}>
                        <span
                          className={`${
                            week.pointsFor > week.pointsAgainst
                              ? "positive-differential"
                              : week.pointsFor < week.pointsAgainst
                              ? "negative-differential"
                              : ""
                          }`}
                        >
                          {week.pointsFor > week.pointsAgainst
                            ? "Winner"
                            : week.pointsFor < week.pointsAgainst
                            ? "Loser"
                            : "Tie"}
                        </span>{" "}
                        {week.name} - {week.pointsFor}
                      </p>
                    </div>
                  </Col>

                  <Col sm={12} md={6} lg={5}>
                    <div className="team-column-div">
                      <p className={inter.className}>
                        {" "}
                        <span
                          className={`${
                            week.pointsFor < week.pointsAgainst
                              ? "positive-differential"
                              : week.pointsFor > week.pointsAgainst
                              ? "negative-differential"
                              : ""
                          }`}
                        >
                          {week.pointsAgainst > week.pointsFor
                            ? "Winner"
                            : week.pointsFor > week.pointsAgainst
                            ? "Loser"
                            : "Tie"}
                        </span>{" "}
                        {week.opponentName} - {week.pointsAgainst}
                      </p>
                    </div>

                    {/* {chosenTeam2.managerId != week.opponentManagerId ? (
                      <div className="team-column-div">
                        <Button
                          id={week.opponentManagerId}
                          onClick={onCompareManager}
                          size="sm"
                        >
                          Compare Manager
                        </Button>
                      </div>
                    ) : null} */}
                  </Col>
                </Row>
              </Container>
            </Accordion.Header>
            <Roster
              week={week}
              seasonKey={season.seasonKey}
              logoStyle={logoStyle}
              leagueType={leagueType}
              accessToken={accessToken}
            />
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
