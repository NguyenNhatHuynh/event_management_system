// frontend/src/pages/client/Contact.js
import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../../assets/styles/Contact.css';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState(null); // null, 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/contacts', formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' }); // Reset form
            setErrorMessage('');
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    return (
        <Container className="mt-5 contact-container">
            <h2 className="text-center mb-4">GỬI THÔNG TIN LIÊN HỆ</h2>
            {status === 'success' && (
                <Alert variant="success" onClose={() => setStatus(null)} dismissible>
                    Gửi liên hệ thành công! Chúng tôi sẽ phản hồi bạn sớm nhất.
                </Alert>
            )}
            {status === 'error' && (
                <Alert variant="danger" onClose={() => setStatus(null)} dismissible>
                    {errorMessage}
                </Alert>
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập họ và tên"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập email"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tin nhắn</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Nhập tin nhắn của bạn"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Gửi tin nhắn
                </Button>
            </Form>
        </Container>
    );
}

export default Contact;