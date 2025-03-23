// frontend/src/pages/client/BlogDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/blogs/public/${id}`);
                setBlog(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết bài viết:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-5">Đang tải...</div>;
    }

    if (!blog) {
        return <div className="text-center mt-5">Bài viết không tồn tại</div>;
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col md={8} className="mx-auto">
                    <Card>
                        {blog.image && (
                            <Card.Img
                                variant="top"
                                src={`http://localhost:5000${blog.image}`}
                                alt={blog.title}
                            />
                        )}
                        <Card.Body>
                            <Card.Title>{blog.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                {new Date(blog.createdAt).toLocaleDateString('vi-VN')} - {blog.category}
                            </Card.Subtitle>
                            <Card.Text>{blog.content}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default BlogDetail;