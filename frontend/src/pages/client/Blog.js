// frontend/src/pages/client/Blog.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Pagination, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../assets/styles/Blog.css';

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [limit, setLimit] = useState(6); // Số lượng bài viết trên mỗi trang

    const fetchBlogs = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/blogs/public?page=${page}&limit=${limit}`);
            console.log('Dữ liệu từ API /api/blogs/public:', response.data);
            setBlogs(response.data.blogs);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setTotalBlogs(response.data.totalBlogs);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bài viết:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage, limit]); // Gọi lại fetchBlogs khi currentPage hoặc limit thay đổi

    // Hàm xử lý chuyển trang
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) {
        return <Container className="mt-5"><div>Loading...</div></Container>;
    }

    return (
        <Container className="mt-5 blog-container">
            <h2 className="text-center mb-4">TIN TỨC & SỰ KIỆN</h2>
            {blogs.length === 0 ? (
                <div className="text-center">Không có bài viết nào để hiển thị.</div>
            ) : (
                <>
                    <Row>
                        {blogs.map((blog) => (
                            <Col md={4} key={blog._id} className="mb-4">
                                <Card className="blog-card">
                                    {blog.image ? (
                                        <Card.Img
                                            variant="top"
                                            src={blog.image}
                                            alt={blog.title}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                console.error(`Lỗi tải hình ảnh: ${blog.image}`);
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                            onLoad={(e) => {
                                                console.log(`Hình ảnh tải thành công: ${blog.image}`);
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
                        ))}
                    </Row>

                    {/* Phân trang */}
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
                                    setCurrentPage(1); // Reset về trang 1 khi thay đổi limit
                                    fetchBlogs(1);
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
                                disabled={currentPage === 1}
                            />
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
                            <Pagination.Last
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>
                </>
            )}
        </Container>
    );
}

export default Blog;