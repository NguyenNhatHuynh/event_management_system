import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'; // Sử dụng NavLink thay vì Link để hỗ trợ active
import '../assets/styles/Client.css';

function ClientNavbar() {
    return (
        <Navbar expand="lg" className="client-navbar" sticky="top">
            <Container>
                <Navbar.Brand as={NavLink} to="/">EventPro</Navbar.Brand>
                <Navbar.Toggle aria-controls="client-nav" />
                <Navbar.Collapse id="client-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                            Home
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                            About
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/event-types" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Services
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/portfolio" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Portfolio
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/blog" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Blog
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Contact
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Login
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default ClientNavbar;