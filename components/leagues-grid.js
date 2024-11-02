//import MealItem from "./meal-item";

import Link from "next/link";
import Image from "next/image";

export default function LeaguesGrid({ leagues, leagueType }) {
  const date = new Date();
  const currentYear = date.getFullYear();
  const logoStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
    margin: "1.5rem",
    objectFit: "contain",
  };

  return (
    <>
      {leagues.map((league) => (
        <Link
          key={`${league.leagueKeys} + 1`}
          href={`/sport/${leagueType}/league/${league.leagueKeys}`}
        >
          <div className="league-div" key={league.leagueKeys}>
            {league.leagueLogo ? (
              <Image
                src={league.leagueLogo}
                width={120}
                height={120}
                style={logoStyle}
                alt={`${league.leagueName}'s Logo`}
              />
            ) : null}
            <p>League: {league.leagueName}</p>
            <p>Team Name: {league.teamName}</p>
            <p>
              {league.memberSince} -{" "}
              {league.memberUntil === currentYear
                ? "Present"
                : league.memberUntil}
            </p>
            <p>
              {league.wins} - {league.losses} - {league.ties}
            </p>
            <p>Win Percentage: {league.winPercentage}%</p>
            <p>Top Finish: {league.bestFinish}</p>
            <p>Bottom Finish: {league.worstFinish}</p>
          </div>
        </Link>
      ))}
    </>
  );
}
