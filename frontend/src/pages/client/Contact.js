import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../../assets/styles/Client.css';

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted! (Demo)');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div>
            {/* Header Section */}
            <section className="contact-header-section">
                <Container className="text-center">
                    <h1>CÔNG TY TNHH QUẢNG CÁO VÀ TỔ CHỨC SỰ KIỆN ĐẠI DƯƠNG</h1>
                </Container>
            </section>

            {/* Contact Form Section */}
            <section className="contact-form-section">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <h2 className="text-center mb-4">GỬI THÔNG TIN LIÊN HỆ</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Họ và tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập họ và tên"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formMessage">
                                    <Form.Label>Tin nhắn</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder="Nhập tin nhắn của bạn"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <div className="text-center">
                                    <Button type="submit" className="contact-submit-button">
                                        Gửi tin nhắn
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Contact Info Section */}
            <section className="contact-info-section">
                <Container>
                    <Row>
                        <Col md={6}>
                            <h2>Công ty xây dựng dân dụng và công nghiệp DELTA</h2>
                            <p>
                                <strong>Địa chỉ:</strong> Số 4 ngõ 364, ngách 94 hẻm 6 đường Giải Phóng, Phường Thịnh Liệt, Quận Hoàng Mai, Thành phố Hà Nội, Việt Nam
                            </p>
                            <p>
                                <strong>Điện thoại:</strong> 0986.989.626
                            </p>
                            <p>
                                <strong>Email:</strong> topweb.com.vn@gmail.com
                            </p>
                        </Col>
                        <Col md={6}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.729174263614!2d105.839987314692!3d20.999999994231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac810b8c8e1d%3A0x5c5e7b3b5b5b5b5b!2sHà%20Nội%2C%20Vietnam!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
                                width="100%"
                                height="300"
                                style={{ border: 0, borderRadius: '10px' }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Additional Info Section */}
            <section className="additional-info-section">
                <Container>
                    <Row>
                        <Col md={3} className="mb-4">
                            <h5>GIỚI THIỆU</h5>
                            <p>
                                CÔNG TY TNHH QUẢNG CÁO VÀ TỔ CHỨC SỰ KIỆN ĐẠI DƯƠNG được thành lập năm 1993. Là đơn vị hàng đầu trong ngành xây dựng Việt Nam.
                            </p>
                        </Col>
                        <Col md={3} className="mb-4">
                            <h5>TRỤ SỞ HÀ NỘI</h5>
                            <p>
                                Địa chỉ: Số 4 ngõ 364, ngách 94 hẻm 6 đường Giải Phóng, Phường Thịnh Liệt, Quận Hoàng Mai, Thành phố Hà Nội
                            </p>
                        </Col>
                        <Col md={3} className="mb-4">
                            <h5>BẢN ĐỒ</h5>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.729174263614!2d105.839987314692!3d20.999999994231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac810b8c8e1d%3A0x5c5e7b3b5b5b5b5b!2sHà%20Nội%2C%20Vietnam!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
                                width="100%"
                                height="150"
                                style={{ border: 0, borderRadius: '5px' }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </Col>
                        <Col md={3} className="mb-4">
                            <h5>LỊCH LÀM VIỆC</h5>
                            <p>Thời gian làm việc công ty</p>
                            <p>Từ 8h - 22h (cả T7, CN)</p>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default Contact;