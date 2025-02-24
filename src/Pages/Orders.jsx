import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../assets/styles/Orders.css";

const Orders = () => {
  const user = useSelector((state) => state.auth.user);
//   const orders = useSelector((state) => state.orders.orderList);

  return (
    <Container className="profile-container">
      <Row>
        {/* Customer Info */}
        {/* <Col lg={4} md={6} sm={12} className="mb-4">
          <Card className="profile-card">
            <Card.Body>
              <h3 className="profile-title">My Profile</h3>
              <p><strong>Name:</strong> Santa</p>
              <p><strong>Phone:</strong> 7897897</p>
              <p><strong>Email:</strong> santa@gmail.com</p>
              <p><strong>Address:</strong> Raipur, India</p>
            </Card.Body>
          </Card>
        </Col> */}
        <Col lg={8} md={6} sm={12}>
  <Card className="orders-card">
    <Card.Body>
      <h3 className="profile-title">My Orders</h3>
      {[
        { id: "ORD123", items: [{ name: "Scooter Battery" }, { name: "Helmet" }], total: 150 },
        { id: "ORD124", items: [{ name: "Charging Cable" }], total: 25 },
      ].length > 0 ? (
        <ul className="order-list">
          {[
            { id: "ORD123", items: [{ name: "Scooter Battery" }, { name: "Helmet" }], total: 150 },
            { id: "ORD124", items: [{ name: "Charging Cable" }], total: 25 },
          ].map((order) => (
            <li key={order.id}>
              <strong>Order ID:</strong> {order.id} | 
              <strong> Items:</strong> {order.items.length} | 
              <strong> Total:</strong> ${order.total}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </Card.Body>
  </Card>
</Col>

      </Row>
    </Container>
  );
};

export default Orders;
