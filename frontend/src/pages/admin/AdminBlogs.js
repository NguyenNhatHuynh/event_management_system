// frontend/src/pages/admin/AdminBlogs.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

function AdminBlogs() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Vui lòng đăng nhập để tiếp tục!');
                return;
            }
            const response = await axios.get('http://localhost:5000/api/blogs', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBlogs(response.data);
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách bài viết: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Xóa bài viết thành công!');
                fetchBlogs();
            } catch (error) {
                toast.error('Lỗi khi xóa bài viết: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleToggleApproval = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/blogs/${id}/toggle-approval`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Cập nhật trạng thái phê duyệt thành công!');
            fetchBlogs();
        } catch (error) {
            toast.error('Lỗi khi chuyển đổi trạng thái: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Container className="mt-5">
            <h2>QUẢN LÝ BÀI VIẾT</h2>
            <Button as={Link} to="/admin/blogs/add" variant="primary" className="mb-3">
                Thêm bài viết
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tiêu đề</th>
                        <th>Ngày đăng</th>
                        <th>Danh mục</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog, index) => (
                        <tr key={blog._id}>
                            <td>{index + 1}</td>
                            <td>{blog.title}</td>
                            <td>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td>{blog.category}</td>
                            <td>
                                <Button
                                    variant={blog.status === 'approved' ? 'success' : 'warning'}
                                    onClick={() => handleToggleApproval(blog._id)}
                                >
                                    {blog.status === 'approved' ? 'Đã phê duyệt' : 'Đang chờ phê duyệt'}
                                </Button>
                            </td>
                            <td>
                                <Button
                                    variant="warning"
                                    as={Link}
                                    to={`/admin/blogs/edit/${blog._id}`}
                                    className="me-2"
                                >
                                    Sửa
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(blog._id)}
                                >
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