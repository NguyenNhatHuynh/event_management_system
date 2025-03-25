import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function AdminProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
    });

    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    // Lấy thông tin admin hiện tại
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập để xem hồ sơ');
                toast.error('Vui lòng đăng nhập để xem hồ sơ');
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfile(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin hồ sơ:', error);
            setError(error.response?.data?.message || 'Lấy thông tin hồ sơ thất bại');
            toast.error(error.response?.data?.message || 'Lấy thông tin hồ sơ thất bại');
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, []);

    // Validation phía frontend
    const validateProfile = () => {
        if (!profile.username || profile.username.length < 3) {
            setError('Tên người dùng phải có ít nhất 3 ký tự');
            return false;
        }
        if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
            setError('Email không hợp lệ');
            return false;
        }
        if (profile.phone && !/^(0[1-9][0-9]{8,9})$/.test(profile.phone)) {
            setError('Số điện thoại không hợp lệ');
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        if (!password.oldPassword || !password.newPassword || !password.confirmPassword) {
            setError('Vui lòng điền đầy đủ các trường');
            return false;
        }
        if (password.newPassword !== password.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return false;
        }
        if (password.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return false;
        }
        return true;
    };

    // Cập nhật thông tin cá nhân
    const handleSaveProfile = async () => {
        if (!validateProfile()) {
            toast.error(error);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập để cập nhật hồ sơ');
                toast.error('Vui lòng đăng nhập để cập nhật hồ sơ');
                navigate('/login');
                return;
            }

            const response = await axios.put('http://localhost:5000/api/users/me', profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfile(response.data);
            toast.success('Hồ sơ đã được cập nhật!');
            setError('');

            // Cập nhật thông tin user trong localStorage
            localStorage.setItem('user', JSON.stringify({
                id: response.data._id,
                email: response.data.email,
                role: response.data.role,
            }));
        } catch (error) {
            console.error('Lỗi khi cập nhật hồ sơ:', error);
            setError(error.response?.data?.message || 'Cập nhật hồ sơ thất bại');
            toast.error(error.response?.data?.message || 'Cập nhật hồ sơ thất bại');
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };

    // Đổi mật khẩu
    const handleChangePassword = async () => {
        if (!validatePassword()) {
            toast.error(error);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập để đổi mật khẩu');
                toast.error('Vui lòng đăng nhập để đổi mật khẩu');
                navigate('/login');
                return;
            }

            await axios.put('http://localhost:5000/api/users/change-password', password, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPassword({ oldPassword: '', newPassword: '', confirmPassword: '' });
            toast.success('Mật khẩu đã được thay đổi!');
            setError('');
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            setError(error.response?.data?.message || 'Đổi mật khẩu thất bại');
            toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };

    return (
        <Container>
            <ToastContainer />
            <h2 className="mb-4">Hồ sơ Admin</h2>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <h4>Thông tin cá nhân</h4>
            <Form className="admin-form mb-5">
                <Form.Group className="mb-3">
                    <Form.Label>Tên người dùng</Form.Label>
                    <Form.Control
                        type="text"
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                        type="text"
                        value={profile.fullName || ''}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
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
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control
                        type="text"
                        value={profile.address || ''}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
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
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control
                        type="password"
                        value={password.newPassword}
                        onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                    <Form.Control
                        type="password"
                        value={password.confirmPassword}
                        onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                        required
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