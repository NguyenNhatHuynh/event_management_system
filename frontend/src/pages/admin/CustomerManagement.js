import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Nav } from 'react-bootstrap';
import { getCustomers, createCustomer } from '../../services/api';
import '../../assets/styles/Admin.css';

function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        customerCode: '',
        fullName: '',
        phone: '',
        email: '',
        address: '',
    });

    useEffect(() => {
        getCustomers()
            .then((response) => setCustomers(response.data))
            .catch((error) => console.log(error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        createCustomer(formData)
            .then((response) => {
                setCustomers([...customers, response.data]);
                setFormData({ customerCode: '', fullName: '', phone: '', email: '', address: '' });
            })
            .catch((error) => console.log(error));
    };

    return (
        <Container fluid className="admin-container">
            <Row>
                <Col md={3} className="admin-sidebar">
                    <Nav className="flex-column">
                        <Nav.Link as="a" href="/admin">Dashboard</Nav.Link>
                        <Nav.Link as="a" href="/admin/customers">Customer Management</Nav.Link>
                    </Nav>
                </Col>
                <Col md={9}>
                    <h1 className="mb-4">Customer Management</h1>
                    <Card className="admin-card mb-4">
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Code"
                                                value={formData.customerCode}
                                                onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Full Name"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Button type="submit" variant="primary">Add Customer</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="admin-card">
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer) => (
                                        <tr key={customer._id}>
                                            <td>{customer.customerCode}</td>
                                            <td>{customer.fullName}</td>
                                            <td>{customer.phone}</td>
                                            <td>{customer.email || '-'}</td>
                                            <td>{customer.address || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CustomerManagement;