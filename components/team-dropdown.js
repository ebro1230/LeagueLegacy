"use client";
import { Col, Row } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "next/image";

export default function TeamDropdown({
  onTeamSelect,
  managers,
  chosenTeam1,
  chosenTeam2,
  isActive,
  isTeam2,
  isRecordTeamDropdown,
  logoStyle,
}) {
  return (
    <div className="season-dropdown-div">
      <Dropdown onSelect={onTeamSelect}>
        <Dropdown.Toggle
          className="custom-dropdown-toggle"
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
              <Row>
                <Col xs={2}>
                  <Image
                    src={manager.logo}
                    width={58}
                    height={58}
                    style={logoStyle}
                    alt={`${manager.name}'s Logo`}
                  />
                </Col>
                <Col>
                  <Row>
                    <h1>{manager.name}</h1>
                  </Row>
                  <Row>
                    <h3>{manager.managerName}</h3>
                  </Row>
                </Col>
              </Row>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
