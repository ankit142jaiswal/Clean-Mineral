import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';

const DashboardScreen = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalStock: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  // Redirect if not admin
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const [ordersRes, productsRes, usersRes] = await Promise.all([
          axios.get('https://clean-mineral.onrender.com/api/orders', config),
          axios.get('https://clean-mineral.onrender.com/api/products', config),
          axios.get('https://clean-mineral.onrender.com/api/users', config)
        ]);

        const orders = ordersRes.data;
        const products = productsRes.data;
        const users = usersRes.data;

        const deliveredOrders = orders.filter(order => order.isDelivered).length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const totalStock = products.reduce((sum, product) => sum + product.countInStock, 0);

        setStats({
          totalOrders: orders.length,
          deliveredOrders,
          totalRevenue,
          totalProducts: products.length,
          totalStock,
          totalUsers: users.length
        });
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchStats();
    }
  }, [userInfo]);

  if (loading) return <Loader />;
  if (error) return <Message variant='danger'>{error}</Message>;

  return (
    <>
      <h1>Admin Dashboard</h1>
      
      {/* Statistics Cards */}
      <Row className='mb-4'>
        <Col md={4}>
          <Card className='my-3 p-3 rounded bg-dark text-dark' style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/userlist')}>
            <Card.Body className='text-center'>
              <h3>{stats.totalUsers}</h3>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>View all registered users</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='my-3 p-3 rounded bg-primary text-dark' style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/orderlist')}>
            <Card.Body className='text-center'>
              <h3>{stats.totalOrders}</h3>
              <Card.Title>Total Orders</Card.Title>
              <Card.Text>View all customer orders</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='my-3 p-3 rounded bg-success text-dark' style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/orderlist')}>
            <Card.Body className='text-center'>
              <h3>{stats.deliveredOrders}</h3>
              <Card.Title>Delivered Orders</Card.Title>
              <Card.Text>View delivered orders</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col md={4}>
          <Card className='my-3 p-3 rounded bg-info text-dark' style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/orderlist')}>
            <Card.Body className='text-center'>
              <h3>₹{stats.totalRevenue}</h3>
              <Card.Title>Total Revenue</Card.Title>
              <Card.Text>View revenue details</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='my-3 p-3 rounded bg-warning text-dark' style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/productlist')}>
            <Card.Body className='text-center'>
              <h3>{stats.totalProducts}</h3>
              <Card.Title>Total Products</Card.Title>
              <Card.Text>View all products</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='my-3 p-3 rounded bg-secondary text-dark' style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/productlist')}>
            <Card.Body className='text-center'>
              <h3>{stats.totalStock}</h3>
              <Card.Title>Total Stock</Card.Title>
              <Card.Text>View stock details</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>


    </>
  );
};

export default DashboardScreen;