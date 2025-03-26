// frontend/src/pages/admin/AdminEventTypes.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Modal, Pagination, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../../assets/styles/Admin.css';

function AdminEventTypes() {
    const [eventTypes, setEventTypes] = useState([]);
    const [formData, setFormData] = useState({
        typeCode: '',
        name: '',
        description: '',
    });
    const [editFormData, setEditFormData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added for loading state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEventTypes, setTotalEventTypes] = useState(0);
    const limit = 6;

    const fetchEventTypes = async (page = 1) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(
                `/api/event-types?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setEventTypes(response.data.eventTypes || []);
            setCurrentPage(response.data.currentPage || 1);
            setTotalPages(response.data.totalPages || 1);
            setTotalEventTypes(response.data.totalEventTypes || 0);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách loại sự kiện:', error);
            setError('Lấy danh sách loại sự kiện thất bại. Vui lòng thử lại.');
            toast.error('Lấy danh sách loại sự kiện thất bại');
            setEventTypes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventTypes(currentPage);
    }, [currentPage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('/api/event-types', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setEventTypes([...eventTypes, response.data]);
            setFormData({ typeCode: '', name: '', description: '' });
            toast.success('Thêm loại sự kiện thành công!');
            fetchEventTypes(currentPage);
        } catch (error) {
            console.error('Lỗi khi thêm loại sự kiện:', error);
            setError(error.response?.data?.message || 'Thêm loại sự kiện thất bại');
            toast.error(error.response?.data?.message || 'Thêm loại sự kiện thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (eventType) => {
        setEditFormData({
            _id: eventType._id,
            typeCode: eventType.typeCode,
            name: eventType.name,
            description: eventType.description || '',
        });
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.put(
                `/api/event-types/${editFormData._id}`,
                editFormData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setEventTypes(
                eventTypes.map((type) => (type._id === editFormData._id ? response.data : type))
            );
            setShowModal(false);
            toast.success('Cập nhật loại sự kiện thành công!');
            fetchEventTypes(currentPage);
        } catch (error) {
            console.error('Lỗi khi cập nhật loại sự kiện:', error);
            setError(error.response?.data?.message || 'Cập nhật loại sự kiện thất bại');
            toast.error(error.response?.data?.message || 'Cập nhật loại sự kiện thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa loại sự kiện này?')) {
            setLoading(true);
            try {
                await axios.delete(`/api/event-types/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setEventTypes(eventTypes.filter((type) => type._id !== id));
                toast.success('Xóa loại sự kiện thành công!');
                fetchEventTypes(currentPage);
            } catch (error) {
                console.error('Lỗi khi xóa loại sự kiện:', error);
                toast.error(error.response?.data?.message || 'Xóa loại sự kiện thất bại');
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </Spinner>
                <p>Đang tải...</p>
            </div>
        );
    }

    return (
        <Container fluid className="admin-container">
            <ToastContainer />
            <Row>
                <Col md={12}>
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
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Mã loại sự kiện</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Mã loại sự kiện"
                                                value={formData.typeCode}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, typeCode: e.target.value })
                                                }
                                                required
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Tên loại sự kiện</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tên loại sự kiện"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                required
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Mô tả</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Mô tả (tùy chọn)"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, description: e.target.value })
                                                }
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2} className="d-flex align-items-end">
                                        <Button type="submit" variant="primary" disabled={loading}>
                                            {loading ? 'Đang xử lý...' : 'Thêm loại sự kiện'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="admin-card">
                        <Card.Body>
                            {eventTypes.length === 0 ? (
                                <div className="text-center py-5">
                                    <p>Chưa có loại sự kiện nào.</p>
                                </div>
                            ) : (
                                <>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Mã loại sự kiện</th>
                                                <th>Tên loại sự kiện</th>
                                                <th>Mô tả</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {eventTypes.map((type, index) => (
                                                <tr key={type._id}>
                                                    <td>{(currentPage - 1) * limit + index + 1}</td>
                                                    <td>{type.typeCode}</td>
                                                    <td>{type.name}</td>
                                                    <td>{type.description || '-'}</td>
                                                    <td>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={<Tooltip id="edit-tooltip">Sửa</Tooltip>}
                                                        >
                                                            <Button
                                                                variant="link"
                                                                className="action-btn edit-btn"
                                                                onClick={() => handleEdit(type)}
                                                                disabled={loading}
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
                                                                onClick={() => handleDelete(type._id)}
                                                                disabled={loading}
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                    {totalEventTypes > 0 && (
                                        <Row className="mt-4">
                                            <Col className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    Tổng số loại sự kiện: {totalEventTypes}
                                                </div>
                                                <Pagination>
                                                    <Pagination.First
                                                        onClick={() => handlePageChange(1)}
                                                        disabled={currentPage === 1 || loading}
                                                    />
                                                    <Pagination.Prev
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1 || loading}
                                                    />
                                                    {[...Array(totalPages).keys()].map((page) => (
                                                        <Pagination.Item
                                                            key={page + 1}
                                                            active={page + 1 === currentPage}
                                                            onClick={() => handlePageChange(page + 1)}
                                                            disabled={loading}
                                                        >
                                                            {page + 1}
                                                        </Pagination.Item>
                                                    ))}
                                                    <Pagination.Next
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages || loading}
                                                    />
                                                    <Pagination.Last
                                                        onClick={() => handlePageChange(totalPages)}
                                                        disabled={currentPage === totalPages || loading}
                                                    />
                                                </Pagination>
                                            </Col>
                                        </Row>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

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
                                    disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default AdminEventTypes;