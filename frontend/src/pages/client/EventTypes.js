// frontend/src/pages/client/EventTypes.js
import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/Client.css';
import 'animate.css';

function EventTypes() {
    const { typeCode } = useParams(); // Lấy typeCode từ URL (ví dụ: "FULL_MONTH")
    const [events, setEvents] = useState([]); // Danh sách sự kiện
    const [eventTypes, setEventTypes] = useState([]); // Danh sách loại sự kiện
    const [eventTypeName, setEventTypeName] = useState(''); // Tên loại sự kiện
    const [loading, setLoading] = useState(false); // Trạng thái tải
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [totalEvents, setTotalEvents] = useState(0); // Tổng số sự kiện
    const limit = 6; // Số lượng sự kiện trên mỗi trang

    // Lấy danh sách loại sự kiện để tìm tên loại dựa trên typeCode
    const fetchEventTypes = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/event-types/public');
            setEventTypes(response.data);

            // Nếu có typeCode, tìm tên loại sự kiện tương ứng
            if (typeCode) {
                const eventType = response.data.find((type) => type.typeCode === typeCode);
                if (eventType) {
                    setEventTypeName(eventType.name);
                } else {
                    setEventTypeName('Không tìm thấy loại sự kiện');
                }
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách loại sự kiện:', error);
        }
    }, [typeCode]);

    // Lấy danh sách sự kiện với phân trang
    const fetchEvents = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            let url = `http://localhost:5000/api/events/public?page=${page}&limit=${limit}`;
            if (typeCode) {
                url += `&typeCode=${typeCode}`; // Sử dụng typeCode trực tiếp nhờ backend đã hỗ trợ
            }
            console.log('Fetching events with URL:', url);
            const response = await axios.get(url);
            console.log('API response:', response.data);

            // Kiểm tra dữ liệu trả về từ API
            const eventsData = Array.isArray(response.data.events) ? response.data.events : [];
            setEvents(eventsData);
            setCurrentPage(response.data.currentPage || 1);
            setTotalPages(response.data.totalPages || 1);
            setTotalEvents(response.data.totalEvents || 0);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sự kiện:', error);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', error.response.data);
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Error message:', error.message);
            }
            setEvents([]); // Đặt events về mảng rỗng nếu có lỗi
            setTotalPages(1);
            setTotalEvents(0);
        } finally {
            setLoading(false);
        }
    }, [typeCode]);

    useEffect(() => {
        fetchEventTypes();
    }, [fetchEventTypes]);

    useEffect(() => {
        fetchEvents(currentPage);
    }, [fetchEvents, currentPage]); // Gọi lại fetchEvents khi currentPage thay đổi

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
        }
    };

    console.log('Current events state:', events);

    if (loading) {
        return (
            <div className="text-center py-5">
                <p>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="event-type-page">
            <section className="event-type-content py-5">
                <Container>
                    <h2 className="text-center mb-5">
                        {typeCode ? `Sự kiện thuộc loại: ${eventTypeName}` : 'Tất cả loại sự kiện'}
                    </h2>
                    {events.length === 0 ? (
                        <div className="text-center py-5">
                            <p>Không có sự kiện nào thuộc loại này.</p>
                        </div>
                    ) : (
                        <>
                            <Row>
                                {events.map((event) => (
                                    <Col md={4} key={event._id} className="mb-4">
                                        <Card className="shadow-sm animate__animated animate__fadeInUp">
                                            <Card.Img
                                                variant="top"
                                                src={event.image || '/images/placeholder.jpg'}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <Card.Body>
                                                <Card.Title>{event.name}</Card.Title>
                                                <Card.Text>
                                                    <strong>Ngày diễn ra:</strong>{' '}
                                                    {new Date(event.date).toLocaleDateString('vi-VN')}
                                                    <br />
                                                    <strong>Địa điểm:</strong> {event.location}
                                                </Card.Text>
                                                <Button
                                                    variant="primary"
                                                    href={`/portfolio/${event._id}`}
                                                    className="w-100"
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
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
                        </>
                    )}
                </Container>
            </section>
        </div>
    );
}

export default EventTypes;