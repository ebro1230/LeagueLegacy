import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "next/image";
import { Card } from "react-bootstrap";
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

export default function ManagerMatchup({ summary, logoStyle }) {
  //console.log("SUMMARY");
  //console.log(summary);
  return summary.wins || summary.losses ? (
    <Container fluid>
      <Row>
        <Col className="d-flex flex-column justify-content-center align-items-center">
          <Card
            border="light"
            style={{ backgroundColor: "transparent" }}
            className="league-div"
            key={summary.name}
          >
            {summary.logo ? (
              <Card.Img
                variant="top"
                src={summary.logo}
                className="rounded-circle"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  margin: "auto",
                }}
                alt={`${summary.name}'s Logo`}
              />
            ) : (
              <Card.Img
                variant="top"
                src="N/A"
                className="rounded-circle"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  margin: "auto",
                  color: "white",
                  alignContent: "center",
                }}
                alt={`${summary.name}'s Logo`}
              />
            )}
            <Card.Body>
              <Row>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${koulen.className} card-info`}>
                    {summary.name}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${inter.className} card-titles`}>
                    Reg. Season Record
                  </p>{" "}
                  <p className={`${koulen.className} card-info`}>
                    {summary.wins} - {summary.losses} - {summary.ties}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${inter.className} card-titles`}>
                    Playoff Record
                  </p>
                  <p className={`${koulen.className} card-info`}>
                    {summary.playoffWins} - {summary.playoffLosses}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${inter.className} card-titles`}>
                    Consolation Playoff Record
                  </p>{" "}
                  <p className={`${koulen.className} card-info`}>
                    {summary.consolationWins} - {summary.consolationLosses}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${inter.className} card-titles`}>
                    Projected Points For
                  </p>{" "}
                  <p className={`${koulen.className} card-info`}>
                    {summary.projectedPointsFor.toFixed(2)}
                  </p>
                </Col>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${inter.className} card-titles`}>
                    Actual Points For
                  </p>{" "}
                  <p className={`${koulen.className} card-info`}>
                    {summary.pointsFor.toFixed(2)}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-flex flex-column justify-content-center align-items-center">
          <Card
            border="light"
            style={{ backgroundColor: "transparent" }}
            className="league-div"
            key={summary.opponentName}
          >
            {summary.opponentLogo ? (
              <Card.Img
                variant="top"
                src={summary.opponentLogo}
                className="rounded-circle"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  margin: "auto",
                }}
                alt={`${summary.opponentName}'s Logo`}
              />
            ) : (
              <Card.Img
                variant="top"
                src="N/A"
                className="rounded-circle"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  margin: "auto",
                  color: "white",
                  alignContent: "center",
                }}
                alt={`${summary.opponentName}'s Logo`}
              />
            )}
            <Card.Body>
              <Row>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${koulen.className} card-info`}>
                    {summary.opponentName}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${inter.className} card-titles`}>
                    Reg. Season Record
                  </p>{" "}
                  <p className={`${koulen.className} card-info`}>
                    {summary.losses} - {summary.wins} - {summary.ties}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${inter.className} card-titles`}>
                    Playoff Record
                  </p>
                  <p className={`${koulen.className} card-info`}>
                    {summary.playoffLosses} - {summary.playoffWins}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${inter.className} card-titles`}>
                    Consolation Playoff Record
                  </p>{" "}
                  <p className={`${koulen.className} card-info`}>
                    {summary.consolationLosses} - {summary.consolationWins}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${inter.className} card-titles`}>
                    Projected Points For
                  </p>{" "}
                  <p className={`${koulen.className} card-info`}>
                    {summary.projectedPointsAgainst.toFixed(2)}
                  </p>
                </Col>
                <Col style={{ textAlign: "center" }}>
                  <p className={`${inter.className} card-titles`}>
                    Actual Points For
                  </p>{" "}
                  <p className={`${koulen.className} card-info`}>
                    {summary.pointsAgainst.toFixed(2)}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* <Image
            src={summary.logo}
            width={100}
            height={100}
            style={logoStyle}
            alt={`${summary.name}'s Logo`}
          />
          <h1>{summary.managerName}</h1>
          <h3>{summary.name}</h3>
        </Col>
        <Col
          xs={6}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <h1>
            Regular Season Record: {summary.wins} - {summary.losses} -{" "}
            {summary.ties}
          </h1>
          <h3>
            Playoff Record: {summary.playoffWins} - {summary.playoffLosses}
          </h3>
          <h6>
            Consolation Playoff Record: {summary.consolationWins} -{" "}
            {summary.consolationLosses}
          </h6>
          <h1>
            Points: {summary.pointsFor.toFixed(2)} -{" "}
            {summary.pointsAgainst.toFixed(2)}
          </h1>
          <h3>
            Projected Points: {summary.projectedPointsFor.toFixed(2)} -{" "}
            {summary.projectedPointsAgainst.toFixed(2)}
          </h3>
        </Col>
        <Col className="d-flex flex-column justify-content-center align-items-center">
          <Image
            src={summary.opponentLogo}
            width={100}
            height={100}
            style={logoStyle}
            alt={`${summary.opponentName}'s Logo`}
          />
          <h1>{summary.opponentManagerName}</h1>
          <h3>{summary.opponentName}</h3>
        </Col>
        ; */}
      </Row>
    </Container>
  ) : null;
}
