import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listMyOrders } from '../actions/orderActions';

const MyOrdersScreen = () => {
  const dispatch = useDispatch();
  const [dateFilter, setDateFilter] = useState('');
  const [paidFilter, setPaidFilter] = useState('');
  const [deliveredFilter, setDeliveredFilter] = useState('');

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading, error, orders } = orderListMy;

  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch]);

  const filterOrders = (orders) => {
    if (!orders) return [];
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      
      // Date filter
      if (dateFilter === 'last30days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (orderDate < thirtyDaysAgo) return false;
      } else if (dateFilter === 'last3months') {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        if (orderDate < threeMonthsAgo) return false;
      } else if (dateFilter && dateFilter.startsWith('year-')) {
        const year = parseInt(dateFilter.split('-')[1]);
        if (orderDate.getFullYear() !== year) return false;
      }
      
      // Paid filter
      if (paidFilter === 'paid' && !order.isPaid) return false;
      if (paidFilter === 'notpaid' && order.isPaid) return false;
      
      // Delivered filter
      if (deliveredFilter === 'delivered' && !order.isDelivered) return false;
      if (deliveredFilter === 'notdelivered' && order.isDelivered) return false;
      if (deliveredFilter === 'cancelled' && !order.isCancelled) return false;
      if (deliveredFilter === 'pending' && (order.isDelivered || order.isCancelled)) return false;
      
      return true;
    });
  };

  const filteredOrders = filterOrders(orders);

  return (
    <>
      <h2>My Orders</h2>
      

      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>
                <NavDropdown title={dateFilter ? (dateFilter === 'last30days' ? 'Last 30 Days' : dateFilter === 'last3months' ? 'Last 3 Months' : dateFilter === 'year-2024' ? '2024' : '2023') : 'DATE'} id='date-dropdown' className='fw-bold'>
                  <NavDropdown.Item onClick={() => setDateFilter('')}>All Dates</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setDateFilter('last30days')}>Last 30 Days</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setDateFilter('last3months')}>Last 3 Months</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setDateFilter('year-2024')}>2024</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setDateFilter('year-2023')}>2023</NavDropdown.Item>
                </NavDropdown>
              </th>
              <th>TOTAL</th>
              <th>
                <NavDropdown title={paidFilter ? (paidFilter === 'paid' ? 'Paid' : 'Not Paid') : 'PAID'} id='paid-dropdown' className='fw-bold'>
                  <NavDropdown.Item onClick={() => setPaidFilter('')}>All Payment Status</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setPaidFilter('paid')}>Paid</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setPaidFilter('notpaid')}>Not Paid</NavDropdown.Item>
                </NavDropdown>
              </th>
              <th>
                <NavDropdown title={deliveredFilter ? (deliveredFilter === 'delivered' ? 'Delivered' : deliveredFilter === 'notdelivered' ? 'Not Delivered' : deliveredFilter === 'cancelled' ? 'Cancel Order' : 'Pending Order') : 'DELIVERED'} id='delivered-dropdown' className='fw-bold'>
                  <NavDropdown.Item onClick={() => setDeliveredFilter('')}>All Delivery Status</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setDeliveredFilter('delivered')}>Delivered</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setDeliveredFilter('notdelivered')}>Not Delivered</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setDeliveredFilter('cancelled')}>Cancel Order</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setDeliveredFilter('pending')}>Pending Order</NavDropdown.Item>
                </NavDropdown>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders && filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>₹{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className='btn-sm' variant='light'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default MyOrdersScreen;