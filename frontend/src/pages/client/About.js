import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../../assets/styles/Client.css';


import EventAbout from '../../assets/images/about-event.gif';
import NewBeginning from '../../assets/images/new-beginning.png';

function About() {
    return (
        <div>
            {/* Header Section */}
            <section className="about-header-section">
                <Container className="text-center">
                    <h1>CÔNG TY THÁI BÌNH DƯƠNG</h1>
                    <p className="lead">Chuyên kiến trúc và xây dựng Thái Bình Dương</p>
                </Container>
            </section>

            {/* Introduction Section */}
            <section className="about-section">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h2>GIỚI THIỆU CHUNG</h2>
                            <p>
                                VINCO được thành lập năm 1993, chuyên ngành kiến trúc và xây dựng với chất lượng, kỹ thuật và mỹ thuật cao vượt trội, kỳ vọng và mong muốn của khách hàng, từ hộp nhà văn phòng, nhà ở cao cấp...
                            </p>
                            <p>
                                Trải qua 25 năm xây dựng và phát triển, VINCO đã trở thành Tập đoàn Xây dựng lớn mạnh với 12 công ty thành viên, 2500 cán bộ kỹ sư, kiến trúc sư và trên 5000 công nhân viên thông qua các thiết bị máy móc đồng bộ, hiện đại.
                            </p>
                        </Col>
                        <Col md={6}>
                            <img
                                src={EventAbout}
                                alt="Event"
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
                        <Col md={6} className="order-md-2">
                            <h2>CÁC MỐC LỊCH SỬ</h2>
                            <p>
                                Hơn hai mươi năm trước, VINCO đã đi những bước đi tiên phong chứng minh khi đạt nước bước vào thời kỳ đổi mới.
                            </p>
                            <p>
                                Và giờ đây, những bước chân ấy đã để lại dấu ấn Lễ Khánh thành đầu tiên trên mọi lĩnh vực từ S, nhưng vẫn còn một tâm thế, một dáng hình khác – vững chắc và mạnh mẽ hơn bao giờ hết.
                            </p>
                        </Col>
                        <Col md={6} className="order-md-1">
                            <img
                                src={NewBeginning}
                                alt="New Beginning"
                                className="img-fluid rounded"
                            />
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default About;