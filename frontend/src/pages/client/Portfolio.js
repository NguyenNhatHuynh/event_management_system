// frontend/src/pages/client/Portfolio.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import axios from 'axios';
import '../../assets/styles/Client.css';

function Portfolio() {
    const [events, setEvents] = useState([]); // Khởi tạo events là mảng rỗng
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // State để theo dõi trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [totalEvents, setTotalEvents] = useState(0); // Tổng số sự kiện
    const limit = 6; // Số lượng sự kiện trên mỗi trang
    const location = useLocation();
    const navigate = useNavigate(); // Thêm navigate để điều hướng

    const queryParams = new URLSearchParams(location.search);
    const typeCode = queryParams.get('type');

    const fetchEvents = async (page = 1, typeCodeParam = typeCode) => {
        setLoading(true);
        try {
            let url = `http://localhost:5000/api/events/public?page=${page}&limit=${limit}`;
            if (typeCodeParam) {
                url += `&typeCode=${typeCodeParam}`;
            }
            console.log('Fetching events with URL:', url);
            const response = await axios.get(url);
            console.log('Public events data:', response.data);

            // Kiểm tra dữ liệu trả về từ API
            const eventsData = Array.isArray(response.data.events) ? response.data.events : [];
            setEvents(eventsData);
            setCurrentPage(response.data.currentPage || 1);
            setTotalPages(response.data.totalPages || 1);
            setTotalEvents(response.data.totalEvents || 0);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sự kiện:', error);
            // Nếu có lỗi, đặt events về mảng rỗng
            setEvents([]);
            setTotalPages(1);
            setTotalEvents(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(currentPage, typeCode);
    }, [typeCode, currentPage]); // Gọi lại fetchEvents khi typeCode hoặc currentPage thay đổi

    // Hàm xử lý khi nhấn "Xem tất cả loại sự kiện"
    const handleViewAllEvents = () => {
        // Xóa query parameter typeCode và điều hướng về /portfolio
        navigate('/portfolio');
        setCurrentPage(1); // Reset về trang 1
        fetchEvents(1, null); // Gọi lại API mà không có typeCode
    };

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
        }
    };

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
                    <Button variant="outline-primary" onClick={handleViewAllEvents}>
                        {loading ? 'Đang tải...' : 'Xem tất cả loại sự kiện'}
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

                    {/* Phân trang */}
                    {totalEvents > 0 && (
                        <Row className="mt-4">
                            <Col className="d-flex justify-content-between align-items-center">
                                <div>
                                    Tổng số sự kiện: {totalEvents}
                                </div>
                                <Pagination>
                                    <Pagination.First
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                    />
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    />
                                    {[...Array(totalPages).keys()].map((page) => (
                                        <Pagination.Item
                                            key={page + 1}
                                            active={page + 1 === currentPage}
                                            onClick={() => handlePageChange(page + 1)}
                                        >
                                            {page + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    />
                                    <Pagination.Last
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
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