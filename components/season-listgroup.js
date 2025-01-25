"use client";
import ListGroup from "react-bootstrap/ListGroup";

export default function SeasonListGroup({
  onSeasonSelect,
  chosenSeason,
  leagueSeasons,
  seasonDropdownActive,
}) {
  return (
    <div className="season-dropdown-div">
      <ListGroup onSelect={onSeasonSelect} horizontal variant="flush">
        {leagueSeasons.map((season) => (
          <ListGroup.Item
            eventKey={JSON.stringify(season)}
            key={season.key}
            disabled={!seasonDropdownActive}
          >
            {season.year}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
