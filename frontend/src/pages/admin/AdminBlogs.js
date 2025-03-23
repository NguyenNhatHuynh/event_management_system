// frontend/src/pages/admin/AdminBlogs.js
import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editBlog, setEditBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Tin tức',
        image: null,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const fileInputRef = useRef(null);

    // Lấy danh sách bài viết từ backend
    const fetchBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/blogs', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setBlogs(response.data);
            setFilteredBlogs(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bài viết:', error);
            toast.error('Lấy danh sách bài viết thất bại');
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Lọc và tìm kiếm bài viết
    useEffect(() => {
        let filtered = blogs;

        if (filterCategory) {
            filtered = filtered.filter((blog) => blog.category === filterCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter((blog) =>
                blog.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredBlogs(filtered);
    }, [searchTerm, filterCategory, blogs]);

    // Thêm bài viết mới
    const handleAddBlog = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('content', formData.content);
            data.append('category', formData.category);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await axios.post('http://localhost:5000/api/blogs', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setBlogs([...blogs, response.data]);
            setFormData({ title: '', content: '', category: 'Tin tức', image: null });
            fileInputRef.current.value = '';
            setShowModal(false);
            toast.success('Thêm bài viết thành công!');
            fetchBlogs();
        } catch (error) {
            console.error('Lỗi khi thêm bài viết:', error);
            toast.error(error.response?.data?.message || 'Thêm bài viết thất bại');
        }
    };

    // Mở modal chỉnh sửa
    const handleEdit = (blog) => {
        setEditBlog(blog);
        setFormData({
            title: blog.title,
            content: blog.content,
            category: blog.category,
            image: null,
        });
        setShowModal(true);
    };

    // Cập nhật bài viết
    const handleUpdateBlog = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('content', formData.content);
            data.append('category', formData.category);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await axios.put(`http://localhost:5000/api/blogs/${editBlog._id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setBlogs(blogs.map((blog) => (blog._id === editBlog._id ? response.data : blog)));
            setFormData({ title: '', content: '', category: 'Tin tức', image: null });
            fileInputRef.current.value = '';
            setShowModal(false);
            setEditBlog(null);
            toast.success('Cập nhật bài viết thành công!');
            fetchBlogs();
        } catch (error) {
            console.error('Lỗi khi cập nhật bài viết:', error);
            toast.error(error.response?.data?.message || 'Cập nhật bài viết thất bại');
        }
    };

    // Xóa bài viết
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setBlogs(blogs.filter((blog) => blog._id !== id));
                toast.success('Xóa bài viết thành công!');
                fetchBlogs();
            } catch (error) {
                console.error('Lỗi khi xóa bài viết:', error);
                toast.error(error.response?.data?.message || 'Xóa bài viết thất bại');
            }
        }
    };

    return (
        <Container>
            <ToastContainer />
            <h2 className="mb-4">Quản lý bài viết</h2>
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm theo tiêu đề..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={4}>
                    <Form.Control
                        as="select"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        <option value="Tin tức">Tin tức</option>
                        <option value="Hướng dẫn">Hướng dẫn</option>
                        <option value="Sự kiện">Sự kiện</option>
                        <option value="Khác">Khác</option>
                    </Form.Control>
                </Col>
                <Col md={4} className="text-end">
                    <Button
                        variant="primary"
                        onClick={() => {
                            setEditBlog(null);
                            setFormData({ title: '', content: '', category: 'Tin tức', image: null });
                            setShowModal(true);
                        }}
                    >
                        Thêm bài viết
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tiêu đề</th>
                        <th>Nội dung</th>
                        <th>Danh mục</th>
                        <th>Ngày đăng</th>
                        <th>Hình ảnh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBlogs.map((blog) => (
                        <tr key={blog._id}>
                            <td>{blog._id}</td>
                            <td>{blog.title}</td>
                            <td>{blog.content.substring(0, 50)}...</td>
                            <td>{blog.category}</td>
                            <td>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td>
                                {blog.image ? (
                                    <img
                                        src={`http://localhost:5000${blog.image}`}
                                        alt={blog.title}
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                ) : (
                                    '-'
                                )}
                            </td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEdit(blog)}
                                >
                                    Sửa
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(blog._id)}
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal Thêm/Sửa bài viết */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={editBlog ? handleUpdateBlog : handleAddBlog}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tiêu đề</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Danh mục</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        <option value="Tin tức">Tin tức</option>
                                        <option value="Hướng dẫn">Hướng dẫn</option>
                                        <option value="Sự kiện">Sự kiện</option>
                                        <option value="Khác">Khác</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Hình ảnh</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            />
                            {editBlog && editBlog.image && !formData.image && (
                                <div className="mt-2">
                                    <img
                                        src={`http://localhost:5000${editBlog.image}`}
                                        alt={editBlog.title}
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                </div>
                            )}
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editBlog ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default AdminBlogs;