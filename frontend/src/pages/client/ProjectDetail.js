import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/Client.css';
import 'animate.css';

function ProjectDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchEvent = useCallback(async () => {
        setLoading(true);
        try {
            console.log('Fetching event with ID:', id);
            const response = await axios.get(`http://localhost:5000/api/events/public/${id}`);
            console.log('API response:', response.data);
            setEvent(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sự kiện:', error);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', error.response.data);
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Error message:', error.message);
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    console.log('Current event state:', event);

    if (loading) {
        return (
            <div className="text-center py-5">
                <p>Đang tải...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-5">
                <p>Không tìm thấy sự kiện.</p>
            </div>
        );
    }

    return (
        <div className="project-detail-page">
            {/* Banner Section */}
            <section
                className="project-detail-hero text-center py-5 animate__animated animate__fadeIn"
                style={{
                    backgroundImage: `url(${event.image || '/images/placeholder.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    color: '#fff',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    className="hero-overlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1,
                    }}
                />
                <Container style={{ position: 'relative', zIndex: 2 }}>
                    <h1 className="display-4">{event.name}</h1>
                    <p className="lead">{event.location}</p>
                    <Button variant="primary" size="lg" href="/booking" className="mt-3">
                        Đặt lịch ngay
                    </Button>
                </Container>
            </section>

            {/* Event Details Section */}
            <section className="project-detail-content py-5">
                <Container>
                    <Row>
                        <Col md={8}>
                            <Card className="shadow-sm mb-4 animate__animated animate__fadeInUp">
                                <Card.Body>
                                    <h2 className="mb-4">Thông tin chi tiết</h2>
                                    <p>
                                        <strong>Ngày diễn ra:</strong>{' '}
                                        {new Date(event.date).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p>
                                        <strong>Địa điểm:</strong> {event.location}
                                    </p>
                                    <p>
                                        <strong>Mô tả:</strong>{' '}
                                        {event.description || 'Không có mô tả'}
                                    </p>
                                </Card.Body>
                            </Card>

                            {/* Gallery Section */}
                            {event.images && event.images.length > 0 && (
                                <Card className="shadow-sm mb-4 animate__animated animate__fadeInUp">
                                    <Card.Body>
                                        <h2 className="mb-4">Hình ảnh sự kiện</h2>
                                        <Carousel>
                                            {event.images.map((image, index) => (
                                                <Carousel.Item key={index}>
                                                    <img
                                                        className="d-block w-100"
                                                        src={image}
                                                        alt={`Hình ảnh sự kiện ${index + 1}`}
                                                        style={{
                                                            height: '400px',
                                                            objectFit: 'cover',
                                                            borderRadius: '10px',
                                                        }}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    </Card.Body>
                                </Card>
                            )}
                        </Col>

                        <Col md={4}>
                            <Card className="shadow-sm mb-4 animate__animated animate__fadeInUp">
                                <Card.Body>
                                    <h3 className="mb-4">Thông tin bổ sung</h3>
                                    <p>
                                        <strong>Mã sự kiện:</strong> {event._id}
                                    </p>
                                    <p>
                                        <strong>Ngày tạo:</strong>{' '}
                                        {new Date(event.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                    <Button
                                        variant="outline-primary"
                                        href="/contact"
                                        className="w-100 mt-3"
                                    >
                                        Liên hệ tư vấn
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default ProjectDetail;