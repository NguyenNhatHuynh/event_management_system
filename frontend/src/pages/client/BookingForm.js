import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';

const BookingForm = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        eventType: '',
        eventDate: '',
    });
    const [eventTypes, setEventTypes] = useState([]);

    // Lấy danh sách loại sự kiện
    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/event-types/public');
                setEventTypes(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách loại sự kiện:', error);
            }
        };
        fetchEventTypes();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/bookings/public', formData);
            alert('Yêu cầu đặt lịch đã được gửi thành công!');
            setFormData({
                customerName: '',
                email: '',
                eventType: '',
                eventDate: '',
            });
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu đặt lịch:', error);
            alert('Lỗi khi gửi yêu cầu: ' + error.response.data.message);
        }
    };

    return (
        <Container className="my-5">
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
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="eventType">
                    <Form.Label>Loại sự kiện</Form.Label>
                    <Form.Select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn loại sự kiện</option>
                        {eventTypes.map((type) => (
                            <option key={type._id} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="eventDate">
                    <Form.Label>Ngày tổ chức</Form.Label>
                    <Form.Control
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Gửi yêu cầu
                </Button>
            </Form>
        </Container>
    );
};

export default BookingForm;