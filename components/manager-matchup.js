import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "next/image";

export default function ManagerMatchup({ summary, logoStyle }) {
  //console.log("SUMMARY");
  //console.log(summary);
  return summary.wins || summary.losses ? (
    <Container fluid>
      <Row>
        <Col className="d-flex flex-column justify-content-center align-items-center">
          <Image
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
        ;
      </Row>
    </Container>
  ) : null;
}
