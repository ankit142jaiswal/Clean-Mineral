import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { logout } from '../actions/userActions';
import { FaWater, FaShoppingCart, FaUser, FaTint } from 'react-icons/fa';
import axios from 'axios';

const Header = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(
    parseInt(localStorage.getItem('unreadNotifications') || '0')
  );

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Check for new notifications periodically (for admin users)
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      const fetchNotifications = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };

          const { data } = await axios.get('https://clean-mineral.onrender.com/api/orders', config);
          
          // Sort by createdAt date (newest first)
          const sortedNotifications = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          
          // Check if there are new notifications
          if (notifications.length > 0 && 
              sortedNotifications.length > 0 && 
              notifications[0]._id !== sortedNotifications[0]._id) {
            const newCount = parseInt(localStorage.getItem('unreadNotifications') || '0') + 1;
            localStorage.setItem('unreadNotifications', newCount.toString());
            setUnreadCount(newCount);
          }
          
          setNotifications(sortedNotifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      
      return () => clearInterval(interval);
    }
  }, [userInfo, notifications]);



  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar expand='lg' collapseOnSelect className='py-2'>
        <Container fluid className='px-4' style={{ maxWidth: '1200px' }}>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <FaTint className='mr-2' style={{ color: '#ffffff' }} /> <strong>Clean</strong>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {userInfo && (
                <LinkContainer to='/cart'>
                  <Nav.Link>
                    <FaShoppingCart /> Cart
                    {cartItems.length > 0 && (
                      <Badge pill bg="danger" className="ms-1">
                        {cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}
                      </Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && !userInfo.isAdmin ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/myorders'>
                    <NavDropdown.Item>My Orders</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : !userInfo ? (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              ) : null}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown 
                  title={
                    <>
                      Admin
                      {unreadCount > 0 && (
                        <Badge pill bg="danger" className="ms-1">
                          {unreadCount}
                        </Badge>
                      )}
                    </>
                  } 
                  id='adminmenu'
                  className='fw-bold'
                >
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/myorders'>
                    <NavDropdown.Item>My Orders</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <LinkContainer to='/admin/dashboard'>
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/notifications'>
                    <NavDropdown.Item>
                      Notifications
                      {unreadCount > 0 && (
                        <Badge pill bg="danger" className="ms-1">
                          {unreadCount}
                        </Badge>
                      )}
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;