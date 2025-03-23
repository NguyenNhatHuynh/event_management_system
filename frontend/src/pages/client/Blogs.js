// frontend/src/pages/client/Blog.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Pagination, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/Client.css';

function Blog() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const fetchBlogs = async (page = 1) => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/blogs/public`, {
                    params: {
                        page,
                        limit: 4,
                        category: category || undefined,
                        search: searchTerm || undefined,
                    },
                });
                setBlogPosts(response.data.blogs);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bài viết:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs(currentPage);
    }, [currentPage, category, searchTerm]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <section className="blog-header-section">
                <Container className="text-center">
                    <h1>TIN TỨC & SỰ KIỆN</h1>
                </Container>
            </section>

            <section className="blog-posts-section">
                <Container>
                    <Row className="mb-4">
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                as="select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Tất cả danh mục</option>
                                <option value="Tin tức">Tin tức</option>
                                <option value="Hướng dẫn">Hướng dẫn</option>
                                <option value="Sự kiện">Sự kiện</option>
                                <option value="Khác">Khác</option>
                            </Form.Control>
                        </Col>
                    </Row>
                    {loading ? (
                        <div className="text-center">
                            <p>Đang tải...</p>
                        </div>
                    ) : (
                        <>
                            <Row>
                                {blogPosts.map((post) => (
                                    <Col md={6} lg={3} key={post._id} className="mb-4">
                                        <Card className="blog-card">
                                            <div className="blog-image-wrapper">
                                                <Card.Img
                                                    variant="top"
                                                    src={post.image ? `http://localhost:5000${post.image}` : 'https://via.placeholder.com/300x200'}
                                                    alt={post.title}
                                                />
                                            </div>
                                            <Card.Body>
                                                <Card.Title>{post.title}</Card.Title>
                                                <Card.Text className="text-muted">
                                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                                </Card.Text>
                                                <Card.Text>{post.content.substring(0, 100)}...</Card.Text>
                                                <Button
                                                    as={Link}
                                                    to={`/blog/${post._id}`}
                                                    className="blog-read-more-button"
                                                >
                                                    Đọc thêm
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {totalPages > 1 && (
                                <div className="text-center mt-5">
                                    <Pagination>
                                        <Pagination.Prev
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        />
                                        {[...Array(totalPages).keys()].map((page) => (
                                            <Pagination.Item
                                                key={page + 1}
                                                active={page + 1 === currentPage}
                                                onClick={() => handlePageChange(page + 1)}
                                            >
                                                {page + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        />
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </Container>
            </section>

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