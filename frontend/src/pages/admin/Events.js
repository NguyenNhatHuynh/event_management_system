import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';

function AdminEvents() {
  const [events, setEvents] = useState([
    { id: 1, name: 'Road Show 2025', type: 'Road Show', date: '21/03/2025', status: 'Đã phê duyệt' },
    { id: 2, name: 'Khai trương cửa hàng', type: 'Khai trương', date: '25/03/2025', status: 'Đang chờ' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', type: '', date: '', status: '' });

  const handleAddEvent = () => {
    setEvents([...events, { id: events.length + 1, ...newEvent }]);
    setShowModal(false);
    setNewEvent({ name: '', type: '', date: '', status: '' });
  };

  return (
    <Container>
      <h2 className="mb-4">Quản lý sự kiện</h2>
      <Button variant="primary" className="mb-4" onClick={() => setShowModal(true)}>
        Thêm sự kiện
      </Button>
      <Table striped bordered hover className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Loại sự kiện</th>
            <th>Ngày tổ chức</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.name}</td>
              <td>{event.type}</td>
              <td>{event.date}</td>
              <td>{event.status}</td>
              <td>
                <Button variant="warning" size="sm">
                  Sửa
                </Button>{' '}
                <Button variant="danger" size="sm">
                  Xóa
                </Button>{' '}
                {event.status === 'Đang chờ' && (
                  <Button variant="success" size="sm">
                    Phê duyệt
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Thêm sự kiện */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sự kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="admin-form">
            <Form.Group className="mb-3">
              <Form.Label>Tên sự kiện</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại sự kiện</Form.Label>
              <Form.Select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                required
              >
                <option value="">Chọn loại sự kiện</option>
                <option value="Road Show">Road Show</option>
                <option value="Biểu diễn Nghệ thuật">Biểu diễn Nghệ thuật</option>
                <option value="Khai trương">Khai trương</option>
                <option value="Lễ ra mắt">Lễ ra mắt</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày tổ chức</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={newEvent.status}
                onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                required
              >
                <option value="">Chọn trạng thái</option>
                <option value="Đang chờ">Đang chờ</option>
                <option value="Đã phê duyệt">Đã phê duyệt</option>
                <option value="Đã hủy">Đã hủy</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddEvent}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminEvents;