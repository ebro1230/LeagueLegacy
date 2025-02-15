import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import Image from "next/image";
import RecordRoster from "./record-roster";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Koulen } from "@next/font/google";
const koulen = Koulen({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

import { Inter } from "@next/font/google";
const inter = Inter({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

export default function RecordItem({
  record,
  logoStyle,
  leagueType,
  recordName,
  accessToken,
  onIsOpen,
}) {
  return (
    <Accordion
      style={{
        width: "100%",
        marginBottom: "2rem",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
      }}
    >
      {record.map((record) => {
        return (
          <Accordion.Item
            key={record}
            eventKey={`${record.season}${record.week}`}
          >
            <Accordion.Header>
              <Container fluid>
                <Row style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                  <Col className="d-flex justify-content-center">
                    <h5
                      className={koulen.className}
                      style={{
                        fontSize: "24px",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {recordName}
                    </h5>
                  </Col>
                </Row>
                <Row style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                  <Col>
                    <Row style={{ marginBottom: "0.5rem" }}>
                      <Col
                        xs={5}
                        sm={4}
                        className="d-flex justify-content-center"
                      >
                        <Image
                          src={record.logo}
                          width={50}
                          height={50}
                          style={{
                            borderRadius: "50%",
                            border: "1px solid #fff",
                            objectFit: "contain",
                          }}
                          alt={`${record.name}'s Logo`}
                        />
                      </Col>

                      <Col
                        xs={5}
                        sm={4}
                        className="d-flex justify-content-center"
                      >
                        <Image
                          src={record.opponentLogo}
                          width={50}
                          height={50}
                          style={{
                            borderRadius: "50%",
                            border: "1px solid #fff",
                            objectFit: "contain",
                          }}
                          alt={`${record.opponentName}'s Logo`}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Row>
                          <Col
                            xs={12}
                            sm={4}
                            className="d-flex justify-content-center"
                          >
                            <p
                              className={`${koulen.className}`}
                              style={{
                                fontSize: "18px",
                                color: "white",
                                marginBottom: "0rem",
                                textAlign: "center",
                              }}
                            >
                              {record.name}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            xs={12}
                            sm={4}
                            className="d-flex justify-content-center"
                          >
                            <p
                              className={`${inter.className}`}
                              style={{
                                fontSize: "14px",
                                color: "#83A6CF",
                                marginBottom: "0.5rem",
                                textAlign: "center",
                              }}
                            >
                              {record.managerName}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      <Col
                        xs={12}
                        sm={4}
                        className="d-flex justify-content-center"
                      >
                        <p
                          className={`${koulen.className}`}
                          style={{
                            fontSize: "24px",
                            color: "white",
                            marginBottom: "0.5rem",
                            textAlign: "center",
                          }}
                        >
                          VS
                        </p>
                      </Col>
                      <Col>
                        <Row>
                          <Col
                            xs={12}
                            sm={4}
                            className="d-flex justify-content-center"
                          >
                            <p
                              className={`${koulen.className}`}
                              style={{
                                fontSize: "18px",
                                color: "white",
                                marginBottom: "0rem",
                                textAlign: "center",
                              }}
                            >
                              {record.opponentName}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            xs={12}
                            sm={4}
                            className="d-flex justify-content-center"
                          >
                            <p
                              className={`${inter.className}`}
                              style={{
                                fontSize: "14px",
                                color: "#83A6CF",

                                textAlign: "center",
                                marginBottom: "0.5rem",
                              }}
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
                          <Col
                            xs={12}
                            sm={4}
                            className="d-flex justify-content-center"
                            style={{ width: "fit-content" }}
                          >
                            <p
                              className={`${inter.className}`}
                              style={{
                                fontSize: "14px",
                                color: "#83A6CF",
                                marginBottom: "0rem",
                                textAlign: "center",
                              }}
                            >
                              Act.{" "}
                              <span className="positive-differential">
                                {record.pointsFor}
                              </span>
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            xs={5}
                            sm={4}
                            className="d-flex justify-content-center"
                            style={{ width: "fit-content" }}
                          >
                            <p
                              className={`${inter.className}`}
                              style={{
                                fontSize: "14px",
                                color: "#83A6CF",
                                marginBottom: "0.5rem",
                                textAlign: "center",
                              }}
                            >
                              Proj. {record.projectedPointsFor}
                            </p>
                          </Col>
                        </Row>
                      </Col>

                      <Col>
                        <Row>
                          <Col
                            xs={5}
                            sm={4}
                            className="d-flex justify-content-center"
                            style={{ width: "fit-content" }}
                          >
                            <p
                              className={`${inter.className}`}
                              style={{
                                fontSize: "14px",
                                color: "#83A6CF",
                                marginBottom: "0rem",
                                textAlign: "center",
                              }}
                            >
                              Act.{" "}
                              <span className="positive-differential">
                                {record.pointsAgainst}
                              </span>
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            xs={12}
                            sm={4}
                            className="d-flex justify-content-center"
                            style={{ width: "fit-content" }}
                          >
                            <p
                              className={`${inter.className}`}
                              style={{
                                fontSize: "14px",
                                color: "#83A6CF",
                                marginBottom: "0.5rem",
                                textAlign: "center",
                              }}
                            >
                              Proj. {record.projectedPointsAgainst}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                  <Col>
                    <Row>
                      <Col
                        xs={6}
                        sm={4}
                        className="d-flex justify-content-center"
                      >
                        <p
                          className={`${inter.className}`}
                          style={{
                            fontSize: "12px",
                            color: "#83A6CF",
                            marginBottom: "0rem",
                          }}
                        >
                          SEASON
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        xs={6}
                        sm={4}
                        className="d-flex justify-content-center"
                      >
                        <p
                          className={`${koulen.className}`}
                          style={{
                            fontSize: "18px",
                            color: "white",
                            marginBottom: "0rem",
                          }}
                        >
                          {record.season}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={0} sm={4}></Col>
                  <Col>
                    <Row>
                      <Col
                        xs={6}
                        sm={4}
                        className="d-flex justify-content-center"
                      >
                        <p
                          className={`${inter.className}`}
                          style={{
                            fontSize: "12px",
                            color: "#83A6CF",
                            marginBottom: "0rem",
                          }}
                        >
                          WEEK
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-flex justify-content-center">
                        <p
                          className={`${koulen.className}`}
                          style={{
                            fontSize: "18px",
                            color: "white",
                            marginBottom: "0rem",
                          }}
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
