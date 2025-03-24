import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container, Badge, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [rejectReason, setRejectReason] = useState(''); // State để lưu lý do từ chối
    const [showRejectInput, setShowRejectInput] = useState(null); // State để hiển thị input lý do từ chối

    // Lấy danh sách đặt lịch khi component được mount
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/bookings', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBookings(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đặt lịch:', error);
                toast.error('Lỗi khi lấy danh sách đặt lịch!');
            }
        };
        fetchBookings();
    }, []);

    // Xử lý phê duyệt đặt lịch
    const handleApprove = async (id) => {
        const confirmApprove = window.confirm('Bạn có chắc chắn muốn phê duyệt đặt lịch này?');
        if (!confirmApprove) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:5000/api/bookings/${id}/approve`,
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
                `http://localhost:5000/api/bookings/${id}/reject`,
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
        } catch (error) {
            console.error('Lỗi khi từ chối:', error);
            toast.error('Lỗi khi từ chối: ' + error.response.data.message);
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
                                <td>{index + 1}</td>
                                <td>{booking.customerName}</td>
                                <td>{booking.eventType}</td>
                                <td>{new Date(booking.eventDate).toLocaleDateString()}</td>
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
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </Container>
    );
};

export default Bookings;