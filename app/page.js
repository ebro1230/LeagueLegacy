"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import fantasyFootball from "@/assets/Fantasy-Football.png";
import fantasyHockey from "@/assets/Fantasy-Hockey.png";
import fantasyBasketball from "@/assets/Fantasy-Basketball.png";
import fantasyBaseball from "@/assets/Fantasy-Baseball.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
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
      <div className="welcome-div">
        <h1>LOADING SESSION DATA...</h1>
      </div>
    );
  } else if (status === "unauthenticated") {
    return (
      <div className="welcome-div">
        <h1>USER IS NOT AUTHENTICATED, PLEASE LOG IN</h1>
      </div>
    );
  } else {
    return (
      <>
        <div className="welcome-div">
          <h2>Welcome Back,</h2>

          <h2>{session.user.name}</h2>
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
      </>
    );
  }
}
