"use client";
import eagles from "@/assets/Eagles.png";
import oilers from "@/assets/Oilers.jpg";
import sixers from "@/assets/Sixers.jpg";
import yankees from "@/assets/Yankees.jpg";
import { useRouter } from "next/navigation";
import { Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/components/loading-indicator";

export default function NotFoundPage() {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    let randomNum = Math.floor(Math.random() * 4) + 1;
    if (randomNum === 1) {
      setBackgroundImage(eagles);
    } else if (randomNum === 2) {
      setBackgroundImage(oilers);
    } else if (randomNum === 3) {
      setBackgroundImage(sixers);
    } else if (randomNum === 4) {
      setBackgroundImage(yankees);
    }
    setIsLoading(false);
  }, []);
  return !isLoading ? (
    <div
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage.src})` : null,
        width: "100%",
        height: "100vh",
        gap: "48px",
        paddingTop: "80px",
        paddingRight: "160px",
        paddingBottom: "80px",
        paddingLeft: "160px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Col
        xs={12}
        sm={8}
        md={6}
        lg={4}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p
          className={`no-league-div ${koulen.className}`}
          style={{
            paddingTop: "20rem",
            width: "100%",
            fontSize: "clamp(24px, 2vw, 36px)",
            color: "white",
            textShadow:
              "-2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black, 2px 2px 0 black",
            textAlign: "center",
          }}
        >
          Sorry, the page you are looking for does not exist
        </p>
        <button
          style={{ width: "100%" }}
          onClick={() => {
            router.push("/");
          }}
        >
          Go Back to Homepage
        </button>
      </Col>
    </div>
  ) : (
    <div className="normal-background">
      <div className="spacing-div">
        <div className="loading-div">
          <LoadingIndicator>
            <span className="visually-hidden">Loading...</span>
          </LoadingIndicator>
        </div>
      </div>
    </div>
  );
}
