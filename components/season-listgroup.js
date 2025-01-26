"use client";
import ListGroup from "react-bootstrap/ListGroup";
import { Row } from "react-bootstrap";

export default function SeasonListGroup({
  onSeasonSelect,
  leagueSeasons,
  chosenSeason,
}) {
  return (
    <>
      {leagueSeasons.length <= 10 ? (
        <>
          <ListGroup
            onSelect={onSeasonSelect}
            horizontal
            variant="flush"
            activeKey={chosenSeason.key}
          >
            <div style={{ display: "flex", width: "fit-content" }}>
              <ListGroup.Item
                eventKey={JSON.stringify(
                  leagueSeasons[leagueSeasons.length - 1]
                )}
                key={leagueSeasons[leagueSeasons.length - 1].key}
                action
                className="custom-list-group-item"
              >
                {leagueSeasons[leagueSeasons.length - 1].year}
              </ListGroup.Item>
            </div>
            <div style={{ display: "flex", width: "fit-content" }}>
              {leagueSeasons.slice(0, -1).map((season) => (
                <ListGroup.Item
                  eventKey={JSON.stringify(season)}
                  key={season.key}
                  action
                  className="custom-list-group-item"
                >
                  {season.year}
                </ListGroup.Item>
              ))}
            </div>
          </ListGroup>
        </>
      ) : (
        <>
          <ListGroup
            onSelect={onSeasonSelect}
            horizontal
            variant="flush"
            activeKey={chosenSeason.key}
          >
            <div style={{ display: "flex", width: "fit-content" }}>
              <ListGroup.Item
                eventKey={JSON.stringify(
                  leagueSeasons[leagueSeasons.length - 1]
                )}
                key={leagueSeasons[leagueSeasons.length - 1].key}
                action
                className="custom-list-group-item"
              >
                {leagueSeasons[leagueSeasons.length - 1].year}
              </ListGroup.Item>
            </div>
            <div style={{ display: "flex", width: "fit-content" }}>
              {leagueSeasons.slice(0, 10).map((season) => (
                <ListGroup.Item
                  eventKey={JSON.stringify(season)}
                  key={season.key}
                  action
                  className="custom-list-group-item"
                >
                  {season.year}
                </ListGroup.Item>
              ))}
            </div>
            <div style={{ display: "flex", width: "fit-content" }}>
              {leagueSeasons.slice(10, -1).map((season) => (
                <ListGroup.Item
                  eventKey={JSON.stringify(season)}
                  key={season.key}
                  action
                  className="custom-list-group-item"
                >
                  {season.year}
                </ListGroup.Item>
              ))}
            </div>
          </ListGroup>
        </>
      )}
    </>
  );
}
