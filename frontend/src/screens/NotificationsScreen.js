import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, NavDropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import axios from 'axios';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  // Function to reset notification count in localStorage
  const resetNotificationCount = () => {
    localStorage.setItem('unreadNotifications', '0');
  };

  useEffect(() => {
    // Check if user is admin
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    
    // Reset notification count when this screen is viewed
    resetNotificationCount();

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        // Get recent orders as notifications
        const { data } = await axios.get('https://clean-mineral.onrender.com/api/orders', config);
        
        // Sort by createdAt date (newest first);l
        const sortedNotifications = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Check for new unviewed notifications
        const unviewedNotifications = sortedNotifications.filter(
          n => !localStorage.getItem(`viewed_${n._id}`)
        );
        
        if (unviewedNotifications.length > 0) {
          setNewNotification(unviewedNotifications[0]);
          setShowPopup(true);
        }
        
        setNotifications(sortedNotifications);
        setLoading(false);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [navigate, userInfo]);

  const viewOrderHandler = (id) => {
    localStorage.setItem(`viewed_${id}`, 'true');
    setShowPopup(false);
    navigate(`/order/${id}`);
  };

  const handlePopupClose = () => {
    if (newNotification) {
      localStorage.setItem(`viewed_${newNotification._id}`, 'true');
    }
    setShowPopup(false);
  };

  const filterNotifications = (notifications) => {
    if (!notifications) return [];
    
    return notifications.filter(notification => {
      const notificationDate = new Date(notification.createdAt);
      const now = new Date();
      
      if (dateFilter === 'last30days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (notificationDate < thirtyDaysAgo) return false;
      } else if (dateFilter === 'last3months') {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        if (notificationDate < threeMonthsAgo) return false;
      } else if (dateFilter && dateFilter.startsWith('year-')) {
        const year = parseInt(dateFilter.split('-')[1]);
        if (notificationDate.getFullYear() !== year) return false;
      }
      
      return true;
    });
  };

  const filteredNotifications = filterNotifications(notifications);

  return (
    <>
      <h1>Notifications</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          {notifications.length === 0 ? (
            <Message>No new notifications found</Message>
          ) : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>
                    <NavDropdown title={dateFilter ? (dateFilter === 'last30days' ? 'Last 30 Days' : dateFilter === 'last3months' ? 'Last 3 Months' : dateFilter === 'year-2024' ? '2024' : '2023') : 'DATE'} id='date-dropdown' className='fw-bold'>
                      <NavDropdown.Item onClick={() => setDateFilter('')}>All Dates</NavDropdown.Item>
                      <NavDropdown.Item onClick={() => setDateFilter('last30days')}>Last 30 Days</NavDropdown.Item>
                      <NavDropdown.Item onClick={() => setDateFilter('last3months')}>Last 3 Months</NavDropdown.Item>
                      <NavDropdown.Item onClick={() => setDateFilter('year-2024')}>2024</NavDropdown.Item>
                      <NavDropdown.Item onClick={() => setDateFilter('year-2023')}>2023</NavDropdown.Item>
                    </NavDropdown>
                  </th>
                  <th>CUSTOMER</th>
                  <th>TOTAL</th>
                  <th>NOTIFICATION</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notification) => (
                  <tr key={notification._id}>
                    <td>{new Date(notification.createdAt).toLocaleDateString()}</td>
                    <td>{notification.user?.name || 'Unknown User'}</td>
                    <td>₹{notification.totalPrice}</td>
                    <td>
                      New order placed by {notification.user?.name || 'Unknown User'}
                    </td>
                    <td>
                      <Button
                        variant='light'
                        className='btn-sm'
                        onClick={() => viewOrderHandler(notification._id)}
                      >
                        View Order
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
      
      <Modal show={showPopup} onHide={handlePopupClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Order Alert!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {newNotification && (
            <div>
              <p><strong>New order placed!</strong></p>
              <p>Customer: {newNotification.user?.name || 'Unknown User'}</p>
              <p>Amount: ₹{newNotification.totalPrice}</p>
              <p>Time: {new Date(newNotification.createdAt).toLocaleString()}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePopupClose}>
            Dismiss
          </Button>
          <Button variant="primary" onClick={() => newNotification && viewOrderHandler(newNotification._id)}>
            View Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NotificationsScreen;