"use client";

import football from "@/assets/Fantasy-Football.png";
import hockey from "@/assets/Fantasy-Hockey.png";
import basketball from "@/assets/Fantasy-Basketball.png";
import baseball from "@/assets/Fantasy-Baseball.png";
import background from "@/assets/Homepage-Background.jpg";
import Image from "next/image";
import LeaguesGrid from "@/components/leagues-grid";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "react-bootstrap/Spinner";
import LoadingIndicator from "@/components/loading-indicator";
import { useRouter } from "next/navigation";
import { Koulen } from "@next/font/google";
const koulen = Koulen({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

export default function SportPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const leagueType = params.sportSlug;
  let imageSource = "";
  if (leagueType === "football") {
    imageSource = football;
  } else if (leagueType === "hockey") {
    imageSource = hockey;
  } else if (leagueType === "basketball") {
    imageSource = basketball;
  } else if (leagueType === "baseball") {
    imageSource = baseball;
  } else {
    imageSource = "";
  }
  const logoStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
    margin: "1.5rem",
  };

  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGetLeagues = (leagueType, accessToken) => {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/yahooAuth/user-leagues`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: accessToken,
            leagueType: leagueType,
          }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              const error = new Error(
                errorData.message || "Failed to fetch data"
              );
              error.status = errorData.status;
              throw error;
            });
          }
          return response.json();
        })
        .then((leagueData) => {
          setLeagues(leagueData);
        })
        .catch((error) => {
          // console.log("ERROR");
          // console.log(
          //   `ERROR MESSAGE: ${error.message} & ERROR STATUS: ${error.status}`
          // );
          // console.log(error);
          router.push(
            `/error?message=${encodeURIComponent(
              error.message
            )}&status=${encodeURIComponent(error.status)}`
          );
        })
        .finally(() => {
          setLoading(false);
        });
    };
    if (status === "unauthenticated" || session.expires < Date.now()) {
      setLoading(false);
      return <h1>Please Sign In</h1>;
    } else if (status === "authenticated") {
      handleGetLeagues(leagueType, session.accessToken);
    } else {
      setLoading(true);
    }
  }, [status]);

  return (
    <div
      style={{
        backgroundImage: background ? `url(${background.src})` : none,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="specific-league-logo-div">
        {imageSource ? (
          <Image
            src={imageSource}
            height={60}
            placeholder="blur"
            //style={logoStyle}
            alt={`Picture for fantasy ${params.sportSlug} league`}
          />
        ) : (
          <h1>Not a valid fantasy leauge</h1>
        )}
      </div>
      <div className="title-div">
        <h2 className={koulen.className}>
          Fantasy {leagueType.charAt(0).toUpperCase() + leagueType.slice(1)}{" "}
          League Legacy
        </h2>
      </div>

      {loading ? (
        <div className="loading-div">
          <LoadingIndicator>
            <span className="visually-hidden">Loading...</span>
          </LoadingIndicator>
        </div>
      ) : leagues.length ? (
        <div>
          <LeaguesGrid leagues={leagues} leagueType={leagueType} />
        </div>
      ) : (
        <div>
          <h1>No League Data Found</h1>
        </div>
      )}
    </div>
  );
}
