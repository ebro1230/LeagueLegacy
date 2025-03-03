"use client";
import { Col, Row } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { Koulen } from "@next/font/google";
const inter = Inter({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});
const koulen = Koulen({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

export default function RecordTeamDropdown({
  onTeamSelect,
  managers,
  chosenTeam1,
  chosenTeam2,
  isActive,
  isTeam2,
  isRecordTeamDropdown,
  chosenSeason,
  logoStyle,
}) {
  return (
    <div>
      <Dropdown onSelect={onTeamSelect}>
        <Dropdown.Toggle
          className="custom-dropdown-toggle2"
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
              <Row style={{ width: "100%" }}>
                <Col>
                  <Image
                    src={chosenSeason.leagueLogo}
                    width={58}
                    height={58}
                    style={{
                      borderRadius: "50%",
                      border: "1px solid #fff",
                      margin: "0rem",
                      objectFit: "contain",
                    }}
                    alt={`${chosenSeason.leagueName}'s Logo`}
                  />
                </Col>
                <Col>
                  <Row>
                    <h5 className={koulen.className}>Overall</h5>
                  </Row>
                </Col>
              </Row>
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
              style={{ display: "flex", width: "100%" }}
            >
              <Row style={{ width: "100%" }}>
                <Col>
                  <Image
                    src={manager.logo}
                    width={58}
                    height={58}
                    style={{
                      borderRadius: "50%",
                      border: "1px solid #fff",
                      margin: "0rem",
                      objectFit: "contain",
                    }}
                    alt={`${manager.name}'s Logo`}
                  />
                </Col>
                <Col>
                  <Row>
                    <h5 className={koulen.className}>{manager.name}</h5>
                  </Row>
                  <Row>
                    <h6 className={inter.className}>{manager.managerName}</h6>
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
