"use client";

import { Spinner } from "react-bootstrap";
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
  onTeamSelect1,
  onTeamSelect2,
  managers,
  isTeam1Active,
  isTeam2Active,
}) {
  return chosenTeam1.managerId != "---" ? (
    <div className="manager-comparison-div">
      {matchupsLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <div className="manager-specifics-div">
          <ManagerMatchup
            summary={filteredSummary}
            logoStyle={logoStyle}
            onTeamSelect1={onTeamSelect1}
            onTeamSelect2={onTeamSelect2}
            managers={managers}
            team1Active={isTeam1Active}
            team2Active={isTeam2Active}
            chosenSeason={chosenSeason}
            chosenTeam1={chosenTeam1}
            chosenTeam2={chosenTeam2}
          />
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
