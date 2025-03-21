// frontend/src/pages/client/EventTypes.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/Client.css';

function EventTypes() {
    const { typeCode } = useParams();
    const [eventTypes, setEventTypes] = useState([]);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchEventTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/event-types/public');
            setEventTypes(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách loại sự kiện:', error);
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/events/public');
            let filteredEvents = response.data;
            if (typeCode) {
                filteredEvents = filteredEvents.filter(
                    (event) => event.eventType?.typeCode === typeCode
                );
            }
            setEvents(filteredEvents);
            setFilteredEvents(filteredEvents);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sự kiện:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventTypes();
        fetchEvents();
    }, [typeCode]);

    useEffect(() => {
        let filtered = events;
        if (filterDate) {
            filtered = filtered.filter((event) =>
                new Date(event.date).toISOString().split('T')[0] === filterDate
            );
        }
        if (filterLocation) {
            filtered = filtered.filter((event) =>
                event.location.toLowerCase().includes(filterLocation.toLowerCase())
            );
        }
        setFilteredEvents(filtered);
    }, [filterDate, filterLocation, events]);

    const selectedType = eventTypes.find((type) => type.typeCode === typeCode);

    return (
        <div className="event-types-page">
            <section
                className="event-types-hero text-center py-5"
                style={{
                    background: 'linear-gradient(135deg, #007bff, #00c4b4)',
                    backgroundSize: 'cover',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container>
                    <h1 className="display-4 animate__animated animate__fadeInDown">
                        {typeCode ? (selectedType?.name || typeCode) : 'Các loại sự kiện'}
                    </h1>
                    <p className="lead animate__animated animate__fadeInUp">
                        {typeCode
                            ? selectedType?.description || 'Khám phá các sự kiện thuộc loại này'
                            : 'Khám phá các loại sự kiện mà chúng tôi tổ chức'}
                    </p>
                </Container>
                <div
                    className="hero-overlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.4)',
                        zIndex: 1,
                    }}
                />
            </section>

            <section className="event-types-content py-5">
                <Container>
                    {typeCode ? (
                        <>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Lọc theo ngày</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={filterDate}
                                            onChange={(e) => setFilterDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Lọc theo địa điểm</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập địa điểm..."
                                            value={filterLocation}
                                            onChange={(e) => setFilterLocation(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2} className="d-flex align-items-end">
                                    <Button variant="outline-primary" onClick={fetchEvents}>
                                        {loading ? 'Đang tải...' : 'Làm mới'}
                                    </Button>
                                </Col>
                            </Row>

                            <Row>
                                {loading ? (
                                    <Col>
                                        <p className="text-center">Đang tải...</p>
                                    </Col>
                                ) : filteredEvents.length > 0 ? (
                                    filteredEvents.map((event) => (
                                        <Col md={4} key={event._id} className="mb-4">
                                            <Card className="event-card shadow-sm animate__animated animate__fadeIn">
                                                <div className="event-card-image-wrapper">
                                                    <Card.Img
                                                        variant="top"
                                                        src={
                                                            event.image
                                                                ? `http://localhost:5000${event.image}`
                                                                : 'https://via.placeholder.com/300x200'
                                                        }
                                                        alt={event.name}
                                                        className="event-card-image"
                                                    />
                                                    <div className="event-card-overlay">
                                                        <Link to={`/portfolio/${event._id}`}>
                                                            <Button variant="light" className="view-details-btn">
                                                                Xem chi tiết
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <Card.Body>
                                                    <Card.Title className="event-card-title">
                                                        {event.name}
                                                    </Card.Title>
                                                    <Card.Text>
                                                        <strong>Ngày:</strong>{' '}
                                                        {new Date(event.date).toLocaleDateString('vi-VN')}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        <strong>Địa điểm:</strong> {event.location}
                                                    </Card.Text>
                                                    <Card.Text className="event-card-description">
                                                        {event.description
                                                            ? event.description.substring(0, 100) + '...'
                                                            : 'Không có mô tả'}
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col>
                                        <p className="text-center">
                                            Không có sự kiện nào thuộc loại này hoặc khớp với bộ lọc.
                                        </p>
                                    </Col>
                                )}
                            </Row>
                        </>
                    ) : (
                        <Row>
                            {eventTypes.length > 0 ? (
                                eventTypes.map((type) => (
                                    <Col md={4} key={type._id} className="mb-4">
                                        <Card className="event-type-card shadow-sm animate__animated animate__fadeIn">
                                            <Card.Body>
                                                <Card.Title>{type.name}</Card.Title>
                                                <Card.Text>
                                                    <strong>Mã loại:</strong> {type.typeCode}
                                                </Card.Text>
                                                <Card.Text>
                                                    {type.description
                                                        ? type.description
                                                        : 'Không có mô tả'}
                                                </Card.Text>
                                                <Link to={`/event-types/${type.typeCode}`}>
                                                    <Button variant="primary">Xem sự kiện</Button>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col>
                                    <p className="text-center">
                                        Hiện tại chưa có loại sự kiện nào.
                                    </p>
                                </Col>
                            )}
                        </Row>
                    )}
                </Container>
            </section>
        </div>
    );
}

export default EventTypes;