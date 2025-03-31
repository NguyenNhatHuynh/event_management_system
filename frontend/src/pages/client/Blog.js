// frontend/src/pages/client/Blog.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Pagination, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import { FaSearch } from 'react-icons/fa'; // Thêm icon search
import '../../assets/styles/Blog.css';

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [limit, setLimit] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBlogs = useCallback(async (page = 1, search = '') => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/blogs/public`, {
                params: { page, limit, search },
                timeout: 5000
            });
            setBlogs(response.data.blogs);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setTotalBlogs(response.data.totalBlogs);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bài viết:', error);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    const debouncedFetchBlogs = useMemo(() =>
        debounce((page, search) => fetchBlogs(page, search), 300),
        [fetchBlogs]
    );

    useEffect(() => {
        debouncedFetchBlogs(currentPage, searchTerm);
        return () => debouncedFetchBlogs.cancel();
    }, [currentPage, searchTerm, debouncedFetchBlogs]);

    const handlePageChange = useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);

    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    const blogList = useMemo(() => (
        blogs.map((blog) => (
            <Col md={4} key={blog._id} className="mb-4">
                <Card className="blog-card">
                    {blog.image ? (
                        <Card.Img
                            variant="top"
                            src={blog.image}
                            alt={blog.title}
                            style={{ height: '200px', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                                e.target.style.display = 'block';
                                e.target.nextSibling.style.display = 'none';
                            }}
                        />
                    ) : null}
                    <div
                        className="placeholder-image"
                        style={{
                            height: '200px',
                            backgroundColor: '#f0f0f0',
                            display: blog.image ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <span>Không có hình ảnh</span>
                    </div>
                    <Card.Body>
                        <Card.Title>{blog.title}</Card.Title>
                        <Card.Text>
                            <small className="text-muted">
                                {new Date(blog.createdAt).toLocaleDateString('vi-VN')} - {blog.category}
                            </small>
                        </Card.Text>
                        <Button as={Link} to={`/blog/${blog._id}`} variant="primary">
                            Đọc thêm
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        ))
    ), [blogs]);

    return (
        <Container className="mt-5 blog-container">
            <h2 className="text-center mb-4">TIN TỨC & SỰ KIỆN</h2>

            <div className="search-container mb-5">
                <Form className="search-form">
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        {loading && (
                            <Spinner
                                animation="border"
                                size="sm"
                                className="search-spinner"
                            />
                        )}
                    </div>
                </Form>
            </div>

            {loading && blogs.length === 0 ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : blogs.length === 0 ? (
                <div className="text-center fade-in">Không tìm thấy bài viết nào.</div>
            ) : (
                <>
                    <Row className="fade-in">
                        {blogList}
                    </Row>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <div>
                            Tổng số bài viết: {totalBlogs}
                        </div>
                        <div>
                            <Form.Select
                                size="sm"
                                value={limit}
                                onChange={(e) => {
                                    setLimit(parseInt(e.target.value));
                                    setCurrentPage(1);
                                }}
                                style={{ width: '150px' }}
                            >
                                <option value={3}>3 bài viết/trang</option>
                                <option value={6}>6 bài viết/trang</option>
                                <option value={9}>9 bài viết/trang</option>
                            </Form.Select>
                        </div>
                        <Pagination>
                            <Pagination.First
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1 || loading}
                            />
                            <Pagination.Prev
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                            />
                            {[...Array(totalPages).keys()].map((page) => (
                                <Pagination.Item
                                    key={page + 1}
                                    active={page + 1 === currentPage}
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={loading}
                                >
                                    {page + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || loading}
                            />
                            <Pagination.Last
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages || loading}
                            />
                        </Pagination>
                    </div>
                </>
            )}
        </Container>
    );
}

export default Blog;