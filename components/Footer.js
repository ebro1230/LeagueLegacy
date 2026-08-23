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
    >
      <Container>
        <Navbar.Brand href="/" className={koulen.className}>
          Fantasy data provided by Yahoo Fantasy
        </Navbar.Brand>
        <Image
          src={`https://763445962456-brand-assets.s3.us-west-2.amazonaws.com/brandwebsite/s3fs-public/Yahoo_Fantasy.svg`}
          height={20}
          placeholder="blur"
          //style={logoStyle}
          alt={`Picture for fantasy football league`}
        />
      </Container>
    </Navbar>
  );
}

export default Footer;
