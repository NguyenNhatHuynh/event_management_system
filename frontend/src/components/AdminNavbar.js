import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AdminNavbar() {
    return (
        <Navbar bg="light" expand="lg" className="shadow-sm">
            <Container fluid>
                <Navbar.Brand as={Link} to="/admin">Admin - EventPro</Navbar.Brand>
                <Navbar.Toggle aria-controls="admin-nav" />
                <Navbar.Collapse id="admin-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/admin/customers">Customers</Nav.Link>
                        <Nav.Link as={Link} to="/">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AdminNavbar;