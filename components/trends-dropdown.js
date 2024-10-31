"use client";
import Dropdown from "react-bootstrap/Dropdown";

export default function TrendsDropdown({
  onTrendSelect,
  chosenTrend,
  chosenSeason1,
  chosenSeason2,
}) {
  return (
    <div className="season-dropdown-div">
      <Dropdown onSelect={onTrendSelect}>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {chosenTrend.name}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {chosenSeason1.year === "Overall" ||
          (chosenSeason1.year !== "Overall" && chosenSeason2.year != "---") ? (
            <>
              <Dropdown.Item
                eventKey={JSON.stringify({
                  name: "Championships",
                  value: "championships",
                  trend: "championships",
                })}
                key="ChampionshipsKey"
              >
                Championships
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={JSON.stringify({
                  name: "Playoff Appearances",
                  value: "playoffSeasonRecord",
                  trend: "playoffAppearances",
                })}
                key="playoffSeasonRecord.playoffAppearances.length"
              >
                Playoff Appearances
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={JSON.stringify({
                  name: "Playoff Wins",
                  value: "playoffSeasonRecord",
                  trend: "wins",
                })}
                key="playoffSeasonRecord.wins"
              >
                Playoff Wins
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={JSON.stringify({
                  name: "Playoff Losses",
                  value: "playoffSeasonRecord",
                  trend: "losses",
                })}
                key="playoffSeasonRecord.losses"
              >
                Playoff Losses
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={JSON.stringify({
                  name: "Playoff Win Differential",
                  value: "playoffSeasonRecord",
                  trend: "winDifferential",
                })}
                key="playoffSeasonRecord.winDifferential"
              >
                Playoff Win Differential
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={JSON.stringify({
                  name: "Consolation Appearances",
                  value: "consolationSeasonRecord",
                  trend: "consolationAppearances",
                })}
                key="consolationSeasonRecord.consolationAppearances.length"
              >
                Consolation Appearances
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={JSON.stringify({
                  name: "Consolation Wins",
                  value: "consolationSeasonRecord",
                  trend: "wins",
                })}
                key="consolationSeasonRecord.wins"
              >
                Consolation Wins
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={JSON.stringify({
                  name: "Consolation Losses",
                  value: "consolationSeasonRecord",
                  trend: "losses",
                })}
                key="consolationSeasonRecord.losses"
              >
                Consolation Losses
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={JSON.stringify({
                  name: "Consolation Win Differential",
                  value: "consolationSeasonRecord",
                  trend: "winDifferential",
                })}
                key="consolationSeasonRecord.winDifferential"
              >
                Consolation Win Differential
              </Dropdown.Item>
            </>
          ) : null}
          <Dropdown.Item
            eventKey={JSON.stringify({
              name: "Regular Season Wins",
              value: "regularSeasonRecord",
              trend: "wins",
            })}
            key="regularSeasonRecord.wins"
          >
            Wins
          </Dropdown.Item>
          <Dropdown.Item
            eventKey={JSON.stringify({
              name: "Regular Season Losses",
              value: "regularSeasonRecord",
              trend: "losses",
            })}
            key="regularSeasonRecord.losses"
          >
            Losses
          </Dropdown.Item>
          <Dropdown.Item
            eventKey={JSON.stringify({
              name: "Regular Season Ties",
              value: "regularSeasonRecord",
              trend: "ties",
            })}
            key="regularSeasonRecord.ties"
          >
            Ties
          </Dropdown.Item>
          <Dropdown.Item
            eventKey={JSON.stringify({
              name: "Regular Season Win Differential",
              value: "regularSeasonRecord",
              trend: "winDifferential",
            })}
            key="regularSeasonRecord.winDifferential"
          >
            Win Differential
          </Dropdown.Item>
          <Dropdown.Item
            eventKey={JSON.stringify({
              name: "Regular Season Points For",
              value: "regularSeasonRecord",
              trend: "pointsFor",
            })}
            key="regularSeasonRecord.pointsFor"
          >
            Points For
          </Dropdown.Item>
          <Dropdown.Item
            eventKey={JSON.stringify({
              name: "Regular Season Points Against",
              value: "regularSeasonRecord",
              trend: "pointsAgainst",
            })}
            key="regularSeasonRecord.pointsAgainst"
          >
            Points Against
          </Dropdown.Item>
          <Dropdown.Item
            eventKey={JSON.stringify({
              name: "Regular Season Point Differential",
              value: "regularSeasonRecord",
              trend: "pointsDifferential",
            })}
            key="regularSeasonRecord.pointsDifferential"
          >
            Point Differential
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
