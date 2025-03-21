import React from 'react';
import { Container, Button, Row, Col, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../assets/styles/Client.css';

import VietinBankLogo from '../../assets/images/vietinbank.png';
import MbbankLogo from '../../assets/images/mb-bank.png';
import NisseiLogo from '../../assets/images/nissei.png';
import SamSungLogo from '../../assets/images/samsung.png';
import SonyLogo from '../../assets/images/sony.png';
import VietCombankLogo from '../../assets/images/vietcombank.jpeg';
import VrbLogo from '../../assets/images/vrb.png';
import Testimonials from '../../assets/images/testimonial-bg.png';

function Home() {
    return (
        <div>
            {/* Hero Section with Carousel */}
            <section className="hero-section">
                <Carousel fade>
                    <Carousel.Item>
                        <div
                            className="hero-slide"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/images/hero-event-1.jpg')`,
                            }}
                        >
                            <Container className="h-100 d-flex flex-column justify-content-center align-items-center text-center">
                                <h1>NHỮNG DỊCH VỤ HOT EVENTPRO CUNG CẤP</h1>
                                <p className="lead">Tổ chức sự kiện chuyên nghiệp, sáng tạo và đáng tin cậy.</p>
                                <Button variant="light" size="lg" as={Link} to="/contact" className="mt-3">
                                    Khám phá ngay
                                </Button>
                            </Container>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div
                            className="hero-slide"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/images/hero-event-2.jpg')`,
                            }}
                        >
                            <Container className="h-100 d-flex flex-column justify-content-center align-items-center text-center">
                                <h1>TỔ CHỨC SỰ KIỆN ĐỈNH CAO</h1>
                                <p className="lead">Biến ý tưởng của bạn thành hiện thực với EventPro.</p>
                                <Button variant="light" size="lg" as={Link} to="/contact" className="mt-3">
                                    Liên hệ ngay
                                </Button>
                            </Container>
                        </div>
                    </Carousel.Item>
                </Carousel>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <Container>
                    <h2 className="text-center mb-5">NHỮNG DỊCH VỤ HOT EVENTPRO CUNG CẤP</h2>
                    <Row>
                        <Col md={4} className="mb-4">
                            <Card className="service-card">
                                <Card.Img variant="top" src="/assets/images/road-show.jpg" />
                                <Card.Body>
                                    <Card.Title>TỔ CHỨC ROAD SHOW</Card.Title>
                                    <Card.Text>Quảng bá thương hiệu hiệu quả với các chiến dịch road show sáng tạo.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="service-card">
                                <Card.Img variant="top" src="/assets/images/event-performance.jpg" />
                                <Card.Body>
                                    <Card.Title>TỔ CHỨC BIỂU DIỄN NGHỆ THUẬT</Card.Title>
                                    <Card.Text>Mang đến những màn trình diễn nghệ thuật ấn tượng và độc đáo.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="service-card">
                                <Card.Img variant="top" src="/assets/images/inauguration.jpg" />
                                <Card.Body>
                                    <Card.Title>TỔ CHỨC KHAI TRƯƠNG - KHÁNH THÀNH</Card.Title>
                                    <Card.Text>Tạo dấu ấn cho sự kiện khai trương hoặc khánh thành của bạn.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="service-card">
                                <Card.Img variant="top" src="/assets/images/product-launch.jpg" />
                                <Card.Body>
                                    <Card.Title>TỔ CHỨC LỄ RA MẮT SẢN PHẨM MỚI</Card.Title>
                                    <Card.Text>Giới thiệu sản phẩm mới với sự kiện hoành tráng và chuyên nghiệp.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="service-card">
                                <Card.Img variant="top" src="/assets/images/groundbreaking.jpg" />
                                <Card.Body>
                                    <Card.Title>TỔ CHỨC KHỞI CÔNG - ĐỘNG THỔ</Card.Title>
                                    <Card.Text>Đánh dấu khởi đầu dự án với sự kiện ý nghĩa và trang trọng.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="service-card">
                                <Card.Img variant="top" src="/assets/images/conference.jpg" />
                                <Card.Body>
                                    <Card.Title>TỔ CHỨC HỘI NGHỊ - HỘI THẢO</Card.Title>
                                    <Card.Text>Tổ chức hội nghị chuyên nghiệp, đảm bảo thành công cho sự kiện.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <Container className="text-center">
                    <h2>TẠI SAO BẠN NÊN LỰA CHỌN EVENTPRO</h2>
                    <Button variant="light" size="lg" as={Link} to="/contact" className="mt-3 cta-button">
                        Liên hệ ngay
                    </Button>
                </Container>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <Container>
                    <h2 className="text-center mb-5">KHÁCH HÀNG NÓI VỀ CHÚNG TÔI</h2>
                    <Carousel fade>
                        <Carousel.Item>
                            <div
                                className="testimonial-slide"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${Testimonials})`,
                                }}
                            >
                                <Row className="justify-content-center">
                                    <Col md={8} className="text-center">
                                        <p>
                                            Ms Nguyễn Phương Nga Phó Giám đốc Công ty TNHH NISSEI Việt Nam, Tới đây có dịp hợp tác cùng với VTA Event, thay thưa sự hài lòng vì phong cách làm việc chuyên nghiệp, và có trách nhiệm với công việc. Nêu có dịp sẽ hợp tác lâu dài...
                                        </p>
                                        <h5>Mark Jance / Facebook</h5>
                                        <div className="stars">
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </Container>
            </section>

            {/* Partners Section */}
            <section className="partners-section">
                <Container>
                    <h2 className="text-center mb-5">Khách hàng của chúng tôi</h2>
                    <Row className="justify-content-center align-items-center">
                        <Col xs={6} md={2} className="text-center mb-4">
                            <img src={VietCombankLogo} alt="Vietcombank" className="partner-logo" />
                        </Col>
                        <Col xs={6} md={2} className="text-center mb-4">
                            <img src={VietinBankLogo} alt="VietinBank" className="partner-logo" />
                        </Col>
                        <Col xs={6} md={2} className="text-center mb-4">
                            <img src={MbbankLogo} alt="MB Bank" className="partner-logo" />
                        </Col>
                        <Col xs={6} md={2} className="text-center mb-4">
                            <img src={VrbLogo} alt="VRB" className="partner-logo" />
                        </Col>
                        <Col xs={6} md={2} className="text-center mb-4">
                            <img src={SamSungLogo} alt="Samsung" className="partner-logo" />
                        </Col>
                        <Col xs={6} md={2} className="text-center mb-4">
                            <img src={NisseiLogo} alt="Nissei" className="partner-logo" />
                        </Col>
                        <Col xs={6} md={2} className="text-center mb-4">
                            <img src={SonyLogo} alt="Sony" className="partner-logo" />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Footer Section */}
            <footer className="footer-section">
                <Container>
                    <Row>
                        <Col md={3} className="mb-4">
                            <h5>GIỚI THIỆU</h5>
                            <p>
                                CÔNG TY TNHH QUẢNG CÁO VÀ TỔ CHỨC SỰ KIỆN ĐẠI DƯƠNG được thành lập năm 1993. Là đơn vị hàng đầu trong ngành xây dựng Việt Nam.
                            </p>
                            <div className="social-icons">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram"></i>
                                </a>
                            </div>
                        </Col>
                        <Col md={3} className="mb-4">
                            <h5>TRỤ SỞ HÀ NỘI</h5>
                            <p>
                                Địa chỉ: Số 4 ngõ 364, ngách 94 hẻm 6 đường Giải Phóng, Phường Thịnh Liệt, Quận Hoàng Mai, Thành phố Hà Nội, Việt Nam.
                            </p>
                        </Col>
                        <Col md={3} className="mb-4">
                            <h5>BẢN ĐỒ</h5>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.729174263614!2d105.839987314692!3d20.999999994231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac810b8c8e1d%3A0x5c5e7b3b5b5b5b5b!2sHà%20Nội%2C%20Vietnam!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </Col>
                        <Col md={3} className="mb-4">
                            <h5>LỊCH LÀM VIỆC</h5>
                            <p>
                                Thời gian làm việc công ty <br />
                                Từ 8h - 22h (cả T7, CN)
                            </p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
}

export default Home;