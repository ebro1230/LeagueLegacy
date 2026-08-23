"use client"; // Indicates that this component is a client component
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import { Koulen } from "@next/font/google";
const koulen = Koulen({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});

function Footer() {
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary"
      bg="custom"
      variant="dark"
      style={{ overflow: "hidden" }}
    >
      <Container style={{ justifyContent: "flex-end" }}>
        <Navbar.Brand
          style={{
            fontSize: "0.5rem",
            color: "white",
            textAlign: "end",
            marginRight: "50px",
          }}
        >
          Fantasy data provided by Yahoo Fantasy
        </Navbar.Brand>
        <Image
          src={`https://763445962456-brand-assets.s3.us-west-2.amazonaws.com/brandwebsite/s3fs-public/Yahoo_Fantasy.svg`}
          width={200}
          height={200}
          placeholder="blur"
          objectFit="contain"
          alt={`Yahoo! Fantasy Logo`}
          style={{ position: "absolute", right: "0" }}
        />
      </Container>
    </Navbar>
  );
}

export default Footer;
