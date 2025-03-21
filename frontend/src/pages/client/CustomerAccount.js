// frontend/src/pages/client/CustomerAccount.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CustomerAccount() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      localStorage.setItem('user', JSON.stringify({ ...user, ...response.data }));
      setSuccess('Cập nhật thông tin thành công!');
      toast.success('Cập nhật thông tin thành công!');
      setEditMode(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/users/${user.id}/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccess('Đổi mật khẩu thành công!');
      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  return (
    <div className="account-page" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <ToastContainer />
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="text-primary">Tài khoản của bạn</h2>
              <Button variant="danger" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          </Col>
        </Row>

        {/* Tabs */}
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <div className="text-center mb-4">
                  <img
                    src="https://via.placeholder.com/120"
                    alt="Avatar"
                    className="rounded-circle mb-3 avatar-img"
                    style={{ width: '120px', height: '120px' }}
                  />
                  <h4>{user?.fullName || 'Chưa cập nhật'}</h4>
                  <p className="text-muted">{user?.role}</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Tabs defaultActiveKey="profile" id="account-tabs" className="mb-4">
                  {/* Tab Thông tin tài khoản */}
                  <Tab eventKey="profile" title="Thông tin tài khoản">
                    {editMode ? (
                      <Form onSubmit={handleUpdateProfile}>
                        <Form.Group className="mb-3" controlId="formFullName">
                          <Form.Label>Họ và tên</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                          <Button variant="secondary" onClick={handleEditToggle}>
                            Hủy
                          </Button>
                          <Button variant="primary" type="submit">
                            Lưu thay đổi
                          </Button>
                        </div>
                      </Form>
                    ) : (
                      <div>
                        <p>
                          <strong>Email:</strong> {user?.email}
                        </p>
                        <p>
                          <strong>Họ và tên:</strong>{' '}
                          {user?.fullName || 'Chưa cập nhật'}
                        </p>
                        <p>
                          <strong>Vai trò:</strong> {user?.role}
                        </p>
                        <Button variant="outline-primary" onClick={handleEditToggle}>
                          Chỉnh sửa thông tin
                        </Button>
                      </div>
                    )}
                  </Tab>

                  {/* Tab Đổi mật khẩu */}
                  <Tab eventKey="password" title="Đổi mật khẩu">
                    <Form onSubmit={handleChangePassword}>
                      <Form.Group className="mb-3" controlId="formCurrentPassword">
                        <Form.Label>Mật khẩu hiện tại</Form.Label>
                        <Form.Control
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formNewPassword">
                        <Form.Label>Mật khẩu mới</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formConfirmNewPassword">
                        <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmNewPassword"
                          value={passwordData.confirmNewPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </Form.Group>

                      <Button variant="primary" type="submit">
                        Đổi mật khẩu
                      </Button>
                    </Form>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="login-footer bg-dark text-white py-3 mt-auto">
        <Container className="text-center">
          <p>© 2025 XoanDev. All Rights Reserved.</p>
          <p>Contact: xoandev@gmail.com | 08xxxx</p>
        </Container>
      </footer>
    </div>
  );
}

export default CustomerAccount;