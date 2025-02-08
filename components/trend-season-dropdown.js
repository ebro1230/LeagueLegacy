"use client";
import Dropdown from "react-bootstrap/Dropdown";

export default function TrendSeasonDropdown({
  onSeasonSelect,
  chosenSeason,
  chosenSeason1,
  leagueSeasons,
  seasonDropdownActive,
  isSeason2,
}) {
  return (
    <div className="season-dropdown-div">
      <Dropdown onSelect={onSeasonSelect}>
        <Dropdown.Toggle
          //variant="success"
          //id="dropdown-basic"
          className="custom-dropdown-toggle"
          disabled={!seasonDropdownActive}
        >
          {chosenSeason.year}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {isSeason2 ? (
            <>
              <Dropdown.Item
                eventKey={JSON.stringify({ year: "---" })}
                key="---"
              >
                ---
              </Dropdown.Item>

              {leagueSeasons
                .filter(
                  (season) => Number(season.year) > Number(chosenSeason1.year)
                )
                .map((season) => {
                  return (
                    <Dropdown.Item
                      eventKey={JSON.stringify(season)}
                      key={season.key}
                      disabled={
                        season.year === chosenSeason.year ||
                        season.year === chosenSeason1.year
                      }
                    >
                      {season.year}
                    </Dropdown.Item>
                  );
                })}
            </>
          ) : (
            <>
              <Dropdown.Item
                eventKey={JSON.stringify({ year: "Overall" })}
                key="Overall"
              >
                Overall
              </Dropdown.Item>
              {leagueSeasons.map((season) => {
                return (
                  <Dropdown.Item
                    eventKey={JSON.stringify(season)}
                    key={season.key}
                    disabled={
                      season.year === chosenSeason.year ||
                      season.year === chosenSeason1.year
                    }
                  >
                    {season.year}
                  </Dropdown.Item>
                );
              })}
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
