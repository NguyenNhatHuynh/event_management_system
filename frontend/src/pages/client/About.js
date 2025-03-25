import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../../assets/styles/Client.css';
import EventAbout from '../../assets/images/Logo.png';
import NewBeginning from '../../assets/images/new-beginning.png';

function About() {
    return (
        <div>
            {/* Header Section */}
            <section className="about-header-section">
                <Container className="text-center">
                    <h1>CÔNG TY EVENTPRO - XoanDev</h1>
                    <p className="lead">Chuyên kiến trúc và xây dựng Thái Bình Dương</p>
                    <Button href="/contact" className="cta-button mt-3">
                        Liên hệ ngay
                    </Button>
                </Container>
            </section>

            {/* Introduction Section */}
            <section className="about-section">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} className="mb-4 mb-md-0">
                            <h2>GIỚI THIỆU CHUNG</h2>
                            <p>
                                EventPro được thành lập năm 2000, chuyên ngành kiến trúc và xây dựng với chất lượng, kỹ thuật và mỹ thuật cao vượt trội, đáp ứng kỳ vọng và mong muốn của khách hàng từ nhà văn phòng, nhà ở cao cấp...
                            </p>
                            <p>
                                Trải qua 25 năm xây dựng và phát triển, EventPro đã trở thành Tập đoàn Xây dựng lớn mạnh với 12 công ty thành viên, 2500 cán bộ kỹ sư, kiến trúc sư và trên 5000 công nhân viên, được hỗ trợ bởi các thiết bị máy móc đồng bộ, hiện đại.
                            </p>
                        </Col>
                        <Col md={6}>
                            <img
                                src={EventAbout}
                                alt="Giới thiệu EventPro"
                                className="img-fluid rounded"
                            />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Milestone Section */}
            <section className="about-section bg-light">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} className="order-md-2 mb-4 mb-md-0">
                            <h2>CÁC MỐC LỊCH SỬ</h2>
                            <p>
                                Hơn hai mươi năm trước, EventPro đã tiên phong với những bước đi chứng minh khi đất nước bước vào thời kỳ đổi mới.
                            </p>
                            <p>
                                Và giờ đây, những bước chân ấy đã để lại dấu ấn với lễ khánh thành đầu tiên trên mọi lĩnh vực, nhưng vẫn giữ vững tâm thế và dáng hình – vững chắc và mạnh mẽ hơn bao giờ hết.
                            </p>
                        </Col>
                        <Col md={6} className="order-md-1">
                            <img
                                src={NewBeginning}
                                alt="Cột mốc lịch sử"
                                className="img-fluid rounded"
                            />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Vision Section (Thêm mới để tăng tính chuyên nghiệp) */}
            <section className="about-section">
                <Container className="text-center">
                    <h2>TẦM NHÌN & SỨ MỆNH</h2>
                    <p className="lead mx-auto" style={{ maxWidth: '800px' }}>
                        EventPro cam kết mang đến những công trình bền vững, thẩm mỹ và sáng tạo, góp phần nâng cao chất lượng cuộc sống và phát triển cộng đồng.
                    </p>
                    <Button href="/portfolio" className="cta-button mt-3">
                        Xem dự án của chúng tôi
                    </Button>
                </Container>
            </section>
        </div>
    );
}

export default About;