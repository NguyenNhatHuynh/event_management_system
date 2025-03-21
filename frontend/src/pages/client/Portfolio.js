import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/Client.css';

function Portfolio() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const typeCode = queryParams.get('type');

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/events/public');
            console.log('Public events data:', response.data);
            let filteredEvents = response.data;

            if (typeCode) {
                filteredEvents = filteredEvents.filter(
                    (event) => event.eventType?.typeCode === typeCode
                );
            }

            setEvents(filteredEvents);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sự kiện:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [typeCode]);

    return (
        <div className="portfolio-page">
            <section className="portfolio-hero text-center py-5 bg-light">
                <Container>
                    <h1 className="display-4">Danh mục sự kiện</h1>
                    <p className="lead">
                        {typeCode
                            ? `Các sự kiện thuộc loại: ${events[0]?.eventType?.name || typeCode}`
                            : 'Khám phá các sự kiện nổi bật mà chúng tôi đã tổ chức'}
                    </p>
                    <Button variant="outline-primary" onClick={fetchEvents}>
                        {loading ? 'Đang tải...' : 'Làm mới'}
                    </Button>
                </Container>
            </section>

            <section className="portfolio-content py-5">
                <Container>
                    <Row>
                        {loading ? (
                            <Col>
                                <p className="text-center">Đang tải...</p>
                            </Col>
                        ) : events.length > 0 ? (
                            events.map((event) => (
                                <Col md={4} key={event._id} className="mb-4">
                                    <Card className="portfolio-card shadow-sm h-100 d-flex flex-column">
                                        <Card.Img
                                            variant="top"
                                            src={
                                                event.image
                                                    ? event.image
                                                    : '/images/placeholder.jpg'
                                            }
                                            alt={event.name}
                                            className="portfolio-card-img"
                                            onError={(e) => {
                                                console.error('Error loading image:', event.image);
                                                e.target.src = '/images/error.jpg';
                                            }}
                                        />
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title>{event.name}</Card.Title>
                                            <Card.Text>
                                                <strong>Loại sự kiện:</strong>{' '}
                                                {event.eventType?.name || 'Không xác định'}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Ngày:</strong>{' '}
                                                {new Date(event.date).toLocaleDateString('vi-VN')}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Địa điểm:</strong> {event.location}
                                            </Card.Text>
                                            <Card.Text className="flex-grow-1">
                                                {event.description
                                                    ? event.description.substring(0, 100) + '...'
                                                    : 'Không có mô tả'}
                                            </Card.Text>
                                            <Link to={`/portfolio/${event._id}`} className="mt-auto">
                                                <Button variant="primary">Xem chi tiết</Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col>
                                <p className="text-center">
                                    {typeCode
                                        ? `Không có sự kiện nào thuộc loại này.`
                                        : 'Hiện tại chưa có sự kiện nào.'}
                                </p>
                            </Col>
                        )}
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default Portfolio;