// frontend/src/pages/admin/AdminEventTypes.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Nav, Modal } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/Admin.css';

function AdminEventTypes() {
    const [eventTypes, setEventTypes] = useState([]);
    const [formData, setFormData] = useState({
        typeCode: '',
        name: '',
        description: '',
        image: null,
    });
    const [editFormData, setEditFormData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    // Lấy danh sách loại sự kiện
    const fetchEventTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/event-types', {
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
        fetchEventTypes();
    }, []);

    // Thêm loại sự kiện
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = new FormData();
            data.append('typeCode', formData.typeCode);
            data.append('name', formData.name);
            data.append('description', formData.description);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await axios.post('http://localhost:5000/api/event-types', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setEventTypes([...eventTypes, response.data]);
            setFormData({ typeCode: '', name: '', description: '', image: null });
            toast.success('Thêm loại sự kiện thành công!');
            fetchEventTypes();
        } catch (error) {
            console.error('Lỗi khi thêm loại sự kiện:', error);
            setError(error.response?.data?.message || 'Thêm loại sự kiện thất bại');
            toast.error(error.response?.data?.message || 'Thêm loại sự kiện thất bại');
        }
    };

    // Mở modal chỉnh sửa
    const handleEdit = (eventType) => {
        setEditFormData(eventType);
        setShowModal(true);
    };

    // Cập nhật loại sự kiện
    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = new FormData();
            data.append('typeCode', editFormData.typeCode);
            data.append('name', editFormData.name);
            data.append('description', editFormData.description);
            if (editFormData.image && typeof editFormData.image !== 'string') {
                data.append('image', editFormData.image);
            }

            const response = await axios.put(
                `http://localhost:5000/api/event-types/${editFormData._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setEventTypes(
                eventTypes.map((type) => (type._id === editFormData._id ? response.data : type))
            );
            setShowModal(false);
            toast.success('Cập nhật loại sự kiện thành công!');
            fetchEventTypes();
        } catch (error) {
            console.error('Lỗi khi cập nhật loại sự kiện:', error);
            setError(error.response?.data?.message || 'Cập nhật loại sự kiện thất bại');
            toast.error(error.response?.data?.message || 'Cập nhật loại sự kiện thất bại');
        }
    };

    // Xóa loại sự kiện
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa loại sự kiện này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/event-types/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setEventTypes(eventTypes.filter((type) => type._id !== id));
                toast.success('Xóa loại sự kiện thành công!');
                fetchEventTypes();
            } catch (error) {
                console.error('Lỗi khi xóa loại sự kiện:', error);
                toast.error(error.response?.data?.message || 'Xóa loại sự kiện thất bại');
            }
        }
    };

    return (
        <Container fluid className="admin-container">
            <ToastContainer />
            <Row>
                <Col md={9}>
                    <h1 className="mb-4">Quản lý loại sự kiện</h1>
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
                                                placeholder="Mã loại sự kiện"
                                                value={formData.typeCode}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, typeCode: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tên loại sự kiện"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
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
                                    <Col md={2}>
                                        <Button type="submit" variant="primary">
                                            Thêm loại sự kiện
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
                                        <th>Mã loại sự kiện</th>
                                        <th>Tên loại sự kiện</th>
                                        <th>Mô tả</th>
                                        <th>Hình ảnh</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventTypes.map((type) => (
                                        <tr key={type._id}>
                                            <td>{type.typeCode}</td>
                                            <td>{type.name}</td>
                                            <td>{type.description || '-'}</td>
                                            <td>
                                                {type.image ? (
                                                    <img
                                                        src={`http://localhost:5000${type.image}`}
                                                        alt={type.name}
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
                                                    onClick={() => handleEdit(type)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(type._id)}
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

            {/* Modal chỉnh sửa loại sự kiện */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa loại sự kiện</Modal.Title>
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
                                <Form.Label>Mã loại sự kiện</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editFormData.typeCode}
                                    onChange={(e) =>
                                        setEditFormData({ ...editFormData, typeCode: e.target.value })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên loại sự kiện</Form.Label>
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

export default AdminEventTypes;