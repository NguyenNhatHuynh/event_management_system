import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';

function AdminUsers() {
    const [users, setUsers] = useState([
        { id: 1, name: 'Nguyen Van A', email: 'a@example.com', role: 'Khách hàng', status: 'Hoạt động' },
        { id: 2, name: 'Tran Thi B', email: 'b@example.com', role: 'Nhân viên', status: 'Khóa' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: '' });

    const handleAddUser = () => {
        setUsers([...users, { id: users.length + 1, ...newUser }]);
        setShowModal(false);
        setNewUser({ name: '', email: '', role: '', status: '' });
    };

    return (
        <Container>
            <h2 className="mb-4">Quản lý người dùng</h2>
            <Button variant="primary" className="mb-4" onClick={() => setShowModal(true)}>
                Thêm người dùng
            </Button>
            <Table striped bordered hover className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>
                                <Button variant="warning" size="sm">
                                    Sửa
                                </Button>{' '}
                                <Button variant="danger" size="sm">
                                    Xóa
                                </Button>{' '}
                                <Button variant="secondary" size="sm">
                                    {user.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal Thêm người dùng */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="admin-form">
                        <Form.Group className="mb-3">
                            <Form.Label>Tên</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vai trò</Form.Label>
                            <Form.Select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                required
                            >
                                <option value="">Chọn vai trò</option>
                                <option value="Admin">Admin</option>
                                <option value="Nhân viên">Nhân viên</option>
                                <option value="Khách hàng">Khách hàng</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select
                                value={newUser.status}
                                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                                required
                            >
                                <option value="">Chọn trạng thái</option>
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Khóa">Khóa</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddUser}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminUsers;