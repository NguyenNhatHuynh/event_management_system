import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../../assets/styles/Client.css';

function About() {
    return (
        <div>
            {/* About Us Section */}
            <section className="about-section">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h1>About Us</h1>
                            <p className="lead">
                                EventPro is a leading event management company with over 10 years of experience in creating unforgettable moments.
                            </p>
                            <p>
                                We specialize in a wide range of events, from elegant weddings to professional corporate conferences. Our team is dedicated to bringing your vision to life with creativity, precision, and passion.
                            </p>
                            <Button variant="primary" as="a" href="/contact">
                                Get in Touch
                            </Button>
                        </Col>
                        <Col md={6}>
                            <img
                                src="/assets/images/about-team.jpg"
                                alt="Our Team"
                                className="img-fluid"
                            />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Our Mission Section */}
            <section className="about-section bg-light">
                <Container>
                    <Row className="text-center">
                        <Col>
                            <h2>Our Mission</h2>
                            <p className="lead">
                                To deliver exceptional events that exceed expectations and create lasting memories.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Team Section */}
            <section className="about-section">
                <Container>
                    <h2 className="text-center mb-5">Meet Our Team</h2>
                    <Row>
                        <Col md={4} className="text-center">
                            <img
                                src="/assets/images/team1.jpg"
                                alt="Team Member 1"
                                className="img-fluid rounded-circle mb-3"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <h5>Anna Smith</h5>
                            <p>Event Planner</p>
                        </Col>
                        <Col md={4} className="text-center">
                            <img
                                src="/assets/images/team2.jpg"
                                alt="Team Member 2"
                                className="img-fluid rounded-circle mb-3"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <h5>John Doe</h5>
                            <p>Creative Director</p>
                        </Col>
                        <Col md={4} className="text-center">
                            <img
                                src="/assets/images/team3.jpg"
                                alt="Team Member 3"
                                className="img-fluid rounded-circle mb-3"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <h5>Lisa Brown</h5>
                            <p>Marketing Lead</p>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default About;