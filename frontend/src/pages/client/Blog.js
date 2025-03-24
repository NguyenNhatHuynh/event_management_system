// frontend/src/pages/client/Blog.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../assets/styles/Blog.css';

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/blogs/public');
                console.log('Dữ liệu từ API /api/blogs/public:', response.data);
                setBlogs(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bài viết:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) {
        return <Container className="mt-5"><div>Loading...</div></Container>;
    }

    return (
        <Container className="mt-5 blog-container">
            <h2 className="text-center mb-4">TIN TỨC & SỰ KIỆN</h2>
            {blogs.length === 0 ? (
                <div className="text-center">Không có bài viết nào để hiển thị.</div>
            ) : (
                <Row>
                    {blogs.map((blog) => (
                        <Col md={4} key={blog._id} className="mb-4">
                            <Card className="blog-card">
                                {blog.image ? (
                                    <Card.Img
                                        variant="top"
                                        src={blog.image} // Sử dụng proxy
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
            )}
        </Container>
    );
}

export default Blog;