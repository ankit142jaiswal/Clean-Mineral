import React, { useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Form, Button, Card } from 'react-bootstrap';
import { FaTrash, FaEdit, FaShoppingCart } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';

const CartScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productId = id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty, userInfo, navigate]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/shipping');
  };

  return (
    <div className='container-fluid py-4' style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Row className='g-4'>
        <Col md={8}>
          <div className='d-flex align-items-center mb-4'>
            <FaShoppingCart className='text-primary me-3' size={32} />
            <h1 className='fw-bold text-dark mb-0'>Shopping Cart</h1>
          </div>
          
          {cartItems.length === 0 ? (
            <div className='bg-white rounded-3 shadow-sm p-5 text-center'>
              <FaShoppingCart className='text-muted mb-4' size={64} />
              <h3 className='text-muted mb-3'>Your cart is empty</h3>
              <p className='text-muted mb-4'>Add some products to get started!</p>
              <Link to='/' className='btn btn-primary px-4 py-2'>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className='bg-white rounded-3 shadow-sm p-4'>
              {cartItems.map((item, index) => (
                <div key={item.product} className={`p-3 ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`}>
                  <Row className='align-items-center'>
                    <Col md={2}>
                      <div className='position-relative'>
                        <Image 
                          src={item.image?.startsWith('http') ? item.image : `https://clean-mineral.onrender.com${item.image}`} 
                          alt={item.name} 
                          fluid 
                          rounded 
                          style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                          onError={(e) => {
                            e.target.src = '/images/sample.png';
                          }}
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <Link to={`/product/${item.product}`} className='text-decoration-none'>
                        <h6 className='fw-bold text-dark mb-1'>{item.name}</h6>
                      </Link>
                      <small className='text-muted'>Premium Water</small>
                    </Col>
                    <Col md={2}>
                      <h6 className='text-primary fw-bold mb-0'>₹{item.price}</h6>
                    </Col>
                    <Col md={2}>
                      <Form.Control
                        as='select'
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                        style={{ borderRadius: '8px' }}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <div className='d-flex gap-2'>
                        <Button
                          variant='outline-danger'
                          size='sm'
                          onClick={() => removeFromCartHandler(item.product)}
                          style={{ borderRadius: '8px' }}
                        >
                          <FaTrash />
                        </Button>
                        {userInfo && userInfo.isAdmin && (
                          <Button
                            variant='outline-info'
                            size='sm'
                            onClick={() => navigate(`/admin/product/${item.product}/edit`)}
                            style={{ borderRadius: '8px' }}
                          >
                            <FaEdit />
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          )}
        </Col>
        
        <Col md={4}>
          <div className='bg-white rounded-3 shadow-sm p-4' style={{ position: 'sticky', top: '20px' }}>
            <h4 className='fw-bold mb-4'>Order Summary</h4>
            
            <div className='d-flex justify-content-between mb-3'>
              <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
              <span className='fw-bold'>
                ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </span>
            </div>
            
            <hr />
            
            <div className='d-flex justify-content-between mb-4'>
              <h5>Total:</h5>
              <h5 className='text-primary fw-bold'>
                ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </h5>
            </div>
            
            {userInfo && userInfo.isAdmin ? (
              <div>
                <Button
                  variant='success'
                  className='w-100 py-3 fw-bold mb-3'
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                  style={{ borderRadius: '10px' }}
                >
                  Admin Checkout (No Payment)
                </Button>
                <small className='text-muted d-block text-center'>
                  Admin orders bypass payment processing
                </small>
              </div>
            ) : (
              <Button
                variant='primary'
                className='w-100 py-3 fw-bold'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
                style={{ borderRadius: '10px' }}
              >
                Proceed To Checkout
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;