import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingForm = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        eventType: '',
        eventDate: '',
    });
    const [eventTypes, setEventTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Lấy danh sách loại sự kiện
    useEffect(() => {
        const fetchEventTypes = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/event-types/public');
                // Lấy eventTypes từ response.data.eventTypes
                setEventTypes(Array.isArray(response.data.eventTypes) ? response.data.eventTypes : []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách loại sự kiện:', error);
                setEventTypes([]);
                toast.error('Không thể tải danh sách loại sự kiện');
            } finally {
                setLoading(false);
            }
        };
        fetchEventTypes();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/bookings/public', formData);
            toast.success('Yêu cầu đặt lịch đã được gửi thành công!');
            setFormData({
                customerName: '',
                email: '',
                eventType: '',
                eventDate: '',
            });
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu đặt lịch:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi gửi yêu cầu đặt lịch');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <ToastContainer />
            <h2 className="text-center mb-4">Đặt lịch sự kiện</h2>
            <Form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
                <Form.Group className="mb-3" controlId="customerName">
                    <Form.Label>Tên khách hàng</Form.Label>
                    <Form.Control
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        placeholder="Nhập tên của bạn"
                        disabled={loading}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Nhập email của bạn"
                        disabled={loading}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="eventType">
                    <Form.Label>Loại sự kiện</Form.Label>
                    <Form.Select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        required
                        disabled={loading || eventTypes.length === 0}
                    >
                        <option value="">Chọn loại sự kiện</option>
                        {eventTypes.map((type) => (
                            <option key={type._id} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </Form.Select>
                    {eventTypes.length === 0 && !loading && (
                        <Form.Text className="text-danger">
                            Không có loại sự kiện nào khả dụng
                        </Form.Text>
                    )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="eventDate">
                    <Form.Label>Ngày tổ chức</Form.Label>
                    <Form.Control
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> Đang gửi...
                        </>
                    ) : (
                        'Gửi yêu cầu'
                    )}
                </Button>
            </Form>
        </Container>
    );
};

export default BookingForm;