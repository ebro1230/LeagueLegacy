"use client";
import Dropdown from "react-bootstrap/Dropdown";

export default function SeasonDropdown({
  onSeasonSelect,
  chosenSeason,
  leagueSeasons,
  seasonDropdownActive,
}) {
  return (
    <div className="season-dropdown-div">
      <Dropdown onSelect={onSeasonSelect}>
        <Dropdown.Toggle
          id="dropdown-basic"
          disabled={!seasonDropdownActive}
          bsPrefix="my-custom-dropdown-toggle"
        >
          {chosenSeason.year}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {leagueSeasons.map((season) => (
            <Dropdown.Item eventKey={JSON.stringify(season)} key={season.key}>
              {season.year}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
