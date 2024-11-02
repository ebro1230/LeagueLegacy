import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import Image from "next/image";
import Roster from "./roster";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
                    <h5>{`Week: ${week.week}`}</h5>
                  </Col>

                  <Col
                    xs={1}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Image
                      src={week.logo}
                      width={50}
                      height={50}
                      style={logoStyle}
                      alt={`${week.name}'s Logo`}
                    />
                  </Col>
                  <Col xs={3}>
                    <div className="team-column-div">
                      <p>{week.name}</p>
                      <p>{week.managerName}</p>
                    </div>
                  </Col>

                  <Col
                    xs={2}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <div className="team-column-div">
                      <h5>
                        {week.pointsFor} - {week.pointsAgainst}
                      </h5>
                      <h6>
                        {week.projectedPointsFor} -{" "}
                        {week.projectedPointsAgainst}
                      </h6>
                    </div>
                  </Col>

                  <Col
                    xs={1}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Image
                      src={week.opponentLogo}
                      width={50}
                      height={50}
                      style={logoStyle}
                      alt={`${week.opponentName}'s Logo`}
                    />
                  </Col>
                  <Col xs={4}>
                    <div className="team-column-div">
                      <p>{week.opponentName}</p>
                      <p>{week.opponentManagerName}</p>
                    </div>

                    {chosenTeam2.managerId != week.opponentManagerId ? (
                      <div className="team-column-div">
                        <Button
                          id={week.opponentManagerId}
                          onClick={onCompareManager}
                          size="sm"
                        >
                          Compare Manager
                        </Button>
                      </div>
                    ) : null}
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
