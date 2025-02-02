import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import Image from "next/image";
import Roster from "./roster";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
  return (
    <Accordion>
      {season.matchups.map((week) => {
        return (
          <Accordion.Item key={week} eventKey={`${season.season}+${week.week}`}>
            <Accordion.Header>
              <Container fluid>
                <Row>
                  <Col
                    xs={1}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <h5 className={koulen.className}>{`Week ${week.week}`}</h5>
                  </Col>

                  <Col
                    xs={1}
                    className="d-flex justify-content-center align-items-center"
                  ></Col>
                  <Col xs={3}>
                    <div className="team-column-div">
                      <p>
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
                            : "Loser"}
                        </span>
                        {week.name} - {week.pointsFor}
                      </p>
                    </div>
                  </Col>

                  <Col xs={4}>
                    <div className="team-column-div">
                      <p>
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
                            : "Loser"}
                        </span>
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
