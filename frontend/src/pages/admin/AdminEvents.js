// frontend/src/pages/admin/AdminEvents.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Nav, Modal } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/Admin.css';

function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        eventCode: '',
        name: '',
        date: '',
        location: '',
        description: '',
        image: null,
    });
    const [editFormData, setEditFormData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    // Lấy danh sách sự kiện
    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/events', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setEvents(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sự kiện:', error);
            toast.error('Lấy danh sách sự kiện thất bại');
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Thêm sự kiện
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = new FormData();
            data.append('eventCode', formData.eventCode);
            data.append('name', formData.name);
            data.append('date', formData.date);
            data.append('location', formData.location);
            data.append('description', formData.description);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await axios.post('http://localhost:5000/api/events', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setEvents([...events, response.data]);
            setFormData({ eventCode: '', name: '', date: '', location: '', description: '', image: null });
            toast.success('Thêm sự kiện thành công!');
            fetchEvents(); // Làm mới danh sách từ database
        } catch (error) {
            console.error('Lỗi khi thêm sự kiện:', error);
            setError(error.response?.data?.message || 'Thêm sự kiện thất bại');
            toast.error(error.response?.data?.message || 'Thêm sự kiện thất bại');
        }
    };

    // Mở modal chỉnh sửa
    const handleEdit = (event) => {
        setEditFormData({
            ...event,
            date: new Date(event.date).toISOString().split('T')[0],
        });
        setShowModal(true);
    };

    // Cập nhật sự kiện
    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = new FormData();
            data.append('eventCode', editFormData.eventCode);
            data.append('name', editFormData.name);
            data.append('date', editFormData.date);
            data.append('location', editFormData.location);
            data.append('description', editFormData.description);
            if (editFormData.image && typeof editFormData.image !== 'string') {
                data.append('image', editFormData.image);
            }

            const response = await axios.put(
                `http://localhost:5000/api/events/${editFormData._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setEvents(
                events.map((event) => (event._id === editFormData._id ? response.data : event))
            );
            setShowModal(false);
            toast.success('Cập nhật sự kiện thành công!');
            fetchEvents(); // Làm mới danh sách từ database
        } catch (error) {
            console.error('Lỗi khi cập nhật sự kiện:', error);
            setError(error.response?.data?.message || 'Cập nhật sự kiện thất bại');
            toast.error(error.response?.data?.message || 'Cập nhật sự kiện thất bại');
        }
    };

    // Xóa sự kiện
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/events/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setEvents(events.filter((event) => event._id !== id));
                toast.success('Xóa sự kiện thành công!');
                fetchEvents(); // Làm mới danh sách từ database
            } catch (error) {
                console.error('Lỗi khi xóa sự kiện:', error);
                toast.error(error.response?.data?.message || 'Xóa sự kiện thất bại');
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
                        <Nav.Link as="a" href="/admin/events">
                            Quản lý sự kiện
                        </Nav.Link>
                    </Nav>
                </Col>
                <Col md={9}>
                    <h1 className="mb-4">Quản lý sự kiện</h1>
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
                                                placeholder="Mã sự kiện"
                                                value={formData.eventCode}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, eventCode: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tên sự kiện"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Control
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, date: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Địa điểm"
                                                value={formData.location}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, location: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Button type="submit" variant="primary">
                                            Thêm sự kiện
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Mô tả (tùy chọn)"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, description: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Hình ảnh</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setFormData({ ...formData, image: e.target.files[0] })
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
                                        <th>Mã sự kiện</th>
                                        <th>Tên sự kiện</th>
                                        <th>Ngày diễn ra</th>
                                        <th>Địa điểm</th>
                                        <th>Mô tả</th>
                                        <th>Hình ảnh</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event._id}>
                                            <td>{event.eventCode}</td>
                                            <td>{event.name}</td>
                                            <td>{new Date(event.date).toLocaleDateString('vi-VN')}</td>
                                            <td>{event.location}</td>
                                            <td>{event.description || '-'}</td>
                                            <td>
                                                {event.image ? (
                                                    <img
                                                        src={`http://localhost:5000${event.image}`}
                                                        alt={event.name}
                                                        style={{ width: '100px', height: 'auto' }}
                                                    />
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(event)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(event._id)}
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

            {/* Modal chỉnh sửa sự kiện */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa sự kiện</Modal.Title>
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
                                <Form.Label>Mã sự kiện</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.eventCode}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, eventCode: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên sự kiện</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, name: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ngày diễn ra</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={editFormData.date}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, date: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Địa điểm</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.location}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, location: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editFormData.description || ''}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, description: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Hình ảnh hiện tại</Form.Label>
                                <div>
                                    {editFormData.image ? (
                                        <img
                                            src={`http://localhost:5000${editFormData.image}`}
                                            alt={editFormData.name}
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                    ) : (
                                        <p>Chưa có hình ảnh</p>
                                    )}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thay đổi hình ảnh</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, image: e.target.files[0] })
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

export default AdminEvents;