import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";
import Image from "next/image";
import Roster from "./roster";
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

export default function RecordItemSeason({ record, logoStyle, recordName }) {
  return (
    <Container fluid>
      <Row>
        {record.map((record) => {
          return (
            <Col xs="12" md="6" xl="4">
              key={`${record} + Col`}
              style={{ marginBottom: "2rem" }}
              <Accordion>
                <Accordion.Item key={record}>
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
                        <Image
                          src={record.logo}
                          width={80}
                          height={80}
                          style={logoStyle}
                          alt={`${record.name}'s Logo`}
                        />
                      </Col>
                      <Col>
                        <Row className="team-column-div">
                          <Col>
                            <p
                              className={koulen.className}
                              style={{ fontSize: "18px", color: "white" }}
                            >
                              {record.name}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p
                              className={inter.className}
                              style={{ fontSize: "14px", color: "#83A6CF" }}
                            >
                              {record.managerName}
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
                              className={inter.className}
                              style={{ fontSize: "12px", color: "#83A6CF" }}
                            >
                              Season
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p
                              className={koulen.className}
                              style={{ fontSize: "18px", color: "white" }}
                            >
                              {record.season}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      {/* <div className="team-column-div">
                    
                  </div>
                </Col>
 */}

                      <Col>
                        <Row>
                          <Col>
                            {recordName === "Most Points In A Season" ||
                            recordName === "Least Points In A Season" ||
                            recordName === "Most Points Against In A Season" ||
                            recordName ===
                              "Least Points Against In A Season" ? (
                              <p
                                className={inter.className}
                                style={{ fontSize: "12px", color: "#83A6CF" }}
                              >
                                Points
                              </p>
                            ) : recordName === "Most Wins In A Season" ||
                              recordName === "Longest Winning Streak" ? (
                              <p
                                className={inter.className}
                                style={{ fontSize: "12px", color: "#83A6CF" }}
                              >
                                Wins
                              </p>
                            ) : recordName === "Most Losses In A Season" ||
                              recordName === "Longest Losing Streak" ? (
                              <p
                                className={inter.className}
                                style={{ fontSize: "12px", color: "#83A6CF" }}
                              >
                                Losses
                              </p>
                            ) : null}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {recordName === "Most Points In A Season" ||
                            recordName === "Least Points In A Season" ? (
                              <p
                                className={koulen.className}
                                style={{ fontSize: "18px", color: "white" }}
                              >
                                {record.pointsFor}
                              </p>
                            ) : recordName ===
                                "Most Points Against In A Season" ||
                              recordName ===
                                "Least Points Against In A Season" ? (
                              <p
                                className={koulen.className}
                                style={{ fontSize: "18px", color: "white" }}
                              >
                                {record.pointsAgainst}
                              </p>
                            ) : recordName === "Most Wins In A Season" ? (
                              <p
                                className={koulen.className}
                                style={{ fontSize: "18px", color: "white" }}
                              >
                                {record.wins}
                              </p>
                            ) : recordName === "Most Losses In A Season" ? (
                              <p
                                className={koulen.className}
                                style={{ fontSize: "18px", color: "white" }}
                              >
                                {record.losses}
                              </p>
                            ) : recordName === "Longest Winning Streak" ||
                              recordName === "Longest Losing Streak" ? (
                              <p
                                className={koulen.className}
                                style={{ fontSize: "18px", color: "white" }}
                              >
                                {record.streak}
                              </p>
                            ) : null}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    {/* <Col xs={3}></Col>

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
                    ) : null} */}
                    {/* </div>
                </Col>
              </Row> */}
                  </Container>
                </Accordion.Item>
              </Accordion>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
