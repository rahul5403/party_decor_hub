import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
} from "react-icons/fa";
import "../assets/styles/Footer.css"
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                {/* Subscribe Section */}
                <Row className="text-center mb-5">
                    <Col>
                        <h4>Subscribe to our emails</h4>
                        <div className="subscribe-form d-flex justify-content-center align-items-center">
                            <input
                                type="email"
                                placeholder="Email"
                                className="form-control"
                            />
                            <button className="btn btn-dark ml-2">→</button>
                        </div>
                    </Col>
                </Row>

                {/* Main Footer Section */}
                <Row className="mb-5">
                    {/* Company Info */}
                    <Col md={4} className="mb-4">
                        <div className="logo">DECOR <span>HUB</span></div>
                        <p>Made from plants, Made for all</p>
                        <div className="contact-info">
                            <p>
                                <FaMapMarkerAlt className="mr-2" />
                                A-800, GD colony, Mayur Vihar Phase-3
                                DELHI -110096
                                Contact - 7011676961
                            </p>
                            <p>
                                <FaEnvelope className="mr-2" />
                                <a href="#">info@gmail.com</a>
                            </p>
                            <p>
                                <FaPhoneAlt className="mr-2" />
                                <a href="tel:+9123445566">+91 912344 5566</a>
                            </p>
                        </div>
                    </Col>

                    {/* Shop Links */}
                    <Col md={4}>
                        <h5>Services</h5>
                        <ul>
                            <li>
                                <Link to="/party" className="nav-link">Party</Link>
                            </li>
                            <li>
                                <Link to="/decoration" className="nav-link">Decoration</Link>
                            </li>
                            <li>
                                <Link to="/disposable" className="nav-link">Disposable</Link>
                            </li>
                        </ul>
                    </Col>

                    {/* Company Links */}
                    <Col md={4}>
                        <h5>About Us</h5>
                        <ul>
                            <li><a href="#">Our Mission</a></li>
                            <li><a href="#">Impact</a></li>
                        </ul>
                    </Col>
                </Row>

                {/* Footer Bottom Section */}
                <Row className="footer-bottom align-items-center">
                    <Col md={4} className="text-center text-md-left mb-3 mb-md-0">
                        <div className="social-icons">
                            <a href="#"><FaFacebookF /></a>
                            <a href="#"><FaInstagram /></a>
                            <a href="#"><FaYoutube /></a>
                        </div>
                    </Col>

                    <Col md={4} className="text-center mb-3 mb-md-0">
                        <p>2025 Copyright <div className="logo">DECOR <span>HUB</span></div></p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
