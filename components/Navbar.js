"use client"; // Indicates that this component is a client component
import { useSession, signOut } from "next-auth/react"; // Import useSession and signOut
//import Link from "next/link"; // Import Link for navigation
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";

function NavigationBar() {
  const { data: session } = useSession(); // Access session data
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">League Legacy</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
          <Nav className="me-auto">
            <NavDropdown title="Leagues" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="/sport/football">
                Football
              </NavDropdown.Item>
              <NavDropdown.Item href="/sport/hockey">Hockey</NavDropdown.Item>
              <NavDropdown.Item href="/sport/basketball">
                Basketball
              </NavDropdown.Item>
              <NavDropdown.Item href="/sport/baseball">
                Baseball
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
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
