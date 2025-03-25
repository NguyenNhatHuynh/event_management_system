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
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Xử lý đăng nhập
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Đăng nhập thành công!');
            // Chuyển hướng dựa trên vai trò
            if (response.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/account');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    // Xử lý đăng ký
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (signupData.password !== signupData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name: signupData.name,
                email: signupData.email,
                password: signupData.password,
                role: 'customer', // Thêm trường role để đảm bảo
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Đăng ký thành công!');
            // Chuyển hướng dựa trên vai trò
            if (response.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/account');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Đăng ký thất bại');
        }
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
                                        <Form.Group className="mb-3" controlId="signupName">
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập họ và tên"
                                                value={signupData.name}
                                                onChange={(e) =>
                                                    setSignupData({ ...signupData, name: e.target.value })
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
                </Container>
            </footer>
        </div>
    );
}

export default Login;