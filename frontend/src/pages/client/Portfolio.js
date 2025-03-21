// frontend/src/pages/client/Portfolio.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/Client.css';

function Portfolio() {
    const [events, setEvents] = useState([]);
    const location = useLocation();

    // Lấy typeCode từ query string
    const queryParams = new URLSearchParams(location.search);
    const typeCode = queryParams.get('type');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events/public');
                let filteredEvents = response.data;

                // Lọc sự kiện theo typeCode nếu có
                if (typeCode) {
                    filteredEvents = filteredEvents.filter(
                        (event) => event.eventType?.typeCode === typeCode
                    );
                }

                setEvents(filteredEvents);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sự kiện:', error);
            }
        };
        fetchEvents();
    }, [typeCode]); // Thêm typeCode vào dependency để re-fetch khi query thay đổi

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
                </Container>
            </section>

            <section className="portfolio-content py-5">
                <Container>
                    <Row>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <Col md={4} key={event._id} className="mb-4">
                                    <Card className="portfolio-card shadow-sm">
                                        <Card.Img
                                            variant="top"
                                            src={
                                                event.image
                                                    ? `http://localhost:5000${event.image}`
                                                    : 'https://via.placeholder.com/300x200'
                                            }
                                            alt={event.name}
                                        />
                                        <Card.Body>
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
                                            <Card.Text>
                                                {event.description
                                                    ? event.description.substring(0, 100) + '...'
                                                    : 'Không có mô tả'}
                                            </Card.Text>
                                            <Link to={`/portfolio/${event._id}`}>
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