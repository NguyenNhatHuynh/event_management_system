import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getEventTypes } from '../../services/api';
import '../../assets/styles/Client.css';

function EventTypes() {
    const [eventTypes, setEventTypes] = useState([]);

    useEffect(() => {
        getEventTypes()
            .then((response) => setEventTypes(response.data))
            .catch((error) => console.log(error));
    }, []);

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Our Event Services</h1>
            <Row>
                {eventTypes.map((event) => (
                    <Col md={4} key={event._id} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{event.name}</Card.Title>
                                <Card.Text>{event.description}</Card.Text>
                                <Card.Text><strong>Starting at:</strong> {event.basePrice.toLocaleString('vi-VN')} VND</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default EventTypes;