"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Spinner from "react-bootstrap/Spinner";

export default function ManagerStats({ managerData, logoStyle, currentYear }) {
  //console.log(managerData.memberSeasons);
  return (
    <>
      <div className="manager-div" key={managerData.id}>
        {managerData.currentTeamLogo ? (
          <Image
            src={managerData.currentTeamLogo}
            width={120}
            height={120}
            style={logoStyle}
            alt={`${managerData.currentTeamName}'s Logo`}
          />
        ) : (
          <h1>No valid team logo</h1>
        )}
        <p>Team Name: {managerData.currentTeamName}</p>
        <p>Manager: {managerData.currentName}</p>

        <p>
          {managerData.memberSince} -{" "}
          {managerData.memberUntil === currentYear
            ? "Present"
            : managerData.memberUntil}
        </p>
        <p>
          {managerData.overallWins} - {managerData.overallLosses} -{" "}
          {managerData.overallTies}
        </p>
        <p>Win %: {managerData.overallWinPercentage}%</p>
        {managerData.championships > 0 ? (
          <p>Championships: {managerData.championships}</p>
        ) : (
          <p>Top Finish: {managerData.bestFinish}</p>
        )}
        <p>Bottom Finish: {managerData.worstFinish}</p>
      </div>

      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Dropdown Button
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item key="Overall">Overall</Dropdown.Item>
          {managerData.memberSeasons.length
            ? managerData.memberSeasons.map((season) => {
                <Dropdown.Item key={season.toString()}>
                  {season.toString()}
                </Dropdown.Item>;
              })
            : null}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
