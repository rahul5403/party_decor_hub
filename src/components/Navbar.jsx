import React, { useState } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import "../assets/styles/Navbar.css";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import toast from "react-hot-toast";
import axios from "axios";

const NavBar = ({ onLoginClick}) => {
  const cartCount = useSelector((state) => state.cart.cartCount);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
  
      if (token) {
        await axios.post("https://partydecorhub.com/api/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      dispatch(logout());
      toast.success("Logout successful!");
    } catch (error) {
      toast.error("Logout failed, please try again.");
    }
  };
  

  const handleUserIconClick = () => {
    if (!isAuthenticated) {
      onLoginClick(); // Open Login2 popup
    }
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="shadow-sm navbar-custom"
      expanded={expanded}
    >
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
            <Link to="/home" className="nav-link" onClick={handleNavLinkClick}>
              Home
            </Link>
            <Link to="/party" className="nav-link" onClick={handleNavLinkClick}>
              Decoration Items
            </Link>
            <Link
              to="/decoration"
              className="nav-link"
              onClick={handleNavLinkClick}
            >
              Decoration Services
            </Link>
            <Link
              to="/disposable"
              className="nav-link"
              onClick={handleNavLinkClick}
            >
              Disposable Items
            </Link>
            <Link to="/about" className="nav-link" onClick={handleNavLinkClick}>
              About Us
            </Link>
          </Nav>
        </Navbar.Collapse>

        <div className="d-flex align-items-center">
          {/* User Icon */}
          <div className="nav-user-icon">
            {isAuthenticated ? (
              <Dropdown>
                <Dropdown.Toggle
                  id="user-dropdown"
                  className="user-icon-dropdown"
                >
                  <FaUserCircle size={30} />
                </Dropdown.Toggle>

                <Dropdown.Menu className="user-dropdown-menu">
                  <Dropdown.Item as={Link} to="/profile">
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">
                    My Orders
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div
                className="user-icon p-1"
                onClick={handleUserIconClick} // Open Login2 popup on click
                style={{ cursor: "pointer" }} // Add pointer cursor
              >
                <FaUserCircle size={30} />
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <div>
            <Link to="/cart" className="nav-link cart-icon p-1">
              <FaShoppingCart size={30} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;