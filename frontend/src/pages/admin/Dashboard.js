// frontend/src/pages/admin/AdminDashboard.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // Dữ liệu mẫu cho biểu đồ
    const chartData = {
        labels: ['Road Show', 'Biểu diễn Nghệ thuật', 'Khai trương', 'Lễ ra mắt'],
        datasets: [
            {
                label: 'Số lượng sự kiện',
                data: [12, 19, 3, 5],
                backgroundColor: 'rgba(107, 72, 255, 0.6)',
                borderColor: 'rgba(107, 72, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Container>
            <h2 className="mb-4">Dashboard</h2>
            {user && (
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <p>Xin chào, {user.email} ({user.role})</p>
                    <Button variant="danger" onClick={handleLogout}>
                        Đăng xuất
                    </Button>
                </div>
            )}
            <Row>
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số người dùng</Card.Title>
                            <Card.Text>150</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số sự kiện</Card.Title>
                            <Card.Text>39</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số bài viết</Card.Title>
                            <Card.Text>25</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số yêu cầu</Card.Title>
                            <Card.Text>10</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Card className="admin-card">
                        <Card.Body>
                            <Card.Title>Số lượng sự kiện theo loại</Card.Title>
                            <Bar data={chartData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDashboard;