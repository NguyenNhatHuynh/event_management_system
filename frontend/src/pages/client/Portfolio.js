// frontend/src/pages/client/Portfolio.js
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Pagination, Form, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import { FaSearch } from 'react-icons/fa';
import '../../assets/styles/Client.css';

function Portfolio() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const limit = 6;
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const typeCode = queryParams.get('type');

    const fetchEvents = useCallback(async (page = 1, typeCodeParam = typeCode, search = '') => {
        setLoading(true);
        try {
            let url = `http://localhost:5000/api/events/public?page=${page}&limit=${limit}`;
            if (typeCodeParam) url += `&typeCode=${typeCodeParam}`;
            if (search) url += `&search=${encodeURIComponent(search)}`;

            const response = await axios.get(url, { timeout: 5000 });
            const eventsData = Array.isArray(response.data.events) ? response.data.events : [];
            setEvents(eventsData);
            setCurrentPage(response.data.currentPage || 1);
            setTotalPages(response.data.totalPages || 1);
            setTotalEvents(response.data.totalEvents || 0);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sự kiện:', error);
            setEvents([]);
            setTotalPages(1);
            setTotalEvents(0);
        } finally {
            setLoading(false);
        }
    }, [typeCode]);

    const debouncedFetchEvents = useMemo(() =>
        debounce((page, typeCode, search) => fetchEvents(page, typeCode, search), 300),
        [fetchEvents]
    );

    useEffect(() => {
        debouncedFetchEvents(currentPage, typeCode, searchTerm);
        return () => debouncedFetchEvents.cancel();
    }, [currentPage, typeCode, searchTerm, debouncedFetchEvents]);

    const handleViewAllEvents = () => {
        navigate('/portfolio');
        setCurrentPage(1);
        setSearchTerm('');
        fetchEvents(1, null, '');
    };

    const handlePageChange = useCallback((pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0);
        }
    }, [totalPages]);

    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    const eventList = useMemo(() => (
        events.map((event) => (
            <Col md={4} key={event._id} className="mb-4">
                <Card className="portfolio-card shadow-sm h-100 d-flex flex-column">
                    <Card.Img
                        variant="top"
                        src={event.image ? event.image : '/images/placeholder.jpg'}
                        alt={event.name}
                        className="portfolio-card-img"
                        onError={(e) => {
                            e.target.src = '/images/error.jpg';
                        }}
                    />
                    <Card.Body className="d-flex flex-column">
                        <Card.Title>{event.name}</Card.Title>
                        <Card.Text>
                            <strong>Loại sự kiện:</strong> {event.eventType?.name || 'Không xác định'}
                        </Card.Text>
                        <Card.Text>
                            <strong>Ngày:</strong> {new Date(event.date).toLocaleDateString('vi-VN')}
                        </Card.Text>
                        <Card.Text>
                            <strong>Địa điểm:</strong> {event.location}
                        </Card.Text>
                        <Card.Text className="flex-grow-1">
                            {event.description ? event.description.substring(0, 100) + '...' : 'Không có mô tả'}
                        </Card.Text>
                        <Link to={`/portfolio/${event._id}`} className="mt-auto">
                            <Button variant="primary">Xem chi tiết</Button>
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        ))
    ), [events]);

    return (
        <div className="portfolio-page">
            <section className="portfolio-hero text-center py-5 bg-light">
                <Container>
                    <h1 className="display-4">Danh mục sự kiện</h1>
                    <p className="lead">
                        {typeCode && events.length > 0
                            ? `Các sự kiện thuộc loại: ${events[0]?.eventType?.name || typeCode}`
                            : 'Khám phá các sự kiện nổi bật mà chúng tôi đã tổ chức'}
                    </p>
                    <div className="search-container mb-4">
                        <Form className="search-form">
                            <div className="search-wrapper">
                                <FaSearch className="search-icon" />
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm kiếm sự kiện..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="search-input"
                                />
                                {loading && (
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        className="search-spinner"
                                    />
                                )}
                            </div>
                        </Form>
                    </div>
                    <Button variant="outline-primary" onClick={handleViewAllEvents}>
                        {loading ? 'Đang tải...' : 'Xem tất cả loại sự kiện'}
                    </Button>
                </Container>
            </section>

            <section className="portfolio-content py-5">
                <Container>
                    <Row className="fade-in">
                        {loading && events.length === 0 ? (
                            <Col>
                                <p className="text-center">Đang tải...</p>
                            </Col>
                        ) : events.length > 0 ? (
                            eventList
                        ) : (
                            <Col>
                                <p className="text-center">
                                    {searchTerm
                                        ? 'Không tìm thấy sự kiện nào phù hợp.'
                                        : typeCode
                                            ? `Không có sự kiện nào thuộc loại này.`
                                            : 'Hiện tại chưa có sự kiện nào.'}
                                </p>
                            </Col>
                        )}
                    </Row>

                    {totalEvents > 0 && (
                        <Row className="mt-4">
                            <Col className="d-flex justify-content-between align-items-center">
                                <div>
                                    Tổng số sự kiện: {totalEvents}
                                </div>
                                <Pagination>
                                    <Pagination.First
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1 || loading}
                                    />
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1 || loading}
                                    />
                                    {[...Array(totalPages).keys()].map((page) => (
                                        <Pagination.Item
                                            key={page + 1}
                                            active={page + 1 === currentPage}
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={loading}
                                        >
                                            {page + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages || loading}
                                    />
                                    <Pagination.Last
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages || loading}
                                    />
                                </Pagination>
                            </Col>
                        </Row>
                    )}
                </Container>
            </section>
        </div>
    );
}

export default Portfolio;