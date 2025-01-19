//import MealItem from "./meal-item";

import Link from "next/link";
import Image from "next/image";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function LeaguesGrid({ leagues, leagueType }) {
  const date = new Date();
  const currentYear = date.getFullYear();
  const logoStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
    margin: "1.5rem",
    objectFit: "contain",
  };

  return (
    <>
      <Container fluid>
        <Row>
          {leagues.map((league) => (
            <Col md="12" lg="6" xl="4" key={`${league.leagueKeys} + Col`}>
              <Link
                key={`${league.leagueKeys} + 1`}
                href={`/sport/${leagueType}/league/${league.leagueKeys}`}
              >
                <Card
                  border="light"
                  style={{ backgroundColor: "transparent" }}
                  className="league-div"
                  key={league.leagueKeys}
                >
                  {league.leagueLogo ? (
                    <Card.Img
                      variant="top"
                      src={league.leagueLogo}
                      className="rounded-circle"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        margin: "auto",
                      }}
                      alt={`${league.leagueName}'s Logo`}
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
                      }}
                      alt={`${league.leagueName}'s Logo`}
                    />
                  )}
                  <Card.Body>
                    <p>League: {league.leagueName}</p>
                    <p>Team Name: {league.teamName}</p>
                    <p>
                      {league.memberSince} -{" "}
                      {league.memberUntil === currentYear
                        ? "Present"
                        : league.memberUntil}
                    </p>
                    <p>
                      {league.wins} - {league.losses} - {league.ties}
                    </p>
                    <p>Win Percentage: {league.winPercentage}%</p>
                    <p>Top Finish: {league.bestFinish}</p>
                    <p>Bottom Finish: {league.worstFinish}</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
