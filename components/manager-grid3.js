"use client";
import ManagerItem from "./manager-item";
import Table from "react-bootstrap/Table";
import { Koulen } from "@next/font/google";
const koulen = Koulen({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});
import { Inter } from "@next/font/google";
const inter = Inter({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

export default function ManagerGrid({
  managers,
  chosenSeason,
  currentYear,
  logoStyle,
}) {
  return (
    <div className="standings-div">
      <Table responsive striped bordered size="sm" className="fixed-table">
        <thead className={koulen.className}>
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
            <th>Win %</th>
            <th>Points For</th>
            <th>Points Against</th>
            <th>Points Diff.</th>
            <th className="record-column">Playoff Record</th>
            <th>Playoff Win %</th>
            <th>Playoff Points For</th>
            <th>Playoff Points Against</th>
            <th>Playoff Points Diff.</th>
            <th className="record-column">Consolation Record</th>
            <th>Consolation Win %</th>
            <th>Consolation Points For</th>
            <th>Consolation Points Against</th>
            <th>Consolation Points Diff.</th>

            {chosenSeason.year === "Overall" ? (
              <>
                <th>Member Seasons</th>
              </>
            ) : null}
          </tr>
        </thead>
        <tbody className={`${inter.className} small-table-body`}>
          {managers.length
            ? managers.map((manager) => {
                return (
                  <tr key={JSON.stringify(manager)} className="small-table-row">
                    <ManagerItem
                      manager={manager}
                      currentYear={currentYear}
                      logoStyle={logoStyle}
                      chosenSeason={chosenSeason}
                      key={manager.key}
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
