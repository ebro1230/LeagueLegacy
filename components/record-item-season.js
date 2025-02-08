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
    <>
      {record.map((record) => {
        return (
          <Accordion key={`${record} + Accordion`}>
            <Accordion.Item key={record}>
              <Row>
                <Col className="d-flex justify-content-center">
                  <h5
                    className={koulen.className}
                    style={{ fontSize: "24px", color: "white" }}
                  >
                    {recordName}
                  </h5>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Image
                    src={record.logo}
                    width={80}
                    height={80}
                    style={{
                      borderRadius: "50%",
                      border: "1px solid #fff",
                      objectFit: "contain",
                    }}
                    alt={`${record.name}'s Logo`}
                  />
                </Col>
                <Col>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <p
                        className={koulen.className}
                        style={{
                          fontSize: "18px",
                          color: "white",
                          marginBottom: "0rem",
                        }}
                      >
                        {record.name}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <p
                        className={inter.className}
                        style={{
                          fontSize: "14px",
                          color: "#83A6CF",
                          marginBottom: "0rem",
                        }}
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
                    <Col className="d-flex justify-content-center">
                      <p
                        className={inter.className}
                        style={{
                          fontSize: "12px",
                          color: "#83A6CF",
                          marginBottom: "0rem",
                        }}
                      >
                        Season
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <p
                        className={koulen.className}
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
                {/* <div className="team-column-div">
                    
                  </div>
                </Col>
 */}

                <Col>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      {recordName === "Most Points In A Season" ||
                      recordName === "Least Points In A Season" ||
                      recordName === "Most Points Against In A Season" ||
                      recordName === "Least Points Against In A Season" ? (
                        <p
                          className={inter.className}
                          style={{
                            fontSize: "12px",
                            color: "#83A6CF",
                            marginBottom: "0rem",
                          }}
                        >
                          Points
                        </p>
                      ) : recordName === "Most Wins In A Season" ||
                        recordName === "Longest Winning Streak" ? (
                        <p
                          className={inter.className}
                          style={{
                            fontSize: "12px",
                            color: "#83A6CF",
                            marginBottom: "0rem",
                          }}
                        >
                          Wins
                        </p>
                      ) : recordName === "Most Losses In A Season" ||
                        recordName === "Longest Losing Streak" ? (
                        <p
                          className={inter.className}
                          style={{
                            fontSize: "12px",
                            color: "#83A6CF",
                            marginBottom: "0rem",
                          }}
                        >
                          Losses
                        </p>
                      ) : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      {recordName === "Most Points In A Season" ||
                      recordName === "Least Points In A Season" ? (
                        <p
                          className={koulen.className}
                          style={{
                            fontSize: "18px",
                            color: "white",
                            marginBottom: "0rem",
                          }}
                        >
                          {record.pointsFor}
                        </p>
                      ) : recordName === "Most Points Against In A Season" ||
                        recordName === "Least Points Against In A Season" ? (
                        <p
                          className={koulen.className}
                          style={{
                            fontSize: "18px",
                            color: "white",
                            marginBottom: "0rem",
                          }}
                        >
                          {record.pointsAgainst}
                        </p>
                      ) : recordName === "Most Wins In A Season" ? (
                        <p
                          className={koulen.className}
                          style={{
                            fontSize: "18px",
                            color: "white",
                            marginBottom: "0rem",
                          }}
                        >
                          {record.wins}
                        </p>
                      ) : recordName === "Most Losses In A Season" ? (
                        <p
                          className={koulen.className}
                          style={{
                            fontSize: "18px",
                            color: "white",
                            marginBottom: "0rem",
                          }}
                        >
                          {record.losses}
                        </p>
                      ) : recordName === "Longest Winning Streak" ||
                        recordName === "Longest Losing Streak" ? (
                        <p
                          className={koulen.className}
                          style={{
                            fontSize: "18px",
                            color: "white",
                            marginBottom: "0rem",
                          }}
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
            </Accordion.Item>
          </Accordion>
        );
      })}
    </>
  );
}
