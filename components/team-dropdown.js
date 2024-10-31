"use client";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";

export default function TeamDropdown({
  onTeamSelect,
  managers,
  chosenTeam1,
  chosenTeam2,
  isActive,
  isTeam2,
  isRecordTeamDropdown,
}) {
  // const [season, setSeason] = useState([]);
  // useEffect(() => {
  //   const updateSeason = (chosenSeason) => {
  //     let orderedSeason = [];
  //     let unorderedSeason = managers.map((manager) => {
  //       return manager.map((season) => {
  //         if (season.season.toString() === chosenSeason) {
  //           return season;
  //         }
  //       });
  //     });
  //     unorderedSeason.map((manager) => {
  //       manager.map((season) => {
  //         if (season) {
  //           orderedSeason = [...orderedSeason, season];
  //         }
  //       });
  //     });
  //     orderedSeason.sort((a, b) => a.finish - b.finish);

  //     if (chosenSeason === "Overall") {
  //       orderedSeason.sort((a, b) => b.wins - a.wins);
  //       orderedSeason.sort((a, b) => a.losses - b.losses);
  //       orderedSeason.sort((a, b) => b.championships - a.championships);
  //       //orderedSeason.sort((a, b) => b.memberUntil - a.memberUntil);  Only if you want to sort it by current membership
  //     }
  //     setSeason(orderedSeason);
  //   };

  //   updateSeason(chosenSeason);
  // }, [chosenSeason]);

  return (
    <div className="season-dropdown-div">
      <Dropdown onSelect={onTeamSelect}>
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          disabled={!isActive}
        >
          {!isTeam2 ? chosenTeam1.managerName : chosenTeam2.managerName}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {isTeam2 ? (
            <Dropdown.Item
              eventKey={JSON.stringify({ managerName: "Overall" })}
              key={"Overall"}
              disabled={chosenTeam2.managerName === "Overall"}
            >
              Overall
            </Dropdown.Item>
          ) : null}
          {isRecordTeamDropdown ? (
            <Dropdown.Item
              eventKey={JSON.stringify({ managerName: "Overall" })}
              key={"Overall"}
              disabled={chosenTeam1.managerName === "Overall"}
            >
              Overall
            </Dropdown.Item>
          ) : null}
          {managers.map((manager) => (
            <Dropdown.Item
              eventKey={JSON.stringify(manager)}
              key={manager.key}
              disabled={
                manager.managerId === chosenTeam1.managerId ||
                (isTeam2 && manager.managerId === chosenTeam2.managerId)
              }
            >
              {manager.managerName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
