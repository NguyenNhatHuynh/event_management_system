import React, { useState } from 'react';
import { Container, Row, Col, ListGroup, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../assets/styles/Client.css';

// Import hình ảnh từ thư mục src/assets/images (nếu có)
import EventImage1 from '../../assets/images/hero-event.png';

function EventTypes() {
    // Dữ liệu mẫu cho các loại sự kiện và sự kiện
    const eventCategories = [
        { id: 1, name: 'Tổ chức Road Show' },
        { id: 2, name: 'Tổ chức Biểu diễn Nghệ thuật' },
        { id: 3, name: 'Tổ chức Khai trương - Khánh thành' },
        { id: 4, name: 'Tổ chức Lễ ra mắt' },
    ];

    const eventsData = [
        {
            id: 1,
            categoryId: 1,
            title: 'Tổ chức Road Show',
            description:
                'Chắc chắn bạn đã từng ít nhất một lần nhìn thấy những nhóm người mặc đồng phục, di chuyển trên các phương tiện như xe máy...',
            date: '21/03/2025',
            image: EventImage1,
        },
        {
            id: 2,
            categoryId: 2,
            title: 'Tổ chức Biểu diễn Nghệ thuật',
            description:
                'Tổ chức chương trình sự kiện biểu diễn nghệ thuật vừa mang đặc điểm nghệ thuật, vừa mang tính giải trí...',
            date: '21/03/2025',
            image: EventImage1,
        },
        {
            id: 3,
            categoryId: 3,
            title: 'Tổ chức Khai trương - Khánh thành',
            description:
                'Tổ chức sự kiện lễ khai trương, khánh thành là một trong những dấu mốc quan trọng của doanh nghiệp...',
            date: '21/03/2025',
            image: EventImage1,
        },
        {
            id: 4,
            categoryId: 4,
            title: 'Tổ chức Lễ ra mắt',
            description:
                'Tổ chức sự kiện lễ ra mắt sản phẩm mới là một trong những sự kiện quan trọng để quảng bá thương hiệu...',
            date: '21/03/2025',
            image: EventImage1,
        },
    ];

    // State để theo dõi loại sự kiện được chọn
    const [selectedCategory, setSelectedCategory] = useState(eventCategories[0].id);

    // Lọc các sự kiện theo loại đã chọn
    const filteredEvents = eventsData.filter(
        (event) => event.categoryId === selectedCategory
    );

    return (
        <div>
            {/* Header Section */}
            <section className="event-types-header-section">
                <Container className="text-center">
                    <h1>CÁC LOẠI SỰ KIỆN</h1>
                </Container>
            </section>

            {/* Categories and Events Section */}
            <section className="event-types-section">
                <Container>
                    <Row>
                        {/* Sidebar: Danh sách loại sự kiện */}
                        <Col md={3}>
                            <h4 className="mb-4">CÁC LOẠI SỰ KIỆN</h4>
                            <ListGroup>
                                {eventCategories.map((category) => (
                                    <ListGroup.Item
                                        key={category.id}
                                        active={selectedCategory === category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className="event-category-item"
                                    >
                                        {category.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>

                        {/* Danh sách sự kiện */}
                        <Col md={9}>
                            <h4 className="mb-4">
                                {eventCategories.find((cat) => cat.id === selectedCategory)?.name}
                            </h4>
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <Card key={event.id} className="event-item mb-4">
                                        <Row className="no-gutters">
                                            <Col md={4}>
                                                <Card.Img
                                                    src={event.image || 'https://via.placeholder.com/200x150'}
                                                    alt={event.title}
                                                    className="event-image"
                                                />
                                            </Col>
                                            <Col md={8}>
                                                <Card.Body>
                                                    <Card.Title>{event.title}</Card.Title>
                                                    <Card.Text className="text-muted">{event.date}</Card.Text>
                                                    <Card.Text>{event.description}</Card.Text>
                                                    <Button
                                                        as={Link}
                                                        to={`/event/${event.id}`}
                                                        className="event-read-more-button"
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                </Card.Body>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))
                            ) : (
                                <p>Chưa có sự kiện nào trong danh mục này.</p>
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <Container className="text-center">
                    <h2>BẠN MUỐN TỔ CHỨC SỰ KIỆN?</h2>
                    <Button
                        variant="light"
                        size="lg"
                        as={Link}
                        to="/contact"
                        className="mt-3 cta-button"
                    >
                        Liên hệ ngay
                    </Button>
                </Container>
            </section>
        </div>
    );
}

export default EventTypes;