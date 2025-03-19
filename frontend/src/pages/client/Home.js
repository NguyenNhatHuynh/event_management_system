import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import EventSlider from '../../components/Slider';
import '../../assets/styles/Client.css';

function Home() {
    return (
        <div>
            <div
                className="client-hero"
                style={{
                    background: `linear-gradient(135deg, rgba(107, 72, 255, 0.8), rgba(0, 221, 235, 0.8)), url('/assets/images/hero-bg.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Container>
                    <h1>Create Unforgettable Moments</h1>
                    <p className="lead">We bring your events to life with creativity and precision.</p>
                    <Button variant="light" size="lg" as="a" href="/event-types" className="mt-3">
                        Explore Services
                    </Button>
                </Container>
            </div>
            <Container className="my-5">
                <EventSlider />
                <h2 className="my-4 text-center">Our Services</h2>
                <Row>
                    <Col md={4}>
                        <Card>
                            <Card.Img variant="top" src="/assets/images/wedding.jpg" style={{ height: '200px', objectFit: 'cover' }} />
                            <Card.Body>
                                <Card.Title>Weddings</Card.Title>
                                <Card.Text>Elegant and personalized wedding planning.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Img variant="top" src="/assets/images/conference.jpg" style={{ height: '200px', objectFit: 'cover' }} />
                            <Card.Body>
                                <Card.Title>Conferences</Card.Title>
                                <Card.Text>Professional corporate events.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Img variant="top" src="/assets/images/party.jpg" style={{ height: '200px', objectFit: 'cover' }} />
                            <Card.Body>
                                <Card.Title>Parties</Card.Title>
                                <Card.Text>Fun and vibrant celebrations.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <h2 className="my-4 text-center">Testimonials</h2>
                <Row>
                    <Col md={4} className="text-center">
                        <blockquote className="blockquote">
                            <p>"EventPro made my wedding a dream come true!"</p>
                            <footer className="blockquote-footer">Anna, Happy Bride</footer>
                        </blockquote>
                    </Col>
                    <Col md={4} className="text-center">
                        <blockquote className="blockquote">
                            <p>"The best corporate event we've ever had!"</p>
                            <footer className="blockquote-footer">John, CEO</footer>
                        </blockquote>
                    </Col>
                    <Col md={4} className="text-center">
                        <blockquote className="blockquote">
                            <p>"A birthday party to remember!"</p>
                            <footer className="blockquote-footer">Lisa, Client</footer>
                        </blockquote>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;