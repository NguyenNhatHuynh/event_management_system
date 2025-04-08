import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Pagination, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/Client.css';

// Utility function to strip HTML tags and get plain text
const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
};

function Blog() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const fetchBlogs = async (page = 1) => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:5000/api/blogs/public`, {
                    params: {
                        page,
                        limit: 4,
                        category: category || undefined,
                        search: searchTerm || undefined,
                    },
                    timeout: 5000,
                });
                setBlogPosts(response.data.blogs || []);
                setCurrentPage(response.data.currentPage || 1);
                setTotalPages(response.data.totalPages || 1);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bài viết:', error);
                setError('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
                setBlogPosts([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs(currentPage);
    }, [currentPage, category, searchTerm]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="blog-page">
            <section className="blog-header-section">
                <Container className="text-center">
                    <h1 className="blog-header-title">TIN TỨC & SỰ KIỆN</h1>
                </Container>
            </section>

            <section className="blog-posts-section">
                <Container>
                    <Row className="mb-5">
                        <Col md={4} className="mb-3 mb-md-0">
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="blog-search-input"
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                as="select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="blog-category-select"
                            >
                                <option value="">Chọn danh mục</option>
                                <option value="Tin tức">Tin tức</option>
                                <option value="Hướng dẫn">Hướng dẫn</option>
                                <option value="Sự kiện">Sự kiện</option>
                                <option value="Khác">Khác</option>
                            </Form.Control>
                        </Col>
                    </Row>

                    {error && (
                        <div className="text-center text-danger mb-4">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <Row>
                            {[...Array(4)].map((_, index) => (
                                <Col md={6} lg={3} key={index} className="mb-4">
                                    <Card className="blog-card skeleton">
                                        <div className="skeleton-image" />
                                        <Card.Body>
                                            <div className="skeleton-title" />
                                            <div className="skeleton-text" />
                                            <div className="skeleton-text short" />
                                            <div className="skeleton-button" />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : blogPosts.length === 0 ? (
                        <div className="text-center text-muted">
                            Không tìm thấy bài viết nào.
                        </div>
                    ) : (
                        <>
                            <Row>
                                {blogPosts.map((post) => {
                                    const plainTextContent = stripHtml(post.content);
                                    const excerpt = plainTextContent.length > 100
                                        ? `${plainTextContent.substring(0, 100)}...`
                                        : plainTextContent || 'Không có mô tả.';
                                    return (
                                        <Col md={6} lg={3} key={post._id} className="mb-4">
                                            <Card className="blog-card h-100">
                                                <div className="blog-image-wrapper">
                                                    <Card.Img
                                                        variant="top"
                                                        src={post.image ? `http://localhost:5000${post.image}` : 'https://via.placeholder.com/300x200?text=Không+có+hình+ảnh'}
                                                        alt={post.title}
                                                        className="blog-image"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/300x200?text=Không+có+hình+ảnh';
                                                        }}
                                                    />
                                                </div>
                                                <Card.Body className="d-flex flex-column">
                                                    <Card.Title className="blog-title">{post.title}</Card.Title>
                                                    <Card.Text className="text-muted blog-date">
                                                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                                    </Card.Text>
                                                    <Card.Text className="blog-excerpt">
                                                        {excerpt}
                                                    </Card.Text>
                                                    <Button
                                                        as={Link}
                                                        to={`/blog/${post._id}`}
                                                        className="blog-read-more-button mt-auto"
                                                    >
                                                        Đọc thêm
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>

                            {totalPages > 1 && (
                                <div className="text-center mt-5">
                                    <Pagination className="blog-pagination">
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
                    <h2 className="cta-title">BẠN MUỐN TỔ CHỨC SỰ KIỆN?</h2>
                    <Button
                        variant="light"
                        size="lg"
                        as={Link}
                        to="/contact"
                        className="cta-button"
                    >
                        Liên hệ ngay
                    </Button>
                </Container>
            </section>
        </div>
    );
}

export default Blog;