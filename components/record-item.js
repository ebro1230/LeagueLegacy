import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import Image from "next/image";
import RecordRoster from "./record-roster";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function RecordItem({
  record,
  logoStyle,
  leagueType,
  recordName,
  accessToken,
  onIsOpen,
}) {
  return (
    <Accordion style={{ width: "100%", marginBottom: "2rem" }}>
      {record.map((record) => {
        return (
          <Accordion.Item
            key={record}
            eventKey={`${record.season}${record.week}`}
          >
            <Accordion.Header>
              <Container fluid>
                <Row>
                  <Col>
                    <h5
                      className={koulen.className}
                      style={{ fontSize: "24px", color: "white" }}
                    >
                      {recordName}
                    </h5>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Row>
                      <Col>
                        <Image
                          src={record.logo}
                          width={50}
                          height={50}
                          style={logoStyle}
                          alt={`${record.name}'s Logo`}
                        />
                      </Col>
                      <Col></Col>
                      <Col>
                        <Image
                          src={record.opponentLogo}
                          width={50}
                          height={50}
                          style={logoStyle}
                          alt={`${record.opponentName}'s Logo`}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Row>
                          <Col>
                            <p
                              className={`${koulen.className}`}
                              style={{ fontSize: "18px", color: "white" }}
                            >
                              {record.name}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p
                              className={`${inter.className}`}
                              style={{ fontSize: "14px", color: "#83A6CF" }}
                            >
                              {record.managerName}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <p
                          className={`${koulen.className}`}
                          style={{ fontSize: "24px", color: "white" }}
                        >
                          VS
                        </p>
                      </Col>
                      <Col>
                        <Row>
                          <Col>
                            <p
                              className={`${koulen.className}`}
                              style={{ fontSize: "18px", color: "white" }}
                            >
                              {record.opponentName}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p
                              className={`${inter.className}`}
                              style={{ fontSize: "14px", color: "#83A6CF" }}
                            >
                              {record.opponentManagerName}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Row>
                          <Col>
                            <p
                              className={`${inter.className} positive-differential`}
                              style={{ fontSize: "14px", color: "#83A6CF" }}
                            >
                              Act. {record.pointsFor}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p
                              className={`${inter.className}`}
                              style={{ fontSize: "14px", color: "#83A6CF" }}
                            >
                              Proj. {record.projectedPointsFor}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      <Col></Col>
                      <Col>
                        <Row>
                          <Col>
                            <p
                              className={`${inter.className} positive-differential`}
                              style={{ fontSize: "14px", color: "#83A6CF" }}
                            >
                              Act. {record.pointsAgainst}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p
                              className={`${inter.className}`}
                              style={{ fontSize: "14px", color: "#83A6CF" }}
                            >
                              Proj. {record.projectedPointsAgainst}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Row>
                      <Col>
                        <p
                          className={`${inter.className}`}
                          style={{ fontSize: "12px", color: "#83A6CF" }}
                        >
                          SEASON
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p
                          className={`${koulen.className}`}
                          style={{ fontSize: "18px", color: "white" }}
                        >
                          {record.season}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Row>
                      <Col>
                        <p
                          className={`${inter.className}`}
                          style={{ fontSize: "12px", color: "#83A6CF" }}
                        >
                          WEEK
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p
                          className={`${koulen.className}`}
                          style={{ fontSize: "18px", color: "white" }}
                        >
                          {record.week}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* <Row>
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
                </Row> */}
              </Container>
            </Accordion.Header>
            <RecordRoster
              week={record}
              seasonKey={record.seasonKey}
              logoStyle={logoStyle}
              leagueType={leagueType}
              accessToken={accessToken}
              onIsOpen={onIsOpen}
            />
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
