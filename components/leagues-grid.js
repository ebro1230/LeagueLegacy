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
            <Col sm="12" lg="6" xl="4" key={`${league.leagueKeys} + Col`}>
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
                        color: "white",
                      }}
                      alt={`${league.leagueName}'s Logo`}
                    />
                  )}
                  <Card.Body>
                    <Row>
                      <p>League</p>
                      <p> {league.leagueName}</p>
                    </Row>
                    <Row>
                      <Col>
                        <p>Team Name</p> <p>{league.teamName}</p>
                      </Col>
                      <Col>
                        <p>Member Years</p>
                        <p>
                          {league.memberSince} -{" "}
                          {league.memberUntil === currentYear
                            ? "Present"
                            : league.memberUntil}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>Record</p>
                        <p>
                          {league.wins} - {league.losses} - {league.ties}
                        </p>
                      </Col>
                      <Col>
                        <p>Win % </p>
                        <p>{league.winPercentage}%</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>Top Finish</p>{" "}
                        <p>
                          {league.bestFinish}
                          {league.bestFinish == 1
                            ? "st Place"
                            : league.bestFinish == 2
                            ? "nd Place"
                            : league.bestFinish == 3
                            ? "rd Place"
                            : league.bestFinish === "TBD"
                            ? null
                            : "th Place"}{" "}
                        </p>
                      </Col>
                      <Col>
                        <p>Bottom Finish</p>
                        <p>
                          {league.worstFinish}
                          {league.worstFinish == 1
                            ? "st Place"
                            : league.worstFinish == 2
                            ? "nd Place"
                            : league.worstFinish == 3
                            ? "rd Place"
                            : league.worstFinish === "TBD"
                            ? null
                            : "th Place"}
                        </p>
                      </Col>
                    </Row>
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
