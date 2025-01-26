"use client";
import Image from "next/image";
import Table from "react-bootstrap/Table";
import { Inter } from "@next/font/google";
const inter = Inter({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

export default function ManagerItem({
  manager,
  currentYear,
  logoStyle,
  chosenSeason,
}) {
  return (
    <>
      <td className={`${inter.className} small-table-data`}>
        {manager.rank.rank}
      </td>
      <td className={`${inter.className} small-table-data`}>
        {manager.logo ? (
          <Image
            src={manager.logo}
            width={35}
            height={35}
            style={logoStyle}
            alt={`${manager.name}'s Logo`}
          />
        ) : (
          <h1>No valid team logo</h1>
        )}
      </td>
      <td className={`${inter.className} small-table-data`}>
        {manager.managerName}
      </td>
      <td className={`${inter.className} small-table-data`}>{manager.name}</td>
      {chosenSeason.year === "Overall" ? (
        <>
          <td className={`${inter.className} small-table-data`}>
            {manager.championships.length}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.championships.length > 0 ? (
              manager.championships.map((championship) => {
                return (
                  <p key={championship.seasonYear}>{championship.seasonYear}</p>
                );
              })
            ) : (
              <p>N/A</p>
            )}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.bestFinish[0].rank}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.bestFinish.map((finish) => {
              return <p key={finish.seasonYear}>{finish.seasonYear}</p>;
            })}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.worstFinish[0].rank}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.worstFinish.map((finish) => {
              return <p key={finish.seasonYear}>{finish.seasonYear}</p>;
            })}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].playoffSeasonRecord.playoffAppearances.length
            }
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].playoffSeasonRecord.playoffAppearances.length > 0 ? (
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].playoffSeasonRecord.playoffAppearances.map((playoffSeason) => {
                return <p key={playoffSeason}>{playoffSeason}</p>;
              })
            ) : (
              <p>N/A</p>
            )}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].consolationSeasonRecord.consolationAppearances.length
            }
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].consolationSeasonRecord.consolationAppearances.length > 0 ? (
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].consolationSeasonRecord.consolationAppearances.map(
                (consolationSeason) => {
                  return <p key={consolationSeason}>{consolationSeason}</p>;
                }
              )
            ) : (
              <p>N/A</p>
            )}
          </td>
        </>
      ) : null}
      {chosenSeason.year === "Overall" ? (
        <>
          <td className={`${inter.className} small-table-data`}>
            <p>
              {
                manager.overallCumulativeRecord[
                  manager.overallCumulativeRecord.length - 1
                ].regularSeasonRecord.wins
              }
              -
              {
                manager.overallCumulativeRecord[
                  manager.overallCumulativeRecord.length - 1
                ].regularSeasonRecord.losses
              }
              -
              {
                manager.overallCumulativeRecord[
                  manager.overallCumulativeRecord.length - 1
                ].regularSeasonRecord.ties
              }
            </p>
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].regularSeasonRecord.wins +
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].regularSeasonRecord.losses +
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].regularSeasonRecord.ties >
            0
              ? (
                  (manager.overallCumulativeRecord[
                    manager.overallCumulativeRecord.length - 1
                  ].regularSeasonRecord.wins /
                    (manager.overallCumulativeRecord[
                      manager.overallCumulativeRecord.length - 1
                    ].regularSeasonRecord.wins +
                      manager.overallCumulativeRecord[
                        manager.overallCumulativeRecord.length - 1
                      ].regularSeasonRecord.losses +
                      manager.overallCumulativeRecord[
                        manager.overallCumulativeRecord.length - 1
                      ].regularSeasonRecord.ties)) *
                  100
                ).toFixed(2)
              : 0.0}
            %
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].regularSeasonRecord.pointsFor.toFixed(2)}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].regularSeasonRecord.pointsAgainst.toFixed(2)}
          </td>
          <td
            className={`${inter.className} small-table-data ${
              (
                manager.overallCumulativeRecord[
                  manager.overallCumulativeRecord.length - 1
                ].regularSeasonRecord.pointsFor -
                manager.overallCumulativeRecord[
                  manager.overallCumulativeRecord.length - 1
                ].regularSeasonRecord.pointsAgainst
              ).toFixed(2) > 0
                ? "positive-differential"
                : (
                    manager.overallCumulativeRecord[
                      manager.overallCumulativeRecord.length - 1
                    ].regularSeasonRecord.pointsFor -
                    manager.overallCumulativeRecord[
                      manager.overallCumulativeRecord.length - 1
                    ].regularSeasonRecord.pointsAgainst
                  ).toFixed(2) < 0
                ? "negative-differential"
                : ""
            }`}
          >
            {(
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].regularSeasonRecord.pointsFor -
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].regularSeasonRecord.pointsAgainst
            )
              .toFixed(2)
              .toLocaleString("en-US", { signDisplay: "always" })}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].playoffSeasonRecord.wins
            }
            -
            {
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].playoffSeasonRecord.losses
            }
            -
            {
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].playoffSeasonRecord.ties
            }
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].playoffSeasonRecord.wins +
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].playoffSeasonRecord.losses +
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].playoffSeasonRecord.ties >
            0
              ? (
                  (manager.overallCumulativeRecord[
                    manager.overallCumulativeRecord.length - 1
                  ].playoffSeasonRecord.wins /
                    (manager.overallCumulativeRecord[
                      manager.overallCumulativeRecord.length - 1
                    ].playoffSeasonRecord.wins +
                      manager.overallCumulativeRecord[
                        manager.overallCumulativeRecord.length - 1
                      ].playoffSeasonRecord.losses +
                      manager.overallCumulativeRecord[
                        manager.overallCumulativeRecord.length - 1
                      ].playoffSeasonRecord.ties)) *
                  100
                ).toFixed(2)
              : 0.0}
            %
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].playoffSeasonRecord.pointsFor
              ? manager.overallCumulativeRecord[
                  manager.overallCumulativeRecord.length - 1
                ].playoffSeasonRecord.pointsFor.toFixed(2)
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].playoffSeasonRecord.pointsAgainst
              ? manager.overallCumulativeRecord[
                  manager.overallCumulativeRecord.length - 1
                ].playoffSeasonRecord.pointsAgainst.toFixed(2)
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].playoffSeasonRecord.pointsFor -
            manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].playoffSeasonRecord.pointsAgainst
              ? (
                  manager.overallCumulativeRecord[
                    manager.overallCumulativeRecord.length - 1
                  ].playoffSeasonRecord.pointsFor -
                  manager.overallCumulativeRecord[
                    manager.overallCumulativeRecord.length - 1
                  ].playoffSeasonRecord.pointsAgainst
                ).toFixed(2)
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].consolationSeasonRecord.wins
            }
            -
            {
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].consolationSeasonRecord.losses
            }
            -
            {
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].consolationSeasonRecord.ties
            }
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].consolationSeasonRecord.wins +
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].consolationSeasonRecord.losses +
              manager.overallCumulativeRecord[
                manager.overallCumulativeRecord.length - 1
              ].consolationSeasonRecord.ties >
            0
              ? (
                  (manager.overallCumulativeRecord[
                    manager.overallCumulativeRecord.length - 1
                  ].consolationSeasonRecord.wins /
                    (manager.overallCumulativeRecord[
                      manager.overallCumulativeRecord.length - 1
                    ].consolationSeasonRecord.wins +
                      manager.overallCumulativeRecord[
                        manager.overallCumulativeRecord.length - 1
                      ].consolationSeasonRecord.losses +
                      manager.overallCumulativeRecord[
                        manager.overallCumulativeRecord.length - 1
                      ].consolationSeasonRecord.ties)) *
                  100
                ).toFixed(2)
              : 0.0}
            %
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].consolationSeasonRecord.pointsFor
              ? manager.overallCumulativeRecord[
                  manager.overallCumulativeRecord.length - 1
                ].consolationSeasonRecord.pointsFor.toFixed(2)
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].consolationSeasonRecord.pointsAgainst
              ? manager.overallCumulativeRecord[
                  manager.overallCumulativeRecord.length - 1
                ].consolationSeasonRecord.pointsAgainst.toFixed(2)
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].consolationSeasonRecord.pointsFor -
            manager.overallCumulativeRecord[
              manager.overallCumulativeRecord.length - 1
            ].consolationSeasonRecord.pointsAgainst
              ? (
                  manager.overallCumulativeRecord[
                    manager.overallCumulativeRecord.length - 1
                  ].consolationSeasonRecord.pointsFor -
                  manager.overallCumulativeRecord[
                    manager.overallCumulativeRecord.length - 1
                  ].consolationSeasonRecord.pointsAgainst
                ).toFixed(2)
              : 0}
          </td>
        </>
      ) : (
        <>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.regularSeasonRecord.wins} -
            {manager.cumulativeRecord.regularSeasonRecord.losses} -
            {manager.cumulativeRecord.regularSeasonRecord.ties}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.regularSeasonRecord.wins +
              manager.cumulativeRecord.regularSeasonRecord.losses +
              manager.cumulativeRecord.regularSeasonRecord.ties >
            0
              ? (
                  (manager.cumulativeRecord.regularSeasonRecord.wins /
                    (manager.cumulativeRecord.regularSeasonRecord.wins +
                      manager.cumulativeRecord.regularSeasonRecord.losses +
                      manager.cumulativeRecord.regularSeasonRecord.ties)) *
                  100
                ).toFixed(2)
              : 0.0}
            %
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.regularSeasonRecord.pointsFor
              ? manager.cumulativeRecord.regularSeasonRecord.pointsFor.toFixed(
                  2
                )
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.regularSeasonRecord.pointsAgainst
              ? manager.cumulativeRecord.regularSeasonRecord.pointsAgainst.toFixed(
                  2
                )
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.regularSeasonRecord.pointsFor -
            manager.cumulativeRecord.regularSeasonRecord.pointsAgainst
              ? (
                  manager.cumulativeRecord.regularSeasonRecord.pointsFor -
                  manager.cumulativeRecord.regularSeasonRecord.pointsAgainst
                ).toFixed(2)
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.playoffSeasonRecord.wins} -
            {manager.cumulativeRecord.playoffSeasonRecord.losses} -
            {manager.cumulativeRecord.playoffSeasonRecord.ties}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.playoffSeasonRecord.wins +
              manager.cumulativeRecord.playoffSeasonRecord.losses +
              manager.cumulativeRecord.playoffSeasonRecord.ties >
            0
              ? (
                  (manager.cumulativeRecord.playoffSeasonRecord.wins /
                    (manager.cumulativeRecord.playoffSeasonRecord.wins +
                      manager.cumulativeRecord.playoffSeasonRecord.losses +
                      manager.cumulativeRecord.playoffSeasonRecord.ties)) *
                  100
                ).toFixed(2)
              : 0.0}
            %
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.playoffSeasonRecord.pointsFor
              ? manager.cumulativeRecord.playoffSeasonRecord.pointsFor.toFixed(
                  2
                )
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.playoffSeasonRecord.pointsAgainst
              ? manager.cumulativeRecord.playoffSeasonRecord.pointsAgainst.toFixed(
                  2
                )
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.playoffSeasonRecord.pointsFor -
            manager.cumulativeRecord.playoffSeasonRecord.pointsAgainst
              ? (
                  manager.cumulativeRecord.playoffSeasonRecord.pointsFor -
                  manager.cumulativeRecord.playoffSeasonRecord.pointsAgainst
                ).toFixed(2)
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.consolationSeasonRecord.wins} -
            {manager.cumulativeRecord.consolationSeasonRecord.losses} -
            {manager.cumulativeRecord.consolationSeasonRecord.ties}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.consolationSeasonRecord.wins +
              manager.cumulativeRecord.consolationSeasonRecord.losses +
              manager.cumulativeRecord.consolationSeasonRecord.ties >
            0
              ? (
                  (manager.cumulativeRecord.consolationSeasonRecord.wins /
                    (manager.cumulativeRecord.consolationSeasonRecord.wins +
                      manager.cumulativeRecord.consolationSeasonRecord.losses +
                      manager.cumulativeRecord.consolationSeasonRecord.ties)) *
                  100
                ).toFixed(2)
              : 0.0}
            %
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.consolationSeasonRecord.pointsFor
              ? manager.cumulativeRecord.consolationSeasonRecord.pointsFor.toFixed(
                  2
                )
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.consolationSeasonRecord.pointsAgainst
              ? manager.cumulativeRecord.consolationSeasonRecord.pointsAgainst.toFixed(
                  2
                )
              : 0}
          </td>
          <td className={`${inter.className} small-table-data`}>
            {manager.cumulativeRecord.consolationSeasonRecord.pointsFor -
            manager.cumulativeRecord.consolationSeasonRecord.pointsAgainst
              ? (
                  manager.cumulativeRecord.consolationSeasonRecord.pointsFor -
                  manager.cumulativeRecord.consolationSeasonRecord.pointsAgainst
                ).toFixed(2)
              : 0}
          </td>
        </>
      )}
      {chosenSeason.year === "Overall" ? (
        <td className={`${inter.className} small-table-data`}>
          {manager.memberSince.seasonYear} -
          {manager.memberUntil === currentYear
            ? "Present"
            : manager.memberUntil.seasonYear}
        </td>
      ) : null}
    </>
  );
}
