import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        totalBlogs: 0,
        totalBookings: 0,
    });
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Số lượng sự kiện',
                data: [],
                backgroundColor: 'rgba(107, 72, 255, 0.6)',
                borderColor: 'rgba(107, 72, 255, 1)',
                borderWidth: 1,
            },
        ],
    });

    // Lấy dữ liệu từ API tổng hợp
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                // Gọi API tổng hợp
                const response = await axios.get('http://localhost:5000/api/dashboard/stats', config);
                const { totalUsers, totalEvents, totalBlogs, totalBookings, eventStats } = response.data;

                // Cập nhật số liệu
                setStats({
                    totalUsers,
                    totalEvents,
                    totalBlogs,
                    totalBookings,
                });

                // Cập nhật dữ liệu biểu đồ
                setChartData({
                    labels: eventStats.map((stat) => stat.name),
                    datasets: [
                        {
                            label: 'Số lượng sự kiện',
                            data: eventStats.map((stat) => stat.count),
                            backgroundColor: 'rgba(107, 72, 255, 0.6)',
                            borderColor: 'rgba(107, 72, 255, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                if (error.response && error.response.status === 429) {
                    toast.error('Quá nhiều yêu cầu, vui lòng thử lại sau!');
                } else if (error.response && error.response.status === 401) {
                    toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                } else {
                    toast.error('Lỗi khi lấy dữ liệu dashboard: ' + error.message);
                }
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        toast.success('Đăng xuất thành công!');
    };

    const refreshData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get('http://localhost:5000/api/dashboard/stats', config);
            const { totalUsers, totalEvents, totalBlogs, totalBookings, eventStats } = response.data;

            setStats({
                totalUsers,
                totalEvents,
                totalBlogs,
                totalBookings,
            });

            setChartData({
                labels: eventStats.map((stat) => stat.name),
                datasets: [
                    {
                        label: 'Số lượng sự kiện',
                        data: eventStats.map((stat) => stat.count),
                        backgroundColor: 'rgba(107, 72, 255, 0.6)',
                        borderColor: 'rgba(107, 72, 255, 1)',
                        borderWidth: 1,
                    },
                ],
            });

            toast.info('Dữ liệu đã được làm mới!');
        } catch (error) {
            console.error('Lỗi khi làm mới dữ liệu:', error);
            if (error.response && error.response.status === 429) {
                toast.error('Quá nhiều yêu cầu, vui lòng thử lại sau!');
            } else if (error.response && error.response.status === 401) {
                toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                toast.error('Lỗi khi làm mới dữ liệu: ' + error.message);
            }
        }
    };

    return (
        <Container>
            <h2 className="mb-4">Dashboard</h2>
            {user && (
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <p>Xin chào, {user.email} ({user.role})</p>
                    <div>
                        <Button variant="info" className="me-2" onClick={refreshData}>
                            Làm mới
                        </Button>
                        <Button variant="danger" onClick={handleLogout}>
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            )}
            <Row>
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số người dùng</Card.Title>
                            <Card.Text>{stats.totalUsers}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số sự kiện</Card.Title>
                            <Card.Text>{stats.totalEvents}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số bài viết</Card.Title>
                            <Card.Text>{stats.totalBlogs}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Card.Title>Tổng số yêu cầu</Card.Title>
                            <Card.Text>{stats.totalBookings}</Card.Text>
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
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </Container>
    );
}

export default AdminDashboard;