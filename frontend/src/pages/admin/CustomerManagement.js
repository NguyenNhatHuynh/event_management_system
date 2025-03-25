import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Nav, Modal } from 'react-bootstrap';
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

    // Lấy danh sách người dùng
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // Lọc chỉ lấy người dùng có vai trò là "customer"
            const customers = response.data.filter((user) => user.role === 'customer');
            setUsers(customers);
        } catch (error) {
            console.error(error);
            toast.error('Lấy danh sách khách hàng thất bại');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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
            } catch (error) {
                toast.error(error.response?.data?.message || 'Xóa tài khoản khách hàng thất bại');
            }
        }
    };

    return (
        <Container fluid className="admin-container">
            <ToastContainer />
            <Row>
                <Col md={3} className="admin-sidebar">
                    <Nav className="flex-column">
                        <Nav.Link as="a" href="/admin/dashboard">
                            Dashboard
                        </Nav.Link>
                        <Nav.Link as="a" href="/admin/users">
                            Quản lý khách hàng
                        </Nav.Link>
                    </Nav>
                </Col>
                <Col md={9}>
                    <h1 className="mb-4">Quản lý khách hàng</h1>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={3}>
                                        <Form.Group>
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
                                    <Col md={3}>
                                        <Form.Group>
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
                                    <Col md={3}>
                                        <Form.Group>
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
                                </Row>
                                <Row className="mt-3">
                                    <Col md={3}>
                                        <Form.Group>
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
                                    <Col md={7}>
                                        <Form.Group>
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
                                    <Col md={2}>
                                        <Button type="submit" variant="primary">
                                            Thêm khách hàng
                                        </Button>
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