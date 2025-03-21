import React, { useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

function AdminBookings() {
    const [bookings, setBookings] = useState([
        { id: 1, customer: 'Nguyen Van A', eventType: 'Road Show', date: '21/03/2025', status: 'Đang chờ' },
    ]);

    return (
        <Container>
            <h2 className="mb-4">Quản lý đặt lịch</h2>
            <Table striped bordered hover className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Loại sự kiện</th>
                        <th>Ngày tổ chức</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.customer}</td>
                            <td>{booking.eventType}</td>
                            <td>{booking.date}</td>
                            <td>{booking.status}</td>
                            <td>
                                {booking.status === 'Đang chờ' && (
                                    <>
                                        <Button variant="success" size="sm">
                                            Phê duyệt
                                        </Button>{' '}
                                        <Button variant="danger" size="sm">
                                            Từ chối
                                        </Button>
                                    </>
                                )}
                                {booking.status !== 'Đang chờ' && (
                                    <Button variant="secondary" size="sm">
                                        Hủy
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default AdminBookings;