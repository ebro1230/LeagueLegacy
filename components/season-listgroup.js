"use client";
import ListGroup from "react-bootstrap/ListGroup";

export default function SeasonListGroup({ onSeasonSelect, leagueSeasons }) {
  return (
    <>
      {leagueSeasons.length <= 10 ? (
        <>
          <ListGroup onSelect={onSeasonSelect} horizontal variant="flush">
            <ListGroup.Item
              eventKey={JSON.stringify(leagueSeasons[leagueSeasons.length - 1])}
              key={leagueSeasons[leagueSeasons.length - 1].key}
              action
              className="custom-list-group-item"
            >
              {leagueSeasons[leagueSeasons.length - 1].year}
            </ListGroup.Item>
          </ListGroup>
          <ListGroup onSelect={onSeasonSelect} horizontal variant="flush">
            {leagueSeasonsleagueSeasons.slice(0, -1).map((season) => (
              <ListGroup.Item
                eventKey={JSON.stringify(season)}
                key={season.key}
                action
                className="custom-list-group-item"
              >
                {season.year}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      ) : (
        <>
          <ListGroup onSelect={onSeasonSelect} horizontal variant="flush">
            <ListGroup.Item
              eventKey={JSON.stringify(leagueSeasons[leagueSeasons.length - 1])}
              key={leagueSeasons[leagueSeasons.length - 1].key}
              action
              className="custom-list-group-item"
            >
              {leagueSeasons[leagueSeasons.length - 1].year}
            </ListGroup.Item>
          </ListGroup>
          <ListGroup onSelect={onSeasonSelect} horizontal variant="flush">
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
          </ListGroup>
          <ListGroup onSelect={onSeasonSelect} horizontal variant="flush">
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
          </ListGroup>
        </>
      )}
    </>
  );
}
