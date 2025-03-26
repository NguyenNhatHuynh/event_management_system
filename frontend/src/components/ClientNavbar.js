// frontend/src/components/ClientNavbar.js
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/Client.css';

function ClientNavbar() {
    const [eventTypes, setEventTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lấy danh sách loại sự kiện từ API
    useEffect(() => {
        const fetchEventTypes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:5000/api/event-types/public');
                console.log('API Response for event types:', response.data);
                const fetchedEventTypes = response.data.eventTypes || [];
                if (Array.isArray(fetchedEventTypes)) {
                    setEventTypes(fetchedEventTypes);
                } else {
                    console.error('Dữ liệu eventTypes không phải là mảng:', fetchedEventTypes);
                    setEventTypes([]);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách loại sự kiện:', error);
                setError('Không thể tải danh sách loại sự kiện. Vui lòng thử lại sau.');
                setEventTypes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEventTypes();
    }, []);

    return (
        <div>
            {/* Top Bar */}
            <div className="top-bar">
                <Container className="d-flex justify-content-between align-items-center">
                    <div>
                        <span>CÔNG TY TỔ CHỨC SỰ KIỆN EVENTPRO</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <a href="/blog">Blog</a>
                        <a href="/portfolio">Dự án</a>
                        <a href="/careers">Tuyển dụng</a>
                        <a href="tel:0986989626" className="ms-3">
                            HOTLINE: 0986.989.626
                        </a>
                        <div className="social-icons">
                            <a href="https://facebook.com">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://youtube.com">
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Main Navbar */}
            <Navbar expand="lg" className="client-navbar" sticky="top">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">
                        EventPro
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="client-nav" />
                    <Navbar.Collapse id="client-nav">
                        <Nav className="ms-auto">
                            <Nav.Link
                                as={NavLink}
                                to="/"
                                end
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                Trang chủ
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to="/about"
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                Giới thiệu
                            </Nav.Link>
                            <NavDropdown title="Tổ chức sự kiện" id="services-dropdown">
                                <NavDropdown.Item as={NavLink} to="/event-types">
                                    Xem tất cả loại sự kiện
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                {loading ? (
                                    <NavDropdown.Item disabled>
                                        Đang tải loại sự kiện...
                                    </NavDropdown.Item>
                                ) : error ? (
                                    <NavDropdown.Item disabled>
                                        {error}
                                    </NavDropdown.Item>
                                ) : eventTypes.length > 0 ? (
                                    eventTypes.map((type) => (
                                        <NavDropdown.Item
                                            key={type._id}
                                            as={NavLink}
                                            to={`/event-types/${type.typeCode}`}
                                        >
                                            {type.name}
                                        </NavDropdown.Item>
                                    ))
                                ) : (
                                    <NavDropdown.Item disabled>
                                        Chưa có loại sự kiện
                                    </NavDropdown.Item>
                                )}
                            </NavDropdown>
                            <Nav.Link
                                as={NavLink}
                                to="/portfolio"
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                Dự án
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to="/blog"
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                Tin tức
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to="/booking"
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                Đặt lịch
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to="/contact"
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                Liên hệ
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to="/login"
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                Đăng nhập
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default ClientNavbar;