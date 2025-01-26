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
  return (
    <>
      {chosenTeam1.managerName === "---" ? (
        <div className="manager-specifics-div">
          <ManagerMatchup
            summary={{
              name: chosenSeason.leagueName,
              logo: chosenSeason.leagueLogo,
              wins: 0,
              losses: 0,
              ties: 0,
              playoffWins: 0,
              playoffLosses: 0,
              consolationWins: 0,
              consolationLosses: 0,
              projectedPointsFor: 0,
              projectedPointsAgainst: 0,
              pointsFor: 0,
              pointsAgainst: 0,
              opponentName: "TBD",
              opponentLogo: "TBD",
            }}
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
        </div>
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
    </>
  );
}
