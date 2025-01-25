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
            disabled={Number(chosenSeason) === Number(season.year)}
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
