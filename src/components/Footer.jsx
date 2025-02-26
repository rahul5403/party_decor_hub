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
        <footer className="footer p-3">
            <Container>

                {/* Main Footer Section */}
                <Row >
                    {/* Company Info */}
                    <Col md={4} >
                        <div className="logo-f"><span>PARTY</span> DECOR <span>HUB</span></div>
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
                                <Link to="/party" className="nav-link">Decoration Items</Link>
                            </li>
                            <li>
                                <Link to="/decoration" className="nav-link">Decoration Services</Link>
                            </li>
                            <li>
                                <Link to="/disposable" className="nav-link">Disposable Items</Link>
                            </li>
                        </ul>
                    </Col>

                    {/* Company Links */}
                    <Col md={4}>
                        <h5>About Us</h5>
                        <ul>
                            <li><a href="/about">Our Mission</a></li>
                            <li><a href="/about">Impact</a></li>
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
                         <div className="logo-f"> <span>PARTY</span> DECOR <span>HUB</span></div>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center">
                        <p className="made-with-love">Made with ❤️ by <a href="https://pixeladsmedia.com" target="_blank" rel="noopener noreferrer">Pixel AI Media</a> </p>
                        <p>Copyright © 2025 </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
