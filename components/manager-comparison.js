"use client";
import Image from "next/image";
import { Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getCookie } from "@/actions/cookies";
import ManagerMatchup from "./manager-matchup";
import SeasonGrid from "./season-grid";

export default function ManagerComparison({
  chosenSeason,
  chosenTeam1,
  chosenTeam2,
  logoStyle,
  onCompareManager,
  filteredMatchups,
  filteredSummary,
  matchupsLoading,
  leagueType,
  accessToken,
}) {
  return chosenTeam1.managerId != "---" ? (
    <div className="manager-comparison-div">
      {matchupsLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <div className="manager-specifics-div">
          <ManagerMatchup summary={filteredSummary} logoStyle={logoStyle} />
          <SeasonGrid
            seasons={filteredMatchups}
            logoStyle={logoStyle}
            onCompareManager={onCompareManager}
            chosenSeason={chosenSeason}
            chosenTeam2={chosenTeam2}
            leagueType={leagueType}
            accessToken={accessToken}
          />
        </div>
      )}
    </div>
  ) : (
    <h1>Please Choose Teams</h1>
  );
}
