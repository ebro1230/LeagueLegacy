"use client";
import ListGroup from "react-bootstrap/ListGroup";

export default function SeasonListGroup({ onSeasonSelect, leagueSeasons }) {
  return (
    <ListGroup
      onSelect={onSeasonSelect}
      horizontal
      variant="flush"
      className="d-flex flex-wrap gap-3"
    >
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
  );
}
