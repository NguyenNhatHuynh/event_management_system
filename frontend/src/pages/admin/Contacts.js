// frontend/src/pages/admin/Contacts.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [status, setStatus] = useState(null); // null, 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    // Lấy danh sách liên hệ từ API
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/contacts');
                setContacts(response.data);
            } catch (error) {
                setStatus('error');
                setErrorMessage('Lỗi khi lấy danh sách liên hệ: ' + error.message);
            }
        };
        fetchContacts();
    }, []);

    // Xử lý trả lời liên hệ
    const handleReply = async () => {
        if (!selectedContact) return;
        try {
            await axios.patch(`http://localhost:5000/api/contacts/${selectedContact._id}/reply`, {
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
        } catch (error) {
            setStatus('error');
            setErrorMessage('Lỗi khi gửi trả lời: ' + error.message);
        }
    };

    // Xử lý xóa liên hệ
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/contacts/${id}`);
                setContacts(contacts.filter((contact) => contact._id !== id));
                setStatus('success');
                setErrorMessage('');
            } catch (error) {
                setStatus('error');
                setErrorMessage('Lỗi khi xóa liên hệ: ' + error.message);
            }
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
                            <td>{index + 1}</td>
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
                                >
                                    Trả lời
                                </Button>{' '}
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