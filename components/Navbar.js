"use client"; // Indicates that this component is a client component
import { useSession, signOut } from "next-auth/react"; // Import useSession and signOut
//import Link from "next/link"; // Import Link for navigation
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import football from "@/assets/Navbar-Football.png";
import hockey from "@/assets/Navbar-Hockey.png";
import basketball from "@/assets/Navbar-Basketball.png";
import baseball from "@/assets/Navbar-Baseball.png";
import { Koulen } from "@next/font/google";
const koulen = Koulen({
  subsets: ["latin"], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ["400"], // Include specific font weights
});
function NavigationBar() {
  const { data: session } = useSession(); // Access session data

  return (
    <Navbar
      collapseOnSelect
      expand="md"
      className="bg-body-tertiary"
      bg="custom"
      variant="dark"
    >
      <Container>
        <Navbar.Brand href="/" className={koulen.className}>
          League Legacy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="navbar-league-div">
            <Nav.Link
              href="/sport/football"
              className={koulen.className}
              id="nav-football"
            >
              <Image
                src={football}
                height={20}
                placeholder="blur"
                //style={logoStyle}
                alt={`Picture for fantasy football league`}
              />{" "}
              Football
            </Nav.Link>
            <Nav.Link
              href="/sport/hockey"
              className={koulen.className}
              id="nav-hockey"
            >
              <Image
                src={hockey}
                height={20}
                placeholder="blur"
                //style={logoStyle}
                alt={`Picture for fantasy hockey league`}
              />{" "}
              Hockey
            </Nav.Link>
            <Nav.Link
              href="/sport/basketball"
              className={koulen.className}
              id="nav-basketball"
            >
              <Image
                src={basketball}
                height={20}
                placeholder="blur"
                //style={logoStyle}
                alt={`Picture for fantasy basketball league`}
              />{" "}
              Basketball
            </Nav.Link>
            <Nav.Link
              href="/sport/baseball"
              className={koulen.className}
              id="nav-baseball"
            >
              <Image
                src={baseball}
                height={20}
                placeholder="blur"
                //style={logoStyle}
                alt={`Picture for fantasy baseball league`}
              />{" "}
              Baseball
            </Nav.Link>
          </Nav>
          <Nav className="signin-div">
            {session && session.expires > Date.now() ? ( // If session exists
              <Nav.Link onClick={() => signOut()}>Sign Out</Nav.Link>
            ) : (
              <Nav.Link href="/api/auth/signin">Sign in</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
