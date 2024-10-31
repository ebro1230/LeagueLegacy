"use client";
import ManagerItem from "./manager-item";
import Table from "react-bootstrap/Table";

export default function ManagerGrid({
  managers,
  chosenSeason,
  currentYear,
  logoStyle,
}) {
  return (
    <div className="standings-div">
      <Table responsive striped bordered size="sm">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Logo</th>
            <th>Manager</th>
            <th>Team Name</th>
            {chosenSeason.year === "Overall" ? (
              <>
                <th>Championships</th> <th>Championship Seasons</th>
                <th>Best Finish</th> <th>Best Finish Seasons</th>
                <th>Worst Finish</th>
                <th>Worst Finish Seasons</th>
                <th>Playoff Appearances</th> <th>Playoff Seasons</th>
                <th>Consolation Appearances</th> <th>Consolation Seasons</th>
              </>
            ) : null}
            <th className="record-column">Regular Season Record</th>
            <th>Win Percentage</th>
            <th>Points For</th>
            <th>Points Against</th>
            <th>Points Differential</th>
            <th className="record-column">Playoff Record</th>
            <th>Playoff Win Percentage</th>
            <th>Playoff Points For</th>
            <th>Playoff Points Against</th>
            <th>Playoff Points Differential</th>
            <th className="record-column">Consolation Record</th>
            <th>Consolation Win Percentage</th>
            <th>Consolation Points For</th>
            <th>Consolation Points Against</th>
            <th>Consolation Points Differential</th>

            {chosenSeason.year === "Overall" ? (
              <>
                <th>Member Seasons</th>
              </>
            ) : null}
          </tr>
        </thead>
        <tbody className="small-table-body">
          {managers.length
            ? managers.map((manager) => {
                return (
                  <tr className="small-table-row">
                    <ManagerItem
                      manager={manager}
                      currentYear={currentYear}
                      logoStyle={logoStyle}
                      chosenSeason={chosenSeason}
                    />
                  </tr>
                );
              })
            : null}
        </tbody>
      </Table>
    </div>
  );
}
