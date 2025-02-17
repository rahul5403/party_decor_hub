import React from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import "../assets/styles/Navbar.css"
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBar = () => {
  const cartCount = useSelector(state => state.cart.cartCount);

  return (
    <Navbar bg="light" expand="lg" className="py-3 shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand href="/">
          <div className="logo">DECOR <span>HUB</span></div>
        </Navbar.Brand>

        {/* Mobile Toggle Button */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Collapsible Navigation */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto d-flex align-items-center">
          <Link
              to="/home"
              className="nav-link"
            >
              Home
            </Link>
            <Link
              to="/party"
              className="nav-link"
            >
              Party
            </Link>
            <Link
              to="/decoration"
              className="nav-link"
            >
              Decoration
            </Link>
            <Link
              to="/disposable"
              className="nav-link"
            >
              Disposable
            </Link>
            <Link
              to="/about"
              className="nav-link"
            >
              About Us
            </Link>
            {/* Account Links */}
          </Nav>
        </Navbar.Collapse>
        <div className="d-flex align-items-center">
          <Button href="/login" className="mr-3 button-login mx-2">
            Log In
          </Button>
          <Button href="/signup" className="mr-3 button-login mx-2">
            Sign Up
          </Button>
          {/* <Link to="/login" className="btn btn-primary mx-2">Login</Link>
          <Link to="/signup" className="btn btn-outline-primary mx-2">Sign Up</Link> */}

<Link to="/cart" className="nav-link d-flex align-items-center cart-icon">
                        <FaShoppingCart className="mr-1" size={36} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
        </div>
      </Container >
    </Navbar >
  );
};

export default NavBar;
