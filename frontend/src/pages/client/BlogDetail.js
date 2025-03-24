// frontend/src/pages/client/BlogDetail.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../assets/styles/BlogDetail.css';

function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/blogs/public/${id}`);
                setBlog(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết bài viết:', error);
            }
        };
        fetchBlog();
    }, [id]);

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <div className="blog-detail-header">
                        <h1 className="blog-detail-title">{blog.title}</h1>
                        <p className="blog-detail-meta">
                            {new Date(blog.createdAt).toLocaleDateString('vi-VN')} - {blog.category}
                        </p>
                    </div>
                    {blog.image && (
                        <div className="blog-detail-image-wrapper">
                            <img
                                src={`http://localhost:5000${blog.image}`}
                                alt={blog.title}
                                className="blog-detail-image"
                            />
                        </div>
                    )}
                    <div
                        className="blog-detail-content"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default BlogDetail;