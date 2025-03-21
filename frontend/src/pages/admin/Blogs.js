import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';

function AdminBlogs() {
    const [blogs, setBlogs] = useState([
        { id: 1, title: 'Top Event Trends 2025', date: '20/03/2025', category: 'Sự kiện' },
        { id: 2, title: 'How to Plan a Wedding', date: '15/03/2025', category: 'Hướng dẫn' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: '', date: '', category: '' });

    const handleAddBlog = () => {
        setBlogs([...blogs, { id: blogs.length + 1, ...newBlog }]);
        setShowModal(false);
        setNewBlog({ title: '', date: '', category: '' });
    };

    return (
        <Container>
            <h2 className="mb-4">Quản lý bài viết</h2>
            <Button variant="primary" className="mb-4" onClick={() => setShowModal(true)}>
                Thêm bài viết
            </Button>
            <Table striped bordered hover className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tiêu đề</th>
                        <th>Ngày đăng</th>
                        <th>Danh mục</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog.id}>
                            <td>{blog.id}</td>
                            <td>{blog.title}</td>
                            <td>{blog.date}</td>
                            <td>{blog.category}</td>
                            <td>
                                <Button variant="warning" size="sm">
                                    Sửa
                                </Button>{' '}
                                <Button variant="danger" size="sm">
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal Thêm bài viết */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="admin-form">
                        <Form.Group className="mb-3">
                            <Form.Label>Tiêu đề</Form.Label>
                            <Form.Control
                                type="text"
                                value={newBlog.title}
                                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày đăng</Form.Label>
                            <Form.Control
                                type="date"
                                value={newBlog.date}
                                onChange={(e) => setNewBlog({ ...newBlog, date: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Danh mục</Form.Label>
                            <Form.Control
                                type="text"
                                value={newBlog.category}
                                onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddBlog}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminBlogs;