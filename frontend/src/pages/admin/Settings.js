import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function AdminSettings() {
    const [settings, setSettings] = useState({
        siteName: 'Event Management System',
        email: 'contact@example.com',
        phone: '0123 456 789',
    });

    const handleSave = () => {
        // Logic lưu cài đặt
        alert('Cài đặt đã được lưu!');
    };

    return (
        <Container>
            <h2 className="mb-4">Cài đặt</h2>
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
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
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