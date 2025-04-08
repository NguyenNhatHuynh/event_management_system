import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Pagination, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../../assets/styles/Admin.css';

function AdminBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const limit = 5;
    const navigate = useNavigate();

    const fetchBlogs = async (page = 1) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục!');
            }
            const response = await axios.get(`http://localhost:5000/api/blogs?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Admin Blogs API Response:', response.data); // Debug: Log the API response
            setBlogs(response.data.blogs || []);
            setCurrentPage(response.data.currentPage || 1);
            setTotalPages(response.data.totalPages || 1);
            setTotalBlogs(response.data.totalBlogs || 0);
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách bài viết: ' + (error.response?.data?.message || error.message));
            setBlogs([]);
            setTotalPages(1);
            setTotalBlogs(0);
        }
    };

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage]);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Xóa bài viết thành công!');
                fetchBlogs(currentPage); // Refresh the list after deletion
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
            toast.success('Cập nhật trạng thái phê duyệt thành công!');
            fetchBlogs(currentPage); // Refresh the list after toggling approval
        } catch (error) {
            toast.error('Lỗi khi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0);
        }
    };

    return (
        <Container className="mt-5 admin-container">
            <h2>QUẢN LÝ BÀI VIẾT</h2>
            <Button variant="primary" onClick={() => navigate('/admin/blogs/add')} className="mb-3">
                Thêm bài viết
            </Button>
            <Table striped bordered hover responsive>
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
                            <td>
                                <Badge
                                    bg={blog.status === 'approved' ? 'success' : 'warning'}
                                    className="status-badge"
                                >
                                    {blog.status === 'approved' ? 'Đã phê duyệt' : 'Đang chờ phê duyệt'}
                                </Badge>
                            </td>
                            <td className="action-column">
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id="toggle-tooltip">
                                            {blog.status === 'approved' ? 'Hủy phê duyệt' : 'Phê duyệt'}
                                        </Tooltip>
                                    }
                                >
                                    <Button
                                        variant={blog.status === 'approved' ? 'warning' : 'success'}
                                        size="sm"
                                        onClick={() => handleToggleApproval(blog._id)}
                                        className="action-btn toggle-btn me-2"
                                    >
                                        {blog.status === 'approved' ? 'Hủy' : 'Duyệt'}
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="edit-tooltip">Sửa</Tooltip>}
                                >
                                    <Button
                                        variant="link"
                                        className="action-btn edit-btn me-2"
                                        onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                                    >
                                        <FaEdit />
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="delete-tooltip">Xóa</Tooltip>}
                                >
                                    <Button
                                        variant="link"
                                        className="action-btn delete-btn"
                                        onClick={() => handleDelete(blog._id)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </OverlayTrigger>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {totalBlogs > 0 && (
                <Row className="mt-4">
                    <Col className="d-flex justify-content-between align-items-center">
                        <div>
                            Tổng số bài viết: {totalBlogs}
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
                    </Col>
                </Row>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </Container>
    );
}

export default AdminBlogs;