// frontend/src/pages/admin/Bookings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container, Badge, Form, Row, Col, Pagination } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBookings, setTotalBookings] = useState(0);
    const limit = 5; // Số đặt lịch trên mỗi trang
    const [rejectReason, setRejectReason] = useState(''); // State để lưu lý do từ chối
    const [showRejectInput, setShowRejectInput] = useState(null); // State để hiển thị input lý do từ chối

    // Lấy danh sách đặt lịch với phân trang
    const fetchBookings = async (page = 1) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/bookings?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookings(response.data.bookings || []);
            setCurrentPage(response.data.currentPage || 1);
            setTotalPages(response.data.totalPages || 1);
            setTotalBookings(response.data.totalBookings || 0);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đặt lịch:', error);
            toast.error('Lỗi khi lấy danh sách đặt lịch!');
            setBookings([]);
            setTotalPages(1);
            setTotalBookings(0);
        }
    };

    useEffect(() => {
        fetchBookings(currentPage);
    }, [currentPage]);

    // Xử lý phê duyệt đặt lịch
    const handleApprove = async (id) => {
        const confirmApprove = window.confirm('Bạn có chắc chắn muốn phê duyệt đặt lịch này?');
        if (!confirmApprove) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `/api/bookings/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setBookings(bookings.map((booking) =>
                booking._id === id ? response.data : booking
            ));
            toast.success('Đã phê duyệt đặt lịch!');
            fetchBookings(currentPage); // Làm mới danh sách sau khi phê duyệt
        } catch (error) {
            console.error('Lỗi khi phê duyệt:', error);
            toast.error('Lỗi khi phê duyệt: ' + error.response.data.message);
        }
    };

    // Xử lý từ chối đặt lịch
    const handleReject = async (id) => {
        if (!rejectReason) {
            toast.warn('Vui lòng nhập lý do từ chối!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `/api/bookings/${id}/reject`,
                { reason: rejectReason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setBookings(bookings.map((booking) =>
                booking._id === id ? response.data : booking
            ));
            setRejectReason(''); // Reset lý do từ chối
            setShowRejectInput(null); // Ẩn input lý do từ chối
            toast.success('Đã từ chối đặt lịch!');
            fetchBookings(currentPage); // Làm mới danh sách sau khi từ chối
        } catch (error) {
            console.error('Lỗi khi từ chối:', error);
            toast.error('Lỗi khi từ chối: ' + error.response.data.message);
        }
    };

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
        }
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4 text-center">Quản lý đặt lịch</h2>
            <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-primary">
                    <tr>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Loại sự kiện</th>
                        <th>Ngày tổ chức</th>
                        <th>Trạng thái</th>
                        <th>Lý do từ chối</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length > 0 ? (
                        bookings.map((booking, index) => (
                            <tr key={booking._id}>
                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                <td>{booking.customerName}</td>
                                <td>{booking.eventType}</td>
                                <td>{new Date(booking.eventDate).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    {booking.status === 'Pending' && (
                                        <Badge bg="warning" text="dark">
                                            Đang chờ
                                        </Badge>
                                    )}
                                    {booking.status === 'Approved' && (
                                        <Badge bg="success">Đã phê duyệt</Badge>
                                    )}
                                    {booking.status === 'Rejected' && (
                                        <Badge bg="danger">Đã từ chối</Badge>
                                    )}
                                </td>
                                <td>
                                    {booking.status === 'Rejected' && booking.rejectReason
                                        ? booking.rejectReason
                                        : '-'}
                                </td>
                                <td>
                                    {booking.status === 'Pending' && (
                                        <div className="d-flex align-items-center">
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleApprove(booking._id)}
                                            >
                                                Phê duyệt
                                            </Button>
                                            {showRejectInput === booking._id ? (
                                                <div className="d-flex align-items-center">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Nhập lý do từ chối"
                                                        value={rejectReason}
                                                        onChange={(e) =>
                                                            setRejectReason(e.target.value)
                                                        }
                                                        className="me-2"
                                                        size="sm"
                                                    />
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleReject(booking._id)}
                                                    >
                                                        Xác nhận từ chối
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="ms-2"
                                                        onClick={() => {
                                                            setShowRejectInput(null);
                                                            setRejectReason('');
                                                        }}
                                                    >
                                                        Hủy
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        setShowRejectInput(booking._id)
                                                    }
                                                >
                                                    Từ chối
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Không có đặt lịch nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {totalBookings > 0 && (
                <Row className="mt-4">
                    <Col className="d-flex justify-content-between align-items-center">
                        <div>
                            Tổng số đặt lịch: {totalBookings}
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

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </Container>
    );
};

export default Bookings;