// frontend/src/components/admin/AdminLayout.js
import React from 'react';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaFolderOpen, FaBlog, FaEnvelope, FaBook, FaChartBar, FaCog, FaUser } from 'react-icons/fa';
import '../../assets/styles/Admin.css';

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            {/* Header */}
            <Navbar bg="dark" variant="dark" expand="lg" className="admin-header">
                <Container>
                    <Navbar.Brand as={Link} to="/admin">
                        Admin Panel
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Link onClick={handleLogout}>Đăng xuất</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            {/* Main Content */}
            <Row className="admin-main">
                {/* Sidebar */}
                <Col md={2} className="admin-sidebar">
                    <Nav className="flex-column">
                        <Nav.Link as={Link} to="/admin/dashboard">
                            <FaTachometerAlt className="me-2" /> Dashboard
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/users">
                            <FaUsers className="me-2" /> Quản lý người dùng
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/events">
                            <FaCalendarAlt className="me-2" /> Quản lý sự kiện
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/event-types">
                            <FaFolderOpen className="me-2" /> Quản lý loại sự kiện
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/blogs">
                            <FaBlog className="me-2" /> Quản lý bài viết
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/contacts">
                            <FaEnvelope className="me-2" /> Quản lý liên hệ
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/bookings">
                            <FaBook className="me-2" /> Quản lý đặt lịch
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/analytics">
                            <FaChartBar className="me-2" /> Thống kê
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/settings">
                            <FaCog className="me-2" /> Cài đặt
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin/profile">
                            <FaUser className="me-2" /> Hồ sơ
                        </Nav.Link>
                    </Nav>
                </Col>

                {/* Content Area */}
                <Col md={10} className="admin-content">
                    <Outlet />
                </Col>
            </Row>

            {/* Footer */}
            <footer className="admin-footer">
                <Container>
                    <p className="text-center">© 2025 XoanDev. All Rights Reserved.</p>
                </Container>
            </footer>
        </div>
    );
}

export default AdminLayout;