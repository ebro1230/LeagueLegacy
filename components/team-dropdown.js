"use client";
import Dropdown from "react-bootstrap/Dropdown";

export default function TeamDropdown({
  onTeamSelect,
  managers,
  chosenTeam1,
  chosenTeam2,
  isActive,
  isTeam2,
  isRecordTeamDropdown,
}) {
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
