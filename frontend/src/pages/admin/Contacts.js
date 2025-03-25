// frontend/src/pages/admin/Contacts.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Alert, Pagination } from 'react-bootstrap';
import axios from 'axios';

function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalContacts, setTotalContacts] = useState(0);
    const limit = 5; // Số liên hệ trên mỗi trang
    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [status, setStatus] = useState(null); // null, 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    // Lấy danh sách liên hệ từ API với phân trang
    const fetchContacts = async (page = 1) => {
        try {
            const response = await axios.get(`/api/contacts?page=${page}&limit=${limit}`);
            setContacts(response.data.contacts || []);
            setCurrentPage(response.data.currentPage || 1);
            setTotalPages(response.data.totalPages || 1);
            setTotalContacts(response.data.totalContacts || 0);
        } catch (error) {
            setStatus('error');
            setErrorMessage('Lỗi khi lấy danh sách liên hệ: ' + error.message);
            setContacts([]);
            setTotalPages(1);
            setTotalContacts(0);
        }
    };

    useEffect(() => {
        fetchContacts(currentPage);
    }, [currentPage]);

    // Xử lý trả lời liên hệ
    const handleReply = async () => {
        if (!selectedContact) return;
        try {
            await axios.patch(`/api/contacts/${selectedContact._id}/reply`, {
                replyMessage,
            });
            setContacts(
                contacts.map((contact) =>
                    contact._id === selectedContact._id
                        ? { ...contact, status: 'Replied' }
                        : contact
                )
            );
            setShowModal(false);
            setReplyMessage('');
            setStatus('success');
            setErrorMessage('');
            fetchContacts(currentPage); // Làm mới danh sách sau khi trả lời
        } catch (error) {
            setStatus('error');
            setErrorMessage('Lỗi khi gửi trả lời: ' + error.message);
        }
    };

    // Xử lý xóa liên hệ
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) {
            try {
                await axios.delete(`/api/contacts/${id}`);
                setContacts(contacts.filter((contact) => contact._id !== id));
                setStatus('success');
                setErrorMessage('');
                fetchContacts(currentPage); // Làm mới danh sách sau khi xóa
            } catch (error) {
                setStatus('error');
                setErrorMessage('Lỗi khi xóa liên hệ: ' + error.message);
            }
        }
    };

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
        }
    };

    return (
        <Container>
            <h2 className="mb-4">Quản lý liên hệ</h2>
            {status === 'success' && (
                <Alert variant="success" onClose={() => setStatus(null)} dismissible>
                    Thao tác thành công!
                </Alert>
            )}
            {status === 'error' && (
                <Alert variant="danger" onClose={() => setStatus(null)} dismissible>
                    {errorMessage}
                </Alert>
            )}
            <Table striped bordered hover className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Nội dung</th>
                        <th>Ngày gửi</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact, index) => (
                        <tr key={contact._id}>
                            <td>{(currentPage - 1) * limit + index + 1}</td>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.message}</td>
                            <td>{new Date(contact.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td>{contact.status}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedContact(contact);
                                        setShowModal(true);
                                    }}
                                    disabled={contact.status === 'Replied' || contact.status === 'Closed'}
                                    className="me-2"
                                >
                                    Trả lời
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(contact._id)}
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {totalContacts > 0 && (
                <Row className="mt-4">
                    <Col className="d-flex justify-content-between align-items-center">
                        <div>
                            Tổng số liên hệ: {totalContacts}
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

            {/* Modal Trả lời */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Trả lời liên hệ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="admin-form">
                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung trả lời</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleReply}>
                        Gửi
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminContacts;