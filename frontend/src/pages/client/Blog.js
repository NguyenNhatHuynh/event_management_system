// frontend/src/pages/client/Blog.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../assets/styles/Blog.css';

function Blog() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/blogs/public');
                console.log('Dữ liệu từ API /api/blogs/public:', response.data);
                setBlogs(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bài viết:', error);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <Container className="mt-5 blog-container">
            <h2 className="text-center mb-4">TIN TỨC & SỰ KIỆN</h2>
            <Row>
                {blogs.map((blog) => (
                    <Col md={4} key={blog._id} className="mb-4">
                        <Card className="blog-card">
                            {blog.image ? (
                                <Card.Img
                                    variant="top"
                                    src={`http://localhost:5000${blog.image}`}
                                    alt={blog.title}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        console.log('Lỗi tải hình ảnh:', blog.image);
                                        e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                                    }}
                                />
                            ) : (
                                <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span>Không có hình ảnh</span>
                                </div>
                            )}
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
        </Container>
    );
}

export default Blog;