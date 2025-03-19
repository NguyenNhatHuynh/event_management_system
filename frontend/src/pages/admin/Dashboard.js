import React from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import '../../assets/styles/Admin.css';

function Dashboard() {
    return (
        <Container fluid className="admin-container">
            <Row>
                <Col md={3} className="admin-sidebar">
                    <Nav className="flex-column">
                        <Nav.Link as="a" href="/admin">Dashboard</Nav.Link>
                        <Nav.Link as="a" href="/admin/customers">Customer Management</Nav.Link>
                    </Nav>
                </Col>
                <Col md={9}>
                    <h1 className="mb-4">Admin Dashboard</h1>
                    <Row>
                        <Col md={4}>
                            <Card className="admin-card mb-4">
                                <Card.Body>
                                    <Card.Title>Total Events</Card.Title>
                                    <Card.Text className="display-6">50</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="admin-card mb-4">
                                <Card.Body>
                                    <Card.Title>Revenue</Card.Title>
                                    <Card.Text className="display-6">500M VND</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="admin-card mb-4">
                                <Card.Body>
                                    <Card.Title>Upcoming Events</Card.Title>
                                    <Card.Text className="display-6">5</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;