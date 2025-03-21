// frontend/src/pages/client/ProjectDetail.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/Client.css';

function ProjectDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events/public`);
                const foundEvent = response.data.find((e) => e._id === id);
                setEvent(foundEvent);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sự kiện:', error);
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <p>Đang tải...</p>
            </Container>
        );
    }

    if (!event) {
        return (
            <Container className="py-5 text-center">
                <p>Sự kiện không tồn tại.</p>
            </Container>
        );
    }

    return (
        <div className="project-detail-page">
            <section className="project-detail-hero text-center py-5 bg-light">
                <Container>
                    <h1 className="display-4">{event.name}</h1>
                    <p className="lead">{event.location}</p>
                </Container>
            </section>

            <section className="project-detail-content py-5">
                <Container>
                    <Row>
                        <Col md={8}>
                            <Card className="shadow-sm">
                                <Card.Img
                                    variant="top"
                                    src={
                                        event.image
                                            ? `http://localhost:5000${event.image}`
                                            : 'https://via.placeholder.com/800x400'
                                    }
                                    alt={event.name}
                                />
                                <Card.Body>
                                    <Card.Title>Thông tin chi tiết</Card.Title>
                                    <Card.Text>
                                        <strong>Ngày diễn ra:</strong>{' '}
                                        {new Date(event.date).toLocaleDateString('vi-VN')}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Địa điểm:</strong> {event.location}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Mô tả:</strong>{' '}
                                        {event.description || 'Không có mô tả'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Thông tin bổ sung</Card.Title>
                                    <Card.Text>
                                        <strong>Mã sự kiện:</strong> {event.eventCode}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Ngày tạo:</strong>{' '}
                                        {new Date(event.createdAt).toLocaleDateString('vi-VN')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            <footer className="login-footer bg-dark text-white py-3">
                <Container className="text-center">
                    <p>© 2025 XoanDev. All Rights Reserved.</p>
                    <p>Contact: xoandev@gmail.com | 08xxxx</p>
                </Container>
            </footer>
        </div>
    );
}

export default ProjectDetail;