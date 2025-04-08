// frontend/src/pages/admin/CustomerManagement.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/Admin.css';

function CustomerManagement() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phone: '',
        address: '',
    });
    const [editFormData, setEditFormData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [totalUsers, setTotalUsers] = useState(0); // Tổng số người dùng
    const limit = 6; // Số lượng người dùng trên mỗi trang

    // Lấy danh sách khách hàng với phân trang
    const fetchUsers = async (page = 1) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/users?page=${page}&limit=${limit}&role=customer`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setUsers(response.data.users);
            setCurrentPage(response.data.currentPage || 1);
            setTotalPages(response.data.totalPages || 1);
            setTotalUsers(response.data.totalUsers || 0);
        } catch (error) {
            console.error(error);
            toast.error('Lấy danh sách khách hàng thất bại');
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]); // Gọi lại fetchUsers khi currentPage thay đổi

    // Thêm tài khoản khách hàng mới
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(
                'http://localhost:5000/api/users',
                {
                    ...formData,
                    role: 'customer', // Đảm bảo vai trò là customer
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setUsers([...users, response.data]);
            setFormData({ username: '', email: '', password: '', fullName: '', phone: '', address: '' });
            toast.success('Thêm tài khoản khách hàng thành công!');
            fetchUsers(currentPage); // Làm mới danh sách sau khi thêm
        } catch (error) {
            setError(error.response?.data?.message || 'Thêm tài khoản khách hàng thất bại');
            toast.error(error.response?.data?.message || 'Thêm tài khoản khách hàng thất bại');
        }
    };

    // Mở modal chỉnh sửa
    const handleEdit = (user) => {
        setEditFormData(user);
        setShowModal(true);
    };

    // Cập nhật thông tin khách hàng
    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.put(
                `http://localhost:5000/api/users/${editFormData._id}`,
                editFormData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setUsers(
                users.map((user) =>
                    user._id === editFormData._id ? response.data : user
                )
            );
            setShowModal(false);
            toast.success('Cập nhật thông tin khách hàng thành công!');
            fetchUsers(currentPage); // Làm mới danh sách sau khi cập nhật
        } catch (error) {
            setError(error.response?.data?.message || 'Cập nhật thông tin khách hàng thất bại');
            toast.error(error.response?.data?.message || 'Cập nhật thông tin khách hàng thất bại');
        }
    };

    // Xóa tài khoản khách hàng
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản khách hàng này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsers(users.filter((user) => user._id !== id));
                toast.success('Xóa tài khoản khách hàng thành công!');
                fetchUsers(currentPage); // Làm mới danh sách sau khi xóa
            } catch (error) {
                toast.error(error.response?.data?.message || 'Xóa tài khoản khách hàng thất bại');
            }
        }
    };

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
        }
    };

    return (
        <Container fluid className="admin-container">
            <ToastContainer />
            <Row>
                <Col md={12}>
                    <h1 className="mb-4">Quản lý khách hàng</h1>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <Form onSubmit={handleSubmit}>
                                <Row className="align-items-end">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Tên người dùng</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tên người dùng"
                                                value={formData.username}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, username: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, email: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Mật khẩu</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Mật khẩu"
                                                value={formData.password}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, password: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Họ và tên</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Họ và tên (tùy chọn)"
                                                value={formData.fullName}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, fullName: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Button type="submit" variant="primary" className="w-100">
                                            Thêm khách hàng
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Số điện thoại</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Số điện thoại (tùy chọn)"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, phone: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={9}>
                                        <Form.Group>
                                            <Form.Label>Địa chỉ</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Địa chỉ (tùy chọn)"
                                                value={formData.address}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, address: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="admin-card">
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Tên người dùng</th>
                                        <th>Họ và tên</th>
                                        <th>Email</th>
                                        <th>Số điện thoại</th>
                                        <th>Địa chỉ</th>
                                        <th>Vai trò</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.username}</td>
                                            <td>{user.fullName || '-'}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone || '-'}</td>
                                            <td>{user.address || '-'}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* Phân trang */}
                            {totalUsers > 0 && (
                                <Row className="mt-4">
                                    <Col className="d-flex justify-content-between align-items-center">
                                        <div>
                                            Tổng số khách hàng: {totalUsers}
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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal chỉnh sửa khách hàng */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa thông tin khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    {editFormData && (
                        <Form onSubmit={handleUpdate}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên người dùng</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.username}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, username: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Họ và tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.fullName || ''}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, fullName: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, email: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.phone || ''}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, phone: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.address || ''}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, address: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Lưu thay đổi
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default CustomerManagement;