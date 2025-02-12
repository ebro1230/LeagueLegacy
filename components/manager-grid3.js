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
  onColumnSort,
  columnSortedBy,
  isMobile,
}) {
  return (
    <div className={!isMobile ? "tableContainer" : "standings-div"}>
      <Table
        responsive
        striped
        bordered
        size="sm"
        className={!isMobile ? "stickyTable" : "fixed-table"}
      >
        <thead
          className={
            !isMobile
              ? `${koulen.className} tableHeader`
              : `${koulen.className}`
          }
        >
          <tr>
            <th
              onClick={() => onColumnSort("Rank")}
              className={!isMobile ? "stickyCol1" : null}
            >
              Rank{" "}
              {columnSortedBy === "Rank"
                ? TRIANGLE
                : columnSortedBy === "Rank-"
                ? DTRIANGLE
                : null}
            </th>
            <th className={!isMobile ? "stickyCol2" : null}>Logo</th>
            <th
              onClick={() => onColumnSort("Manager")}
              className={!isMobile ? "stickyCol3" : null}
            >
              Manager{" "}
              {columnSortedBy === "Manager"
                ? TRIANGLE
                : columnSortedBy === "Manager-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Team Name")}>
              Team Name{" "}
              {columnSortedBy === "Team Name"
                ? TRIANGLE
                : columnSortedBy === "Team Name-"
                ? DTRIANGLE
                : null}
            </th>
            {chosenSeason.year === "Overall" ? (
              <>
                <th onClick={() => onColumnSort("Championships")}>
                  Championships{" "}
                  {columnSortedBy === "Championships"
                    ? TRIANGLE
                    : columnSortedBy === "Championships-"
                    ? DTRIANGLE
                    : null}
                </th>{" "}
                <th>Championship Seasons</th>
                <th onClick={() => onColumnSort("Best Finish")}>
                  Best Finish{" "}
                  {columnSortedBy === "Best Finish"
                    ? TRIANGLE
                    : columnSortedBy === "Best Finish-"
                    ? DTRIANGLE
                    : null}
                </th>{" "}
                <th>Best Finish Seasons</th>
                <th onClick={() => onColumnSort("Worst Finish")}>
                  Worst Finish{" "}
                  {columnSortedBy === "Worst Finish"
                    ? TRIANGLE
                    : columnSortedBy === "Worst Finish-"
                    ? DTRIANGLE
                    : null}
                </th>
                <th>Worst Finish Seasons</th>
                <th onClick={() => onColumnSort("Playoff Appearances")}>
                  Playoff Appearances{" "}
                  {columnSortedBy === "Playoff Appearances"
                    ? TRIANGLE
                    : columnSortedBy === "Playoff Appearances-"
                    ? DTRIANGLE
                    : null}
                </th>{" "}
                <th>Playoff Seasons</th>
                <th onClick={() => onColumnSort("Consolation Appearances")}>
                  Consolation Appearances{" "}
                  {columnSortedBy === "Consolation Appearances"
                    ? TRIANGLE
                    : columnSortedBy === "Consolation Appearances-"
                    ? DTRIANGLE
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
                ? TRIANGLE
                : columnSortedBy === "Regular Season Record-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Win Percentage")}>
              Win %{" "}
              {columnSortedBy === "Win Percentage"
                ? TRIANGLE
                : columnSortedBy === "Win Percentage-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Points For")}>
              Points For{" "}
              {columnSortedBy === "Points For"
                ? TRIANGLE
                : columnSortedBy === "Points For-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Points Against")}>
              Points Against{" "}
              {columnSortedBy === "Points Against"
                ? TRIANGLE
                : columnSortedBy === "Points Against-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Point Differential")}>
              Points Diff.{" "}
              {columnSortedBy === "Point Differential"
                ? TRIANGLE
                : columnSortedBy === "Point Differential-"
                ? DTRIANGLE
                : null}
            </th>
            <th
              className="record-column"
              onClick={() => onColumnSort("Playoff Record")}
            >
              Playoff Record{" "}
              {columnSortedBy === "Playoff Record"
                ? TRIANGLE
                : columnSortedBy === "Playoff Record-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Playoff Win Percentage")}>
              Playoff Win %{" "}
              {columnSortedBy === "Playoff Win Percentage"
                ? TRIANGLE
                : columnSortedBy === "Playoff Win Percentage-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Playoff Points For")}>
              Playoff Points For{" "}
              {columnSortedBy === "Playoff Points For"
                ? TRIANGLE
                : columnSortedBy === "Playoff Points For-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Playoff Points Against")}>
              Playoff Points Against{" "}
              {columnSortedBy === "Playoff Points Against"
                ? TRIANGLE
                : columnSortedBy === "Playoff Points Against-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Playoff Point Differential")}>
              Playoff Points Diff.{" "}
              {columnSortedBy === "Playoff Point Differential"
                ? TRIANGLE
                : columnSortedBy === "Playoff Point Differential-"
                ? DTRIANGLE
                : null}
            </th>
            <th
              className="record-column"
              onClick={() => onColumnSort("Consolation Record")}
            >
              Consolation Record{" "}
              {columnSortedBy === "Consolation Record"
                ? TRIANGLE
                : columnSortedBy === "Consolation Record-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Consolation Win Percentage")}>
              Consolation Win %{" "}
              {columnSortedBy === "Consolation Win Percentage"
                ? TRIANGLE
                : columnSortedBy === "Consolation Win Percentage-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Consolation Points For")}>
              Consolation Points For{" "}
              {columnSortedBy === "Consolation Points For"
                ? TRIANGLE
                : columnSortedBy === "Consolation Points For-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Consolation Points Against")}>
              Consolation Points Against{" "}
              {columnSortedBy === "Consolation Points Against"
                ? TRIANGLE
                : columnSortedBy === "Consolation Points Against-"
                ? DTRIANGLE
                : null}
            </th>
            <th onClick={() => onColumnSort("Consolation Point Differential")}>
              Consolation Points Diff.{" "}
              {columnSortedBy === "Consolation Point Differential"
                ? TRIANGLE
                : columnSortedBy === "Consolation Point Differential-"
                ? DTRIANGLE
                : null}
            </th>

            {chosenSeason.year === "Overall" ? (
              <>
                <th onClick={() => onColumnSort("Member Seasons")}>
                  Member Seasons{" "}
                  {columnSortedBy === "Member Seasons"
                    ? TRIANGLE
                    : columnSortedBy === "Member Seasons-"
                    ? DTRIANGLE
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
