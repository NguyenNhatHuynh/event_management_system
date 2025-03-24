// frontend/src/pages/client/BlogDetail.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../assets/styles/BlogDetail.css';

function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/blogs/public/${id}`);
                console.log('Dữ liệu từ API /api/blogs/public/:id:', response.data);
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
        return <Container className="mt-5"><div>Loading...</div></Container>;
    }

    if (!blog) {
        return <Container className="mt-5"><div>Bài viết không tồn tại hoặc chưa được phê duyệt.</div></Container>;
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
                    {blog.image ? (
                        <div className="blog-detail-image-wrapper">
                            <img
                                src={blog.image} // Sử dụng proxy
                                alt={blog.title}
                                className="blog-detail-image"
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
                            <div
                                className="placeholder-image"
                                style={{
                                    display: 'none',
                                    height: '300px',
                                    backgroundColor: '#f0f0f0',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <span>Không có hình ảnh</span>
                            </div>
                        </div>
                    ) : (
                        <div className="blog-detail-image-wrapper">
                            <div
                                className="placeholder-image"
                                style={{
                                    height: '300px',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <span>Không có hình ảnh</span>
                            </div>
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