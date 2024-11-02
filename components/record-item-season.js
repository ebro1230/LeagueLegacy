import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import Image from "next/image";
import Roster from "./roster";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function RecordItemSeason({ record, logoStyle, recordName }) {
  return (
    <Accordion>
      <h5>{recordName}</h5>
      {record.map((record) => {
        return (
          <Accordion.Item key={record}>
            <Container fluid>
              <Row>
                <Col
                  xs={1}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div className="team-column-div">
                    <p>{`Season: ${record.season}`}</p>
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
                    {recordName === "Most Points In A Season" ||
                    recordName === "Least Points In A Season" ? (
                      <h5>{record.pointsFor}</h5>
                    ) : recordName === "Most Points Against In A Season" ||
                      recordName === "Least Points Against In A Season" ? (
                      <h5>{record.pointsAgainst}</h5>
                    ) : recordName === "Most Wins In A Season" ? (
                      <h5>{record.wins}</h5>
                    ) : recordName === "Most Losses In A Season" ? (
                      <h5>{record.losses}</h5>
                    ) : recordName === "Longest Winning Streak" ||
                      recordName === "Longest Losing Streak" ? (
                      <h5>{record.streak}</h5>
                    ) : null}
                  </div>
                </Col>
              </Row>
            </Container>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
