import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminAnalytics() {
    const chartData = {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
        datasets: [
            {
                label: 'Số lượng yêu cầu đặt lịch',
                data: [5, 10, 15, 20],
                backgroundColor: 'rgba(107, 72, 255, 0.6)',
                borderColor: 'rgba(107, 72, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <Container>
            <h2 className="mb-4">Thống kê</h2>
            <Row>
                <Col md={6}>
                    <Card className="admin-card">
                        <Card.Body>
                            <Card.Title>Số lượng yêu cầu đặt lịch theo tháng</Card.Title>
                            <Bar data={chartData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminAnalytics;