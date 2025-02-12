"use client";

import football from "@/assets/Fantasy-Football.png";
import hockey from "@/assets/Fantasy-Hockey.png";
import basketball from "@/assets/Fantasy-Basketball.png";
import baseball from "@/assets/Fantasy-Baseball.png";
import eagles from "@/assets/Eagles.png";
import oilers from "@/assets/Oilers.jpg";
import sixers from "@/assets/Sixers.jpg";
import yankees from "@/assets/Yankees.jpg";
import background from "@/assets/Homepage-Background.jpg";
import Image from "next/image";
import LeaguesGrid from "@/components/leagues-grid";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
  let noLeagueDataBackgroundImage = "";
  if (leagueType === "football") {
    imageSource = football;
    noLeagueDataBackgroundImage = eagles;
  } else if (leagueType === "hockey") {
    imageSource = hockey;
    noLeagueDataBackgroundImage = oilers;
  } else if (leagueType === "basketball") {
    imageSource = basketball;
    noLeagueDataBackgroundImage = sixers;
  } else if (leagueType === "baseball") {
    imageSource = baseball;
    noLeagueDataBackgroundImage = yankees;
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
    // <div
    //   style={{
    //     backgroundImage: background ? `url(${background.src})` : none,
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //     minHeight: "100vh",
    //   }}
    // >
    //   <div className="league-type-div">
    //     {imageSource ? (
    //       <Image
    //         src={imageSource}
    //         height={60}
    //         placeholder="blur"
    //         //style={logoStyle}
    //         alt={`Picture for fantasy ${params.sportSlug} league`}
    //       />
    //     ) : (
    //       <h1>Not a valid fantasy leauge</h1>
    //     )}
    //   </div>
    //   <div className="title-div">
    //     <h2 className={koulen.className}>
    //       Fantasy {leagueType.charAt(0).toUpperCase() + leagueType.slice(1)}{" "}
    //       League Legacy
    //     </h2>
    //   </div>
    <>
      {loading ? (
        <>
          <div
            style={{
              backgroundImage: background ? `url(${background.src})` : none,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
            }}
          >
            <div className="league-type-div">
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
                Fantasy{" "}
                {leagueType.charAt(0).toUpperCase() + leagueType.slice(1)}{" "}
                League Legacy
              </h2>
            </div>
            <div className="loading-div">
              <LoadingIndicator>
                <span className="visually-hidden">Loading...</span>
              </LoadingIndicator>
            </div>
          </div>
        </>
      ) : leagues.length ? (
        <>
          <div
            style={{
              backgroundImage: background ? `url(${background.src})` : none,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
            }}
          >
            <div className="league-type-div">
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
                Fantasy{" "}
                {leagueType.charAt(0).toUpperCase() + leagueType.slice(1)}{" "}
                League Legacy
              </h2>
            </div>
            <div>
              <LeaguesGrid leagues={leagues} leagueType={leagueType} />
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            backgroundImage: noLeagueDataBackgroundImage
              ? `url(${noLeagueDataBackgroundImage.src})`
              : none,
            width: "1440px",
            height: "844px",
            gap: "48px",
            paddingTop: "80px",
            paddingRight: "160px",
            paddingBottom: "80px",
            paddingLeft: "160px",
          }}
        >
          <p
            className={`no-league-div ${koulen.className}`}
            style={{
              paddingTop: "20rem",
              width: "50%",
              paddingLeft: "15rem",
              fontSize: "36px",
            }}
          >
            Sorry, you are not part of any fantasy {leagueType} leagues
          </p>
          <button>Go Back</button>
        </div>
      )}
    </>
  );
}
