// frontend/src/pages/admin/CustomerManagement.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Nav, Modal } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/Admin.css';

function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        customerCode: '',
        fullName: '',
        phone: '',
        email: '',
        address: '',
    });
    const [editFormData, setEditFormData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    // Lấy danh sách khách hàng
    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/customers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCustomers(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Lấy danh sách khách hàng thất bại');
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Thêm khách hàng
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/customers', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCustomers([...customers, response.data]);
            setFormData({ customerCode: '', fullName: '', phone: '', email: '', address: '' });
            toast.success('Thêm khách hàng thành công!');
        } catch (error) {
            setError(error.response?.data?.message || 'Thêm khách hàng thất bại');
            toast.error(error.response?.data?.message || 'Thêm khách hàng thất bại');
        }
    };

    // Mở modal chỉnh sửa
    const handleEdit = (customer) => {
        setEditFormData(customer);
        setShowModal(true);
    };

    // Cập nhật khách hàng
    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.put(
                `http://localhost:5000/api/customers/${editFormData._id}`,
                editFormData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setCustomers(
                customers.map((customer) =>
                    customer._id === editFormData._id ? response.data : customer
                )
            );
            setShowModal(false);
            toast.success('Cập nhật khách hàng thành công!');
        } catch (error) {
            setError(error.response?.data?.message || 'Cập nhật khách hàng thất bại');
            toast.error(error.response?.data?.message || 'Cập nhật khách hàng thất bại');
        }
    };

    // Xóa khách hàng
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/customers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setCustomers(customers.filter((customer) => customer._id !== id));
                toast.success('Xóa khách hàng thành công!');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Xóa khách hàng thất bại');
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
                            Customer Management
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
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Mã khách hàng"
                                                value={formData.customerCode}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, customerCode: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Họ và tên"
                                                value={formData.fullName}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, fullName: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Số điện thoại"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, phone: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Control
                                                type="email"
                                                placeholder="Email (tùy chọn)"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, email: e.target.value })
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
                                <Row className="mt-3">
                                    <Col md={12}>
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
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="admin-card">
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Mã khách hàng</th>
                                        <th>Họ và tên</th>
                                        <th>Số điện thoại</th>
                                        <th>Email</th>
                                        <th>Địa chỉ</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer) => (
                                        <tr key={customer._id}>
                                            <td>{customer.customerCode}</td>
                                            <td>{customer.fullName}</td>
                                            <td>{customer.phone}</td>
                                            <td>{customer.email || '-'}</td>
                                            <td>{customer.address || '-'}</td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(customer)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(customer._id)}
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
                    <Modal.Title>Chỉnh sửa khách hàng</Modal.Title>
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
                                <Form.Label>Mã khách hàng</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.customerCode}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, customerCode: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Họ và tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.fullName}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, fullName: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.phone}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, phone: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={editFormData.email || ''}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, email: e.target.value })
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