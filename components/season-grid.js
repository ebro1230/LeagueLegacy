import { useState } from "react";
import SeasonItem from "./season-item";
import Accordion from "react-bootstrap/Accordion";
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

export default function SeasonGrid({
  seasons,
  logoStyle,
  onCompareManager,
  chosenSeason,
  chosenTeam2,
  leagueType,
  accessToken,
}) {
  return seasons.length
    ? chosenSeason.year != "Overall"
      ? seasons.map((season) => {
          return (
            <SeasonItem
              key={season}
              season={season}
              logoStyle={logoStyle}
              onCompareManager={onCompareManager}
              chosenSeason={chosenSeason}
              chosenTeam2={chosenTeam2}
              leagueType={leagueType}
              accessToken={accessToken}
            />
          );
        })
      : seasons.map((season) => {
          return (
            <Accordion key={season}>
              <Accordion.Item eventKey={`${season.season}`}>
                <Accordion.Header className={koulen.className}>
                  {season.season}
                </Accordion.Header>
                <Accordion.Body>
                  <SeasonItem
                    season={season}
                    logoStyle={logoStyle}
                    onCompareManager={onCompareManager}
                    chosenSeason={chosenSeason}
                    chosenTeam2={chosenTeam2}
                    leagueType={leagueType}
                    accessToken={accessToken}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          );
        })
    : null;
}
