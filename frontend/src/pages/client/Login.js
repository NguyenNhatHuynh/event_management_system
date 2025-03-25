import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/Client.css';

function Login() {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Xử lý đăng nhập
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!loginData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
            setError('Email không hợp lệ');
            toast.error('Email không hợp lệ');
            return;
        }
        if (!loginData.password || loginData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: loginData.email,
                password: loginData.password,
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            toast.success('Đăng nhập thành công!');

            // Chuyển hướng dựa trên vai trò
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'staff') {
                navigate('/staff/dashboard');
            } else {
                navigate('/account');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Đăng nhập thất bại');
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    // Xử lý đăng ký
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!signupData.username || signupData.username.length < 3) {
            setError('Tên người dùng phải có ít nhất 3 ký tự');
            toast.error('Tên người dùng phải có ít nhất 3 ký tự');
            return;
        }
        if (!signupData.fullName || signupData.fullName.length < 3) {
            setError('Họ và tên phải có ít nhất 3 ký tự');
            toast.error('Họ và tên phải có ít nhất 3 ký tự');
            return;
        }
        if (!signupData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
            setError('Email không hợp lệ');
            toast.error('Email không hợp lệ');
            return;
        }
        if (!signupData.password || signupData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if (signupData.password !== signupData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        if (signupData.phone && !/^(0[1-9][0-9]{8,9})$/.test(signupData.phone)) {
            setError('Số điện thoại không hợp lệ');
            toast.error('Số điện thoại không hợp lệ');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', signupData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            toast.success('Đăng ký thành công!');
            navigate('/account');
        } catch (error) {
            setError(error.response?.data?.message || 'Đăng ký thất bại');
            toast.error(error.response?.data?.message || 'Đăng ký thất bại');
        }
    };

    // Xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Đăng xuất thành công!');
        navigate('/login');
    };

    return (
        <div className="login-page">
            <ToastContainer />
            <section className="login-form-section">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Tabs defaultActiveKey="login" id="auth-tabs" className="mb-4">
                                <Tab eventKey="login" title="Đăng nhập">
                                    <Form onSubmit={handleLoginSubmit}>
                                        <Form.Group className="mb-3" controlId="loginEmail">
                                            <Form.Control
                                                type="email"
                                                placeholder="Nhập email"
                                                value={loginData.email}
                                                onChange={(e) =>
                                                    setLoginData({ ...loginData, email: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="loginPassword">
                                            <Form.Control
                                                type="password"
                                                placeholder="Nhập mật khẩu"
                                                value={loginData.password}
                                                onChange={(e) =>
                                                    setLoginData({ ...loginData, password: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>

                                        <div className="text-center">
                                            <Button type="submit" className="auth-button">
                                                Đăng nhập
                                            </Button>
                                        </div>
                                    </Form>
                                </Tab>

                                <Tab eventKey="signup" title="Đăng ký">
                                    <Form onSubmit={handleSignupSubmit}>
                                        <Form.Group className="mb-3" controlId="signupUsername">
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập tên người dùng"
                                                value={signupData.username}
                                                onChange={(e) =>
                                                    setSignupData({ ...signupData, username: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="signupFullName">
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập họ và tên"
                                                value={signupData.fullName}
                                                onChange={(e) =>
                                                    setSignupData({ ...signupData, fullName: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="signupEmail">
                                            <Form.Control
                                                type="email"
                                                placeholder="Nhập email"
                                                value={signupData.email}
                                                onChange={(e) =>
                                                    setSignupData({ ...signupData, email: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="signupPassword">
                                            <Form.Control
                                                type="password"
                                                placeholder="Nhập mật khẩu"
                                                value={signupData.password}
                                                onChange={(e) =>
                                                    setSignupData({ ...signupData, password: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="signupConfirmPassword">
                                            <Form.Control
                                                type="password"
                                                placeholder="Xác nhận mật khẩu"
                                                value={signupData.confirmPassword}
                                                onChange={(e) =>
                                                    setSignupData({
                                                        ...signupData,
                                                        confirmPassword: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="signupPhone">
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập số điện thoại (tùy chọn)"
                                                value={signupData.phone}
                                                onChange={(e) =>
                                                    setSignupData({ ...signupData, phone: e.target.value })
                                                }
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="signupAddress">
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập địa chỉ (tùy chọn)"
                                                value={signupData.address}
                                                onChange={(e) =>
                                                    setSignupData({ ...signupData, address: e.target.value })
                                                }
                                            />
                                        </Form.Group>

                                        <div className="text-center">
                                            <Button type="submit" className="auth-button">
                                                Đăng ký
                                            </Button>
                                        </div>
                                    </Form>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </section>

            <footer className="login-footer">
                <Container className="text-center">
                    <p>© 2025 XoanDev. All Rights Reserved.</p>
                    {localStorage.getItem('token') && (
                        <Button variant="link" onClick={handleLogout}>
                            Đăng xuất
                        </Button>
                    )}
                </Container>
            </footer>
        </div>
    );
}

export default Login;