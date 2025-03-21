import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function AdminProfile() {
    const [profile, setProfile] = useState({
        name: 'Admin',
        email: 'admin@example.com',
        phone: '0123 456 789',
    });

    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleSaveProfile = () => {
        // Logic lưu thông tin hồ sơ
        alert('Hồ sơ đã được cập nhật!');
    };

    const handleChangePassword = () => {
        // Logic đổi mật khẩu
        if (password.newPassword === password.confirmPassword) {
            alert('Mật khẩu đã được thay đổi!');
        } else {
            alert('Mật khẩu xác nhận không khớp!');
        }
    };

    return (
        <Container>
            <h2 className="mb-4">Hồ sơ Admin</h2>
            <h4>Thông tin cá nhân</h4>
            <Form className="admin-form mb-5">
                <Form.Group className="mb-3">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleSaveProfile}>
                    Lưu thông tin
                </Button>
            </Form>

            <h4>Đổi mật khẩu</h4>
            <Form className="admin-form">
                <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu cũ</Form.Label>
                    <Form.Control
                        type="password"
                        value={password.oldPassword}
                        onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control
                        type="password"
                        value={password.newPassword}
                        onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                    <Form.Control
                        type="password"
                        value={password.confirmPassword}
                        onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleChangePassword}>
                    Đổi mật khẩu
                </Button>
            </Form>
        </Container>
    );
}

export default AdminProfile;