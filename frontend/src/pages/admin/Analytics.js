import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function AdminAnalytics() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        totalBlogs: 0,
        totalBookings: 0,
        usersByRole: [],
        eventStats: [],
        bookingStats: { labels: [], data: [] },
    });

    // Lấy dữ liệu thống kê từ API
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Vui lòng đăng nhập để xem thống kê');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/dashboard/stats', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setStats(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu thống kê:', error);
            toast.error(error.response?.data?.message || 'Lấy dữ liệu thống kê thất bại');
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Biểu đồ số lượng yêu cầu đặt lịch theo tháng
    const bookingChartData = {
        labels: stats.bookingStats.labels,
        datasets: [
            {
                label: 'Số lượng yêu cầu đặt lịch',
                data: stats.bookingStats.data,
                backgroundColor: 'rgba(107, 72, 255, 0.6)',
                borderColor: 'rgba(107, 72, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Biểu đồ số lượng người dùng theo vai trò
    const userRoleChartData = {
        labels: stats.usersByRole.map((role) => role.role),
        datasets: [
            {
                label: 'Số lượng người dùng',
                data: stats.usersByRole.map((role) => role.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Biểu đồ số lượng sự kiện theo loại sự kiện
    const eventChartData = {
        labels: stats.eventStats.map((event) => event.name),
        datasets: [
            {
                label: 'Số lượng sự kiện',
                data: stats.eventStats.map((event) => event.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <Container>
            <ToastContainer />
            <h2 className="mb-4">Thống kê</h2>
            <Row>
                {/* Tổng quan số liệu */}
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số người dùng</Card.Title>
                            <Card.Text className="text-center" style={{ fontSize: '2rem' }}>
                                {stats.totalUsers}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số sự kiện</Card.Title>
                            <Card.Text className="text-center" style={{ fontSize: '2rem' }}>
                                {stats.totalEvents}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số blog</Card.Title>
                            <Card.Text className="text-center" style={{ fontSize: '2rem' }}>
                                {stats.totalBlogs}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số đặt lịch</Card.Title>
                            <Card.Text className="text-center" style={{ fontSize: '2rem' }}>
                                {stats.totalBookings}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                {/* Biểu đồ số lượng yêu cầu đặt lịch theo tháng */}
                <Col md={6}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Số lượng yêu cầu đặt lịch theo tháng</Card.Title>
                            <Bar data={bookingChartData} />
                        </Card.Body>
                    </Card>
                </Col>
                {/* Biểu đồ số lượng người dùng theo vai trò */}
                <Col md={6}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Số lượng người dùng theo vai trò</Card.Title>
                            <Pie data={userRoleChartData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                {/* Biểu đồ số lượng sự kiện theo loại sự kiện */}
                <Col md={6}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Số lượng sự kiện theo loại sự kiện</Card.Title>
                            <Bar data={eventChartData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminAnalytics;