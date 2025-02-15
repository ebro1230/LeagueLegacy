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
import "bootstrap/dist/css/bootstrap.min.css";

export default function ManagerGrid({
  managers,
  chosenSeason,
  currentYear,
  logoStyle,
  onColumnSort,
  columnSortedBy,
}) {
  return (
    <div className={"tableContainer"}>
      <Table striped bordered size="sm" className={"stickyTable"}>
        <thead className={`${koulen.className} tableHeader`}>
          <tr>
            <th onClick={() => onColumnSort("Rank")} className={"stickyCol1"}>
              Rank{" "}
              {columnSortedBy === "Rank"
                ? "▲"
                : columnSortedBy === "Rank-"
                ? "▼"
                : null}
            </th>
            <th className={"stickyCol2"}>Logo</th>
            <th
              onClick={() => onColumnSort("Manager")}
              className={"stickyCol3"}
            >
              Manager{" "}
              {columnSortedBy === "Manager"
                ? "▲"
                : columnSortedBy === "Manager-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Team Name")}>
              Team Name{" "}
              {columnSortedBy === "Team Name"
                ? "▲"
                : columnSortedBy === "Team Name-"
                ? "▼"
                : null}
            </th>
            {chosenSeason.year === "Overall" ? (
              <>
                <th onClick={() => onColumnSort("Championships")}>
                  Championships{" "}
                  {columnSortedBy === "Championships"
                    ? "▲"
                    : columnSortedBy === "Championships-"
                    ? "▼"
                    : null}
                </th>{" "}
                <th>Championship Seasons</th>
                <th onClick={() => onColumnSort("Best Finish")}>
                  Best Finish{" "}
                  {columnSortedBy === "Best Finish"
                    ? "▲"
                    : columnSortedBy === "Best Finish-"
                    ? "▼"
                    : null}
                </th>{" "}
                <th>Best Finish Seasons</th>
                <th onClick={() => onColumnSort("Worst Finish")}>
                  Worst Finish{" "}
                  {columnSortedBy === "Worst Finish"
                    ? "▲"
                    : columnSortedBy === "Worst Finish-"
                    ? "▼"
                    : null}
                </th>
                <th>Worst Finish Seasons</th>
                <th onClick={() => onColumnSort("Playoff Appearances")}>
                  Playoff Appearances{" "}
                  {columnSortedBy === "Playoff Appearances"
                    ? "▲"
                    : columnSortedBy === "Playoff Appearances-"
                    ? "▼"
                    : null}
                </th>{" "}
                <th>Playoff Seasons</th>
                <th onClick={() => onColumnSort("Consolation Appearances")}>
                  Consolation Appearances{" "}
                  {columnSortedBy === "Consolation Appearances"
                    ? "▲"
                    : columnSortedBy === "Consolation Appearances-"
                    ? "▼"
                    : null}
                </th>{" "}
                <th>Consolation Seasons</th>
              </>
            ) : null}
            <th
              className="record-column"
              onClick={() => onColumnSort("Regular Season Record")}
            >
              Regular Season Record{" "}
              {columnSortedBy === "Regular Season Record"
                ? "▲"
                : columnSortedBy === "Regular Season Record-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Win Percentage")}>
              Win %{" "}
              {columnSortedBy === "Win Percentage"
                ? "▲"
                : columnSortedBy === "Win Percentage-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Points For")}>
              Points For{" "}
              {columnSortedBy === "Points For"
                ? "▲"
                : columnSortedBy === "Points For-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Points Against")}>
              Points Against{" "}
              {columnSortedBy === "Points Against"
                ? "▲"
                : columnSortedBy === "Points Against-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Point Differential")}>
              Points Diff.{" "}
              {columnSortedBy === "Point Differential"
                ? "▲"
                : columnSortedBy === "Point Differential-"
                ? "▼"
                : null}
            </th>
            <th
              className="record-column"
              onClick={() => onColumnSort("Playoff Record")}
            >
              Playoff Record{" "}
              {columnSortedBy === "Playoff Record"
                ? "▲"
                : columnSortedBy === "Playoff Record-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Playoff Win Percentage")}>
              Playoff Win %{" "}
              {columnSortedBy === "Playoff Win Percentage"
                ? "▲"
                : columnSortedBy === "Playoff Win Percentage-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Playoff Points For")}>
              Playoff Points For{" "}
              {columnSortedBy === "Playoff Points For"
                ? "▲"
                : columnSortedBy === "Playoff Points For-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Playoff Points Against")}>
              Playoff Points Against{" "}
              {columnSortedBy === "Playoff Points Against"
                ? "▲"
                : columnSortedBy === "Playoff Points Against-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Playoff Point Differential")}>
              Playoff Points Diff.{" "}
              {columnSortedBy === "Playoff Point Differential"
                ? "▲"
                : columnSortedBy === "Playoff Point Differential-"
                ? "▼"
                : null}
            </th>
            <th
              className="record-column"
              onClick={() => onColumnSort("Consolation Record")}
            >
              Consolation Record{" "}
              {columnSortedBy === "Consolation Record"
                ? "▲"
                : columnSortedBy === "Consolation Record-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Consolation Win Percentage")}>
              Consolation Win %{" "}
              {columnSortedBy === "Consolation Win Percentage"
                ? "▲"
                : columnSortedBy === "Consolation Win Percentage-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Consolation Points For")}>
              Consolation Points For{" "}
              {columnSortedBy === "Consolation Points For"
                ? "▲"
                : columnSortedBy === "Consolation Points For-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Consolation Points Against")}>
              Consolation Points Against{" "}
              {columnSortedBy === "Consolation Points Against"
                ? "▲"
                : columnSortedBy === "Consolation Points Against-"
                ? "▼"
                : null}
            </th>
            <th onClick={() => onColumnSort("Consolation Point Differential")}>
              Consolation Points Diff.{" "}
              {columnSortedBy === "Consolation Point Differential"
                ? "▲"
                : columnSortedBy === "Consolation Point Differential-"
                ? "▼"
                : null}
            </th>

            {chosenSeason.year === "Overall" ? (
              <>
                <th onClick={() => onColumnSort("Member Seasons")}>
                  Member Seasons{" "}
                  {columnSortedBy === "Member Seasons"
                    ? "▲"
                    : columnSortedBy === "Member Seasons-"
                    ? "▼"
                    : null}
                </th>
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
