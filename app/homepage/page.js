"use client";
import { createCookie } from "@/actions/cookies";
import { useEffect, useState } from "react";
import Image from "next/image";
import fantasyFootball from "@/assets/Fantasy-Football.png";
import fantasyHockey from "@/assets/Fantasy-Hockey.png";
import fantasyBasketball from "@/assets/Fantasy-Basketball.png";
import fantasyBaseball from "@/assets/Fantasy-Baseball.png";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomePage({ searchParams }) {
  const logoStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
    margin: "1.5rem",
  };
  const { data: session } = useSession(); // Access session data
  console.log(session);

  const [user, setUser] = useState({});
  useEffect(() => {
    const code = searchParams.code.toString();
    async function handleGetToken() {
      fetch(`http://localhost:8000/api/yahooAuth/token-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
          code: code,
          grant_type: "authorization_code",
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `HTTP error when requesting tokens! status: ${response.status}`
            );
          }
          return response.json();
        })
        .then((tokens) => {
          createCookie(tokens);
          fetch(`http://localhost:8000/api/yahooAuth/user-info`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken: tokens.access_token }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `HTTP error when requesting user info! status: ${response.status}`
                );
              }
              return response.json();
            })
            .then((userData) => {
              setUser(userData);
            })
            .catch((error) => {
              console.error("Error parsing JSON or network issue:", error);
            });
          // .then(() => {
          //   createCookie(yahooTokens);
          // });
        });
    }
    //handleGetToken();
  }, []);

  return (
    <>
      <div className="title-div">
        <h1>League Legacy</h1>
      </div>
      <div className="welcome-div">
        {user.name ? (
          <>
            <h2>Welcome Back,</h2>

            <h2>{user.nickname}</h2>
          </>
        ) : (
          <>
            <h2>Welcome Back,</h2>

            <h2> </h2>
          </>
        )}
      </div>
      <div className="league-logo-div">
        <Link href={`/sport/football`}>
          <Image
            src={fantasyFootball}
            height={120}
            placeholder="blur"
            style={logoStyle}
            alt="Picture for Fantasy Football Leagues"
          />
        </Link>
        <Link href={`/sport/hockey`}>
          <Image
            src={fantasyHockey}
            placeholder="blur"
            height={120}
            style={logoStyle}
            alt="Picture for Fantasy Hockey Leagues"
          />
        </Link>
        <Link href={`/sport/basketball`}>
          <Image
            src={fantasyBasketball}
            height={120}
            placeholder="blur"
            style={logoStyle}
            alt="Picture for Fantasy Basketball Leagues"
          />
        </Link>
        <Link href={`/sport/baseball`}>
          <Image
            src={fantasyBaseball}
            height={120}
            placeholder="blur"
            style={logoStyle}
            alt="Picture for Fantasy Baseball Leagues"
          />
        </Link>
      </div>
      {/* <button onClick={handleViewAccessToken}>View Access Token</button>
      <button onClick={handleFetchUserData}>Get User Data</button>
      <button onClick={handleFetchLeagueData}>Get League Data</button>
      <button onClick={handleGetNewToken}>Get New Token</button>
      <button onClick={handleFetchUserInfo}>Get User Info</button> */}
    </>
  );
}
