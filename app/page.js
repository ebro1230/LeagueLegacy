"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import fantasyFootball from "@/assets/Fantasy-Football.png";
import fantasyHockey from "@/assets/Fantasy-Hockey.png";
import fantasyBasketball from "@/assets/Fantasy-Basketball.png";
import fantasyBaseball from "@/assets/Fantasy-Baseball.png";
import background from "@/assets/Homepage-Background.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Koulen } from "@next/font/google";
const koulen = Koulen({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

export default function Home() {
  //redirect("/signin");
  const logoStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
    margin: "1.5rem",
  };
  const { data: session, status } = useSession(); // Access session data
  if (status === "loading") {
    return (
      <div
        style={{
          backgroundImage: background ? `url(${background.src})` : none,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <div className="welcome-div">
          <h2 className={koulen.className}>LOADING SESSION DATA...</h2>
        </div>
      </div>
    );
  } else if (status === "unauthenticated" || session.expires < Date.now()) {
    return (
      <div
        style={{
          backgroundImage: background ? `url(${background.src})` : none,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <div className="welcome-div">
          <h2 className={koulen.className}>WELCOME TO LEAGUE LEGACY</h2>
          <div className="signin-div">
            <a href="/api/auth/signin" className={koulen.className}>
              SIGN IN
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    console.log(session);
    return (
      <div
        style={{
          backgroundImage: background ? `url(${background.src})` : none,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <div className="welcome-div">
          <h2 className={koulen.className}>
            Welcome Back, {session.user.name}
          </h2>
        </div>
        <div className="select-league-div">
          <h3 className={koulen.className}>Select Your Fantasy League</h3>
        </div>
        <div className="league-logo-div">
          <Link href={`/sport/football`}>
            <Image
              src={fantasyFootball}
              height={150}
              placeholder="blur"
              //style={logoStyle}
              alt="Picture for Fantasy Football Leagues"
            />
          </Link>
          <Link href={`/sport/hockey`}>
            <Image
              src={fantasyHockey}
              placeholder="blur"
              height={150}
              //style={logoStyle}
              alt="Picture for Fantasy Hockey Leagues"
            />
          </Link>
          <Link href={`/sport/basketball`}>
            <Image
              src={fantasyBasketball}
              height={150}
              placeholder="blur"
              //style={logoStyle}
              alt="Picture for Fantasy Basketball Leagues"
            />
          </Link>
          <Link href={`/sport/baseball`}>
            <Image
              src={fantasyBaseball}
              height={150}
              placeholder="blur"
              //style={logoStyle}
              alt="Picture for Fantasy Baseball Leagues"
            />
          </Link>
        </div>
      </div>
    );
  }
}
