import { useState } from "react";
import RecordItem from "./record-item";
import Accordion from "react-bootstrap/Accordion";
import RecordItemSeason from "./record-item-season";

export default function RecordGrid({
  records,
  logoStyle,
  leagueType,
  chosenTeam,
}) {
  return records ? (
    <>
      {chosenTeam.managerName != "Overall" ? (
        <>
          <RecordItem
            record={records.biggestWin}
            logoStyle={logoStyle}
            recordName="Biggest Blowout (Win)"
            leagueType={leagueType}
          />
          <RecordItem
            record={records.biggestLoss}
            logoStyle={logoStyle}
            recordName="Biggest Blowout (Loss)"
            leagueType={leagueType}
          />
        </>
      ) : (
        <>
          <RecordItemSeason
            record={records.mostWins}
            logoStyle={logoStyle}
            recordName="Most Wins In A Season"
          />
          <RecordItemSeason
            record={records.mostLosses}
            logoStyle={logoStyle}
            recordName="Most Losses In A Season"
          />
          <RecordItemSeason
            record={records.winningStreak}
            logoStyle={logoStyle}
            recordName="Longest Winning Streak"
          />
          <RecordItemSeason
            record={records.losingStreak}
            logoStyle={logoStyle}
            recordName="Longest Losing Streak"
          />
          <RecordItemSeason
            record={records.mostPointsSeason}
            logoStyle={logoStyle}
            recordName="Most Points In A Season"
          />
          <RecordItemSeason
            record={records.leastPointsSeason}
            logoStyle={logoStyle}
            recordName="Least Points In A Season"
          />
          <RecordItemSeason
            record={records.mostPointsAgainstSeason}
            logoStyle={logoStyle}
            recordName="Most Points Against In A Season"
          />
          <RecordItemSeason
            record={records.leastPointsAgainstSeason}
            logoStyle={logoStyle}
            recordName="Least Points Against In A Season"
          />
          <RecordItem
            record={records.biggestWin}
            logoStyle={logoStyle}
            recordName="Biggest Blowout"
            leagueType={leagueType}
          />
        </>
      )}

      <RecordItem
        record={records.closestMatch}
        logoStyle={logoStyle}
        recordName="Closest Match (Non-Tie)"
        leagueType={leagueType}
      />
      <RecordItem
        record={records.highestScoreVSProjection}
        logoStyle={logoStyle}
        recordName="Highest Score vs. Projected Score"
        leagueType={leagueType}
      />
      <RecordItem
        record={records.mostAccurateProjection}
        logoStyle={logoStyle}
        recordName="Most Accurate Projected Score"
        leagueType={leagueType}
      />
      <RecordItem
        record={records.mostPointsGame}
        logoStyle={logoStyle}
        recordName="Most Points In A Game"
        leagueType={leagueType}
      />
      <RecordItem
        record={records.leastPointsGame}
        logoStyle={logoStyle}
        recordName="Least Points In A Game"
        leagueType={leagueType}
      />
      <RecordItem
        record={records.mostPointsInLoss}
        logoStyle={logoStyle}
        recordName="Most Points In A Loss"
        leagueType={leagueType}
      />
      <RecordItem
        record={records.leastPointsInWin}
        logoStyle={logoStyle}
        recordName="Least Points In A Win"
        leagueType={leagueType}
      />
    </>
  ) : (
    <p>No Available Records</p>
  );
}
