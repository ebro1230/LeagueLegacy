import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import Image from "next/image";
import Roster from "./roster";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function RecordItem({
  record,
  logoStyle,
  leagueType,
  recordName,
}) {
  return (
    <Accordion>
      <h5>{recordName}</h5>
      {record.map((record) => {
        return (
          <Accordion.Item eventKey={`${record.season}${record.week}`}>
            <Accordion.Header>
              <Container fluid>
                <Row>
                  <Col
                    xs={1}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <div className="team-column-div">
                      <p>{`Season: ${record.season}`}</p>
                      <p>{`Week: ${record.week}`}</p>
                    </div>
                  </Col>

                  <Col
                    xs={1}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Image
                      src={record.logo}
                      width={50}
                      height={50}
                      style={logoStyle}
                      alt={`${record.name}'s Logo`}
                    />
                  </Col>
                  <Col xs={3}>
                    <div className="team-column-div">
                      <p>{record.name}</p>
                      <p>{record.managerName}</p>
                    </div>
                  </Col>

                  <Col
                    xs={2}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <div className="team-column-div">
                      <h5>
                        {record.pointsFor} - {record.pointsAgainst}
                      </h5>
                      <h6>
                        {record.projectedPointsFor} -{" "}
                        {record.projectedPointsAgainst}
                      </h6>
                    </div>
                  </Col>

                  <Col
                    xs={1}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Image
                      src={record.opponentLogo}
                      width={50}
                      height={50}
                      style={logoStyle}
                      alt={`${record.opponentName}'s Logo`}
                    />
                  </Col>
                  <Col xs={3}>
                    <div className="team-column-div">
                      <p>{record.opponentName}</p>
                      <p>{record.opponentManagerName}</p>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Accordion.Header>
            <Roster
              week={record}
              seasonKey={record.seasonKey}
              logoStyle={logoStyle}
              leagueType={leagueType}
            />
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
