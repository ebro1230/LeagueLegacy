"use client";
import ListGroup from "react-bootstrap/ListGroup";
import { Row } from "react-bootstrap";
import { Koulen } from "@next/font/google";
const koulen = Koulen({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

export default function TrendListGroup({
  onTrendSelect,
  chosenTrend,
  chosenSeason1,
  chosenSeason2,
}) {
  return (
    <div className="trend-list-group-div">
      <ListGroup
        onSelect={onTrendSelect}
        horizontal
        variant="flush"
        activeKey={JSON.stringify(chosenTrend)}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {chosenSeason1.year === "Overall" ||
          (chosenSeason1.year !== "Overall" && chosenSeason2.year != "---") ? (
            <>
              <ListGroup.Item
                style={{
                  width: "fit-content",
                  color: "#83A6CF",
                  fontSize: "14px",
                }}
                action
                className={`${koulen.className} custom-list-group-item`}
                eventKey={JSON.stringify({
                  name: "Championships",
                  value: "championships",
                  trend: "championships",
                })}
                key="ChampionshipsKey"
              >
                Championships
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  width: "fit-content",
                  color: "#83A6CF",
                  fontSize: "14px",
                }}
                action
                className={`${koulen.className} custom-list-group-item`}
                eventKey={JSON.stringify({
                  name: "Playoff Appearances",
                  value: "playoffSeasonRecord",
                  trend: "playoffAppearances",
                })}
                key="playoffSeasonRecord.playoffAppearances.length"
              >
                Playoff Appearances
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  width: "fit-content",
                  color: "#83A6CF",
                  fontSize: "14px",
                }}
                action
                className={`${koulen.className} custom-list-group-item`}
                eventKey={JSON.stringify({
                  name: "Playoff Wins",
                  value: "playoffSeasonRecord",
                  trend: "wins",
                })}
                key="playoffSeasonRecord.wins"
              >
                Playoff Wins
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  width: "fit-content",
                  color: "#83A6CF",
                  fontSize: "14px",
                }}
                action
                className={`${koulen.className} custom-list-group-item`}
                eventKey={JSON.stringify({
                  name: "Playoff Losses",
                  value: "playoffSeasonRecord",
                  trend: "losses",
                })}
                key="playoffSeasonRecord.losses"
              >
                Playoff Losses
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  width: "fit-content",
                  color: "#83A6CF",
                  fontSize: "14px",
                }}
                action
                className={`${koulen.className} custom-list-group-item`}
                eventKey={JSON.stringify({
                  name: "Playoff Win Differential",
                  value: "playoffSeasonRecord",
                  trend: "winDifferential",
                })}
                key="playoffSeasonRecord.winDifferential"
              >
                Playoff Win Differential
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  width: "fit-content",
                  color: "#83A6CF",
                  fontSize: "14px",
                }}
                action
                className={`${koulen.className} custom-list-group-item`}
                eventKey={JSON.stringify({
                  name: "Consolation Appearances",
                  value: "consolationSeasonRecord",
                  trend: "consolationAppearances",
                })}
                key="consolationSeasonRecord.consolationAppearances.length"
              >
                Consolation Appearances
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  width: "fit-content",
                  color: "#83A6CF",
                  fontSize: "14px",
                }}
                action
                className={`${koulen.className} custom-list-group-item`}
                eventKey={JSON.stringify({
                  name: "Consolation Wins",
                  value: "consolationSeasonRecord",
                  trend: "wins",
                })}
                key="consolationSeasonRecord.wins"
              >
                Consolation Wins
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  width: "fit-content",
                  color: "#83A6CF",
                  fontSize: "14px",
                }}
                action
                className={`${koulen.className} custom-list-group-item`}
                eventKey={JSON.stringify({
                  name: "Consolation Losses",
                  value: "consolationSeasonRecord",
                  trend: "losses",
                })}
                key="consolationSeasonRecord.losses"
              >
                Consolation Losses
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  width: "fit-content",
                  color: "#83A6CF",
                  fontSize: "14px",
                }}
                action
                className={`${koulen.className} custom-list-group-item`}
                eventKey={JSON.stringify({
                  name: "Consolation Win Differential",
                  value: "consolationSeasonRecord",
                  trend: "winDifferential",
                })}
                key="consolationSeasonRecord.winDifferential"
              >
                Consolation Win Differential
              </ListGroup.Item>
            </>
          ) : null}
          <ListGroup.Item
            style={{ width: "fit-content", color: "#83A6CF", fontSize: "14px" }}
            action
            className={`${koulen.className} custom-list-group-item`}
            eventKey={JSON.stringify({
              name: "Regular Season Wins",
              value: "regularSeasonRecord",
              trend: "wins",
            })}
            key="regularSeasonRecord.wins"
          >
            Wins
          </ListGroup.Item>
          <ListGroup.Item
            style={{ width: "fit-content", color: "#83A6CF", fontSize: "14px" }}
            action
            className={`${koulen.className} custom-list-group-item`}
            eventKey={JSON.stringify({
              name: "Regular Season Losses",
              value: "regularSeasonRecord",
              trend: "losses",
            })}
            key="regularSeasonRecord.losses"
          >
            Losses
          </ListGroup.Item>
          <ListGroup.Item
            style={{ width: "fit-content", color: "#83A6CF", fontSize: "14px" }}
            action
            className={`${koulen.className} custom-list-group-item`}
            eventKey={JSON.stringify({
              name: "Regular Season Ties",
              value: "regularSeasonRecord",
              trend: "ties",
            })}
            key="regularSeasonRecord.ties"
          >
            Ties
          </ListGroup.Item>
          <ListGroup.Item
            style={{ width: "fit-content", color: "#83A6CF", fontSize: "14px" }}
            action
            className={`${koulen.className} custom-list-group-item`}
            eventKey={JSON.stringify({
              name: "Regular Season Win Differential",
              value: "regularSeasonRecord",
              trend: "winDifferential",
            })}
            key="regularSeasonRecord.winDifferential"
          >
            Win Differential
          </ListGroup.Item>
          <ListGroup.Item
            style={{ width: "fit-content", color: "#83A6CF", fontSize: "14px" }}
            action
            className={`${koulen.className} custom-list-group-item`}
            eventKey={JSON.stringify({
              name: "Regular Season Points For",
              value: "regularSeasonRecord",
              trend: "pointsFor",
            })}
            key="regularSeasonRecord.pointsFor"
          >
            Points For
          </ListGroup.Item>
          <ListGroup.Item
            style={{ width: "fit-content", color: "#83A6CF", fontSize: "14px" }}
            action
            className={`${koulen.className} custom-list-group-item`}
            eventKey={JSON.stringify({
              name: "Regular Season Points Against",
              value: "regularSeasonRecord",
              trend: "pointsAgainst",
            })}
            key="regularSeasonRecord.pointsAgainst"
          >
            Points Against
          </ListGroup.Item>
          <ListGroup.Item
            style={{ width: "fit-content", color: "#83A6CF", fontSize: "14px" }}
            action
            className={`${koulen.className} custom-list-group-item`}
            eventKey={JSON.stringify({
              name: "Regular Season Point Differential",
              value: "regularSeasonRecord",
              trend: "pointsDifferential",
            })}
            key="regularSeasonRecord.pointsDifferential"
          >
            Point Differential
          </ListGroup.Item>
        </div>
      </ListGroup>
    </div>
  );
}
