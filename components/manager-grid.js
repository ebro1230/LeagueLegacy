"use client";
import { useEffect, useState } from "react";
import ManagerItem from "./manager-item";

export default function ManagerGrid({
  managers,
  chosenSeason,
  currentYear,
  logoStyle,
}) {
  const [season, setSeason] = useState([]);
  useEffect(() => {
    const updateSeason = (chosenSeason) => {
      let orderedSeason = [];
      let unorderedSeason = managers.map((manager) => {
        return manager.map((season) => {
          if (season.season.toString() === chosenSeason) {
            return season;
          }
        });
      });
      unorderedSeason.map((manager) => {
        manager.map((season) => {
          if (season) {
            orderedSeason = [...orderedSeason, season];
          }
        });
      });
      orderedSeason.sort((a, b) => a.finish - b.finish);

      if (chosenSeason === "Overall") {
        orderedSeason.sort((a, b) => b.wins - a.wins);
        orderedSeason.sort((a, b) => a.losses - b.losses);
        orderedSeason.sort((a, b) => b.championships - a.championships);
        //orderedSeason.sort((a, b) => b.memberUntil - a.memberUntil);  Only if you want to sort it by current membership
      }
      setSeason(orderedSeason);
    };

    updateSeason(chosenSeason);
  }, [chosenSeason]);

  return season.length
    ? season.map((manager) => {
        return (
          <ManagerItem
            manager={manager}
            currentYear={currentYear}
            logoStyle={logoStyle}
          />
        );
      })
    : null;
}
