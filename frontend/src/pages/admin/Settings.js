import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminSettings() {
    const [settings, setSettings] = useState({
        siteName: '',
        contactEmail: '',
        contactPhone: '',
        logo: '',
    });
    const [logoFile, setLogoFile] = useState(null);
    const [error, setError] = useState('');

    // Lấy dữ liệu cài đặt từ API
    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Vui lòng đăng nhập để xem cài đặt');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/settings', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSettings(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy cài đặt:', error);
            toast.error(error.response?.data?.message || 'Lấy cài đặt thất bại');
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // Xử lý upload logo
    const handleLogoChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    // Xử lý lưu cài đặt
    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Vui lòng đăng nhập để lưu cài đặt');
                return;
            }

            const formData = new FormData();
            formData.append('siteName', settings.siteName);
            formData.append('contactEmail', settings.contactEmail);
            formData.append('contactPhone', settings.contactPhone);
            if (logoFile) {
                formData.append('logo', logoFile);
            }

            const response = await axios.put('http://localhost:5000/api/settings', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSettings(response.data);
            setLogoFile(null); // Reset file sau khi upload
            toast.success('Cài đặt đã được lưu!');
        } catch (error) {
            console.error('Lỗi khi lưu cài đặt:', error);
            setError(error.response?.data?.message || 'Lưu cài đặt thất bại');
            toast.error(error.response?.data?.message || 'Lưu cài đặt thất bại');
        }
    };

    return (
        <Container>
            <ToastContainer />
            <h2 className="mb-4">Cài đặt</h2>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <Form className="admin-form">
                <Form.Group className="mb-3">
                    <Form.Label>Tên website</Form.Label>
                    <Form.Control
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email liên hệ</Form.Label>
                    <Form.Control
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                        type="text"
                        value={settings.contactPhone}
                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Logo</Form.Label>
                    {settings.logo && (
                        <Row className="mb-2">
                            <Col md={3}>
                                <Image src={settings.logo} alt="Logo" fluid thumbnail />
                            </Col>
                        </Row>
                    )}
                    <Form.Control
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleLogoChange}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleSave}>
                    Lưu cài đặt
                </Button>
            </Form>
        </Container>
    );
}

export default AdminSettings;