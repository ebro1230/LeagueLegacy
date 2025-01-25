"use client";
import ListGroup from "react-bootstrap/ListGroup";

export default function SeasonListGroup({ onSeasonSelect, leagueSeasons }) {
  return (
    <div className="season-list-group-div">
      <ListGroup onSelect={onSeasonSelect} horizontal variant="flush">
        {leagueSeasons.map((season) => (
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
    </div>
  );
}
