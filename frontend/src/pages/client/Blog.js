import React from 'react';
import { Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../assets/styles/Client.css';

// Import hình ảnh từ thư mục src/assets/images (nếu có)
import BlogImage1 from '../../assets/images/hero-event.png';


function Blog() {
    // Dữ liệu bài viết mẫu (có thể lấy từ API trong thực tế)
    const blogPosts = [
        {
            id: 1,
            title: 'Top Event Trends in 2025',
            description: 'Khám phá những xu hướng tổ chức sự kiện mới nhất trong năm 2025, từ công nghệ thực tế ảo đến các ý tưởng sáng tạo.',
            date: '20/03/2025',
            image: BlogImage1,
        },
        {
            id: 2,
            title: 'How to Plan a Perfect Wedding',
            description: 'Hướng dẫn chi tiết để tổ chức một đám cưới hoàn hảo, từ việc chọn địa điểm đến quản lý ngân sách.',
            date: '15/03/2025',
            image: BlogImage1,
        },
        {
            id: 3,
            title: 'Corporate Events: Tips for Success',
            description: 'Những mẹo hữu ích để tổ chức các sự kiện doanh nghiệp thành công, thu hút khách hàng và đối tác.',
            date: '10/03/2025',
            image: BlogImage1,
        },
        {
            id: 4,
            title: 'The Future of Hybrid Events',
            description: 'Tìm hiểu về tương lai của các sự kiện kết hợp (hybrid events) và cách chúng thay đổi ngành tổ chức sự kiện.',
            date: '05/03/2025',
            image: BlogImage1,
        },
    ];

    return (
        <div>
            {/* Header Section */}
            <section className="blog-header-section">
                <Container className="text-center">
                    <h1>TIN TỨC & SỰ KIỆN</h1>
                </Container>
            </section>

            {/* Blog Posts Section */}
            <section className="blog-posts-section">
                <Container>
                    <Row>
                        {blogPosts.map((post) => (
                            <Col md={6} lg={3} key={post.id} className="mb-4">
                                <Card className="blog-card">
                                    <div className="blog-image-wrapper">
                                        <Card.Img
                                            variant="top"
                                            src={post.image || 'https://via.placeholder.com/300x200'}
                                            alt={post.title}
                                        />
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{post.title}</Card.Title>
                                        <Card.Text className="text-muted">{post.date}</Card.Text>
                                        <Card.Text>{post.description}</Card.Text>
                                        <Button
                                            as={Link}
                                            to={`/blog/${post.id}`}
                                            className="blog-read-more-button"
                                        >
                                            Đọc thêm
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Pagination */}
                    <div className="text-center mt-5">
                        <Pagination>
                            <Pagination.Prev />
                            <Pagination.Item active>{1}</Pagination.Item>
                            <Pagination.Item>{2}</Pagination.Item>
                            <Pagination.Item>{3}</Pagination.Item>
                            <Pagination.Next />
                        </Pagination>
                    </div>
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

export default Blog;