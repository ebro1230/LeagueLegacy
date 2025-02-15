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
import { Koulen } from "@next/font/google";
const koulen = Koulen({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

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
      className="no-leagues-background"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage.src})` : null,
      }}
    >
      <Col xs={10} sm={4} className="no-league-col">
        <p className={`no-league-div ${koulen.className}`}>
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
