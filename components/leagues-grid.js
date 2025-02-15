//import MealItem from "./meal-item";

import Link from "next/link";
import Image from "next/image";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
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

export default function LeaguesGrid({ leagues, leagueType, imageSource }) {
  const date = new Date();
  const currentYear = date.getFullYear();

  return (
    <>
      <Container fluid>
        <Row>
          {leagues.map((league) => (
            <Col
              xs="12"
              md="6"
              xl="4"
              key={`${league.leagueKeys} + Col`}
              style={{ marginBottom: "2rem" }}
            >
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
                      alt={imageSource.src}
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
                      alt={imageSource.src}
                    />
                  )}
                  <Card.Body>
                    <Row>
                      <Col style={{ textAlign: "center" }}>
                        <p className={`${inter.className} card-titles`}>
                          League
                        </p>
                        <p className={`${koulen.className} card-info`}>
                          {" "}
                          {league.leagueName}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col style={{ textAlign: "center" }}>
                        <p className={`${inter.className} card-titles`}>
                          Team Name
                        </p>{" "}
                        <p className={`${koulen.className} card-info`}>
                          {league.teamName}
                        </p>
                      </Col>
                      <Col style={{ textAlign: "center" }}>
                        <p className={`${inter.className} card-titles`}>
                          Member Years
                        </p>
                        <p className={`${koulen.className} card-info`}>
                          {league.memberSince} -{" "}
                          {league.memberUntil === currentYear
                            ? "Present"
                            : league.memberUntil}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col style={{ textAlign: "center" }}>
                        <p className={`${inter.className} card-titles`}>
                          Record
                        </p>
                        <p className={`${koulen.className} card-info`}>
                          {league.wins} - {league.losses} - {league.ties}
                        </p>
                      </Col>
                      <Col style={{ textAlign: "center" }}>
                        <p className={`${inter.className} card-titles`}>
                          Win %{" "}
                        </p>
                        <p className={`${koulen.className} card-info`}>
                          {league.winPercentage}%
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col style={{ textAlign: "center" }}>
                        <p className={`${inter.className} card-titles`}>
                          Top Finish
                        </p>{" "}
                        <p className={`${koulen.className} card-info`}>
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
                      <Col style={{ textAlign: "center" }}>
                        <p className={`${inter.className} card-titles`}>
                          Bottom Finish
                        </p>
                        <p className={`${koulen.className} card-info`}>
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
