import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';

function AdminContacts() {
    const [contacts, setContacts] = useState([
        { id: 1, name: 'Nguyen Van A', email: 'a@example.com', message: 'Tôi muốn tổ chức sự kiện...', date: '20/03/2025' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');

    const handleReply = () => {
        // Logic gửi email trả lời
        setShowModal(false);
        setReplyMessage('');
    };

    return (
        <Container>
            <h2 className="mb-4">Quản lý liên hệ</h2>
            <Table striped bordered hover className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Nội dung</th>
                        <th>Ngày gửi</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td>{contact.id}</td>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.message}</td>
                            <td>{contact.date}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                                    Trả lời
                                </Button>{' '}
                                <Button variant="danger" size="sm">
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