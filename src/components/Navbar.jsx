import React, { useState } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import "../assets/styles/Navbar.css";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const NavBar = () => {
  const cartCount = useSelector((state) => state.cart.cartCount);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  const handleLogout = () => {
    dispatch(logout()); 
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm navbar-custom" expanded={expanded}>
      <Container fluid>
        <Navbar.Toggle
          aria-controls="navbar-nav"
          className="custom-toggler"
          onClick={() => setExpanded(expanded ? false : true)}
        />

        <Navbar.Brand as={Link} to="/" className="logo mx-auto mx-lg-0">
          <span>PARTY </span>DECOR <span>HUB</span>
        </Navbar.Brand>

        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <Link to="/home" className="nav-link" onClick={handleNavLinkClick}>Home</Link>
            <Link to="/party" className="nav-link" onClick={handleNavLinkClick}>Party</Link>
            <Link to="/decoration" className="nav-link" onClick={handleNavLinkClick}>Decoration</Link>
            <Link to="/disposable" className="nav-link" onClick={handleNavLinkClick}>Disposable</Link>
            <Link to="/about" className="nav-link" onClick={handleNavLinkClick}>About Us</Link>
          </Nav>
        </Navbar.Collapse>
        
        <div className="rt">
          <div className="nav-user-icon">
            {isAuthenticated ? (
              <Dropdown>
                <Dropdown.Toggle id="user-dropdown" className="user-icon-dropdown">
                  <FaUserCircle size={30} />
                </Dropdown.Toggle>

                <Dropdown.Menu className="user-dropdown-menu">
                  <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">My Orders</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Link to="/login" className="user-icon p-1">
                <FaUserCircle size={30} />
              </Link>
            )}
          </div>
          {isAuthenticated && (
            <div>
              <Link to="/cart" className="nav-link cart-icon p-1">
                <FaShoppingCart size={30} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </div>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;