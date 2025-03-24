// frontend/src/pages/admin/AdminBlogs.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function AdminBlogs() {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/blogs', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBlogs(response.data);
            } catch (error) {
                toast.error('Lỗi khi lấy danh sách bài viết: ' + (error.response?.data?.message || error.message));
            }
        };
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBlogs(blogs.filter((blog) => blog._id !== id));
                toast.success('Xóa bài viết thành công!');
            } catch (error) {
                toast.error('Lỗi khi xóa bài viết: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleToggleApproval = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(`http://localhost:5000/api/blogs/toggle-approval/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBlogs(blogs.map((blog) => (blog._id === id ? response.data : blog)));
            toast.success('Cập nhật trạng thái phê duyệt thành công!');
        } catch (error) {
            toast.error('Lỗi khi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Container className="mt-5">
            <h2>QUẢN LÝ BÀI VIẾT</h2>
            <Button variant="primary" onClick={() => navigate('/admin/blogs/add')} className="mb-3">
                Thêm bài viết
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Danh mục</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog._id}>
                            <td>{blog.title}</td>
                            <td>{blog.category}</td>
                            <td>{blog.status === 'approved' ? 'Đã phê duyệt' : 'Đang chờ phê duyệt'}</td>
                            <td>
                                <Button
                                    variant={blog.status === 'approved' ? 'warning' : 'success'}
                                    onClick={() => handleToggleApproval(blog._id)}
                                    className="me-2"
                                >
                                    {blog.status === 'approved' ? 'Hủy phê duyệt' : 'Phê duyệt'}
                                </Button>
                                <Button
                                    variant="info"
                                    onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                                    className="me-2"
                                >
                                    Sửa
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(blog._id)}>
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ToastContainer position="top-right" autoClose={3000} />
        </Container>
    );
}

export default AdminBlogs;