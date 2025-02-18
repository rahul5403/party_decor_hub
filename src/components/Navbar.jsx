import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "../assets/styles/Navbar.css";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBar = () => {
  const cartCount = useSelector((state) => state.cart.cartCount);
  const [expanded, setExpanded] = useState(false);

  const handleNavLinkClick = () => {
    setExpanded(false); // Close the navbar when a link is clicked
  };

  return (
    <Navbar 
      bg="light" 
      expand="lg" 
      className="shadow-sm navbar-custom"
      expanded={expanded} 
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="logo">
        <span>PARTY </span>DECOR <span>HUB</span>
        </Navbar.Brand>

        {/* Mobile Toggle Button */}
        <Navbar.Toggle 
          aria-controls="navbar-nav" 
          className="custom-toggler" 
          onClick={() => setExpanded(expanded ? false : true)} 
        />

        {/* Collapsible Navigation */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <Link to="/home" className="nav-link" onClick={handleNavLinkClick}>Home</Link>
            <Link to="/party" className="nav-link" onClick={handleNavLinkClick}>Party</Link>
            <Link to="/decoration" className="nav-link" onClick={handleNavLinkClick}>Decoration</Link>
            <Link to="/disposable" className="nav-link" onClick={handleNavLinkClick}>Disposable</Link>
            <Link to="/about" className="nav-link" onClick={handleNavLinkClick}>About Us</Link>
          </Nav>
          <div className="d-flex align-items-center nav-buttons">
            <Button as={Link} to="/login" className="button-login">Log In</Button>
            <Button as={Link} to="/signup" className="button-login">Sign Up</Button>

            {/* Cart Icon */}
            <Link to="/cart" className="nav-link cart-icon">
              <FaShoppingCart size={30} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
