import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Modal, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/Admin.css';

function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        eventType: '',
        date: '',
        location: '',
        description: '',
        status: 'Đang chờ',
        image: null,
    });
    const [editFormData, setEditFormData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/events', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log('Events data:', response.data);
            setEvents(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sự kiện:', error);
            toast.error('Lấy danh sách sự kiện thất bại');
        }
    };

    const fetchEventTypes = async () => {
        try {
            const response = await axios.get('/api/event-types', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setEventTypes(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách loại sự kiện:', error);
            toast.error('Lấy danh sách loại sự kiện thất bại');
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchEventTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('eventType', formData.eventType);
            data.append('date', formData.date);
            data.append('location', formData.location);
            data.append('description', formData.description);
            data.append('status', formData.status);
            if (formData.image) {
                console.log('Uploading image:', formData.image);
                data.append('image', formData.image);
            } else {
                console.log('No image selected');
            }

            const response = await axios.post('/api/events', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setEvents([...events, response.data]);
            setFormData({ name: '', eventType: '', date: '', location: '', description: '', status: 'Đang chờ', image: null });
            fileInputRef.current.value = '';
            toast.success('Thêm sự kiện thành công!');
            fetchEvents();
        } catch (error) {
            console.error('Lỗi khi thêm sự kiện:', error);
            setError(error.response?.data?.message || 'Thêm sự kiện thất bại');
            toast.error(error.response?.data?.message || 'Thêm sự kiện thất bại');
        }
    };

    const handleEdit = (event) => {
        setEditFormData({
            _id: event._id,
            name: event.name,
            eventType: event.eventType?._id || '',
            date: new Date(event.date).toISOString().split('T')[0],
            location: event.location,
            description: event.description || '',
            status: event.status,
            image: event.image,
        });
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = new FormData();
            data.append('name', editFormData.name);
            data.append('eventType', editFormData.eventType);
            data.append('date', editFormData.date);
            data.append('location', editFormData.location);
            data.append('description', editFormData.description);
            data.append('status', editFormData.status);
            if (editFormData.image && typeof editFormData.image !== 'string') {
                data.append('image', editFormData.image);
            }

            const response = await axios.put(
                `/api/events/${editFormData._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setEvents(events.map((event) => (event._id === editFormData._id ? response.data : event)));
            setShowModal(false);
            toast.success('Cập nhật sự kiện thành công!');
            fetchEvents();
        } catch (error) {
            console.error('Lỗi khi cập nhật sự kiện:', error);
            setError(error.response?.data?.message || 'Cập nhật sự kiện thất bại');
            toast.error(error.response?.data?.message || 'Cập nhật sự kiện thất bại');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
            try {
                await axios.delete(`/api/events/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setEvents(events.filter((event) => event._id !== id));
                toast.success('Xóa sự kiện thành công!');
                fetchEvents();
            } catch (error) {
                console.error('Lỗi khi xóa sự kiện:', error);
                toast.error(error.response?.data?.message || 'Xóa sự kiện thất bại');
            }
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await axios.patch(
                `/api/events/${id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setEvents(events.map((event) => (event._id === id ? response.data : event)));
            toast.success('Cập nhật trạng thái thành công!');
            fetchEvents();
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            toast.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
        }
    };

    return (
        <Container fluid className="admin-container">
            <ToastContainer />
            <Row>
                <Col md={12}>
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
                                            <Form.Label>Tên sự kiện</Form.Label>
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
                                            <Form.Label>Thể loại sự kiện</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={formData.eventType}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, eventType: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="">Chọn thể loại</option>
                                                {eventTypes.map((type) => (
                                                    <option key={type._id} value={type._id}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Ngày diễn ra</Form.Label>
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
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Địa điểm</Form.Label>
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
                                        <Form.Group>
                                            <Form.Label>Mô tả</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Mô tả (tùy chọn)"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, description: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Trạng thái</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={formData.status}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, status: e.target.value })
                                                }
                                            >
                                                <option value="Đang chờ">Đang chờ</option>
                                                <option value="Đã phê duyệt">Đã phê duyệt</option>
                                                <option value="Hủy">Hủy</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Hình ảnh sự kiện</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, image: e.target.files[0] })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2} className="d-flex align-items-end">
                                        <Button type="submit" variant="primary">
                                            Thêm sự kiện
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
                                        <th>Tên sự kiện</th>
                                        <th>Thể loại</th>
                                        <th>Ngày diễn ra</th>
                                        <th>Địa điểm</th>
                                        <th>Mô tả</th>
                                        <th>Trạng thái</th>
                                        <th>Hình ảnh</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event._id}>
                                            <td>{event.name}</td>
                                            <td>{event.eventType?.name || 'Không xác định'}</td>
                                            <td>{new Date(event.date).toLocaleDateString('vi-VN')}</td>
                                            <td>{event.location}</td>
                                            <td>{event.description || '-'}</td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant={
                                                            event.status === 'Đã phê duyệt'
                                                                ? 'success'
                                                                : event.status === 'Hủy'
                                                                    ? 'danger'
                                                                    : 'warning'
                                                        }
                                                        size="sm"
                                                    >
                                                        {event.status}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleUpdateStatus(event._id, 'Đang chờ')
                                                            }
                                                        >
                                                            Đang chờ
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleUpdateStatus(event._id, 'Đã phê duyệt')
                                                            }
                                                        >
                                                            Đã phê duyệt
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleUpdateStatus(event._id, 'Hủy')
                                                            }
                                                        >
                                                            Hủy
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                            <td>
                                                {event.image ? (
                                                    <img
                                                        src={event.image}
                                                        alt={event.name}
                                                        style={{ width: '100px', height: 'auto' }}
                                                        onError={(e) => {
                                                            console.error('Error loading image:', event.image);
                                                            e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                                                        }}
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
                                <Form.Label>Thể loại sự kiện</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={editFormData.eventType}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, eventType: e.target.value })
                                    }
                                    required
                                >
                                    <option value="">Chọn thể loại</option>
                                    {eventTypes.map((type) => (
                                        <option key={type._id} value={type._id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </Form.Control>
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
                                    type="text"
                                    value={editFormData.description || ''}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, description: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={editFormData.status}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, status: e.target.value })
                                    }
                                >
                                    <option value="Đang chờ">Đang chờ</option>
                                    <option value="Đã phê duyệt">Đã phê duyệt</option>
                                    <option value="Hủy">Hủy</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Hình ảnh hiện tại</Form.Label>
                                <div>
                                    {editFormData.image ? (
                                        <img
                                            src={editFormData.image}
                                            alt={editFormData.name}
                                            style={{ width: '100px', height: 'auto' }}
                                            onError={(e) => {
                                                console.error('Error loading image:', editFormData.image);
                                                e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                                            }}
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

