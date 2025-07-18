import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, Form, Carousel } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProductDetails } from '../actions/productActions';

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  const productImages = [
    product.image,
    '/images/sample.png',
    '/images/sample.png',
    '/images/sample.png'
  ];

  const addToCartHandler = () => {
    if (!userInfo) {
      navigate('/login');
    } else {
      navigate(`/cart/${id}?qty=${qty}`);
    }
  };

  return (
    <>
      <Link to="/" className='btn btn-light my-3'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Carousel activeIndex={selectedImage} onSelect={(selectedIndex) => setSelectedImage(selectedIndex)} className="product-carousel" controls={false} touch={true}>
              {productImages.map((img, index) => (
                <Carousel.Item key={index}>
                  <Image 
                    src={img?.startsWith('http') ? img : `https://clean-mineral.onrender.com${img}`} 
                    alt={`${product.name} ${index + 1}`} 
                    fluid 
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/images/sample.png';
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col md={3}>
            <div className='p-2 bg-white rounded-3 shadow-sm'>
              <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>Price: ₹{product.price}</ListGroup.Item>
              <ListGroup.Item>Description: {product.description}</ListGroup.Item>
              </ListGroup>
            </div>
          </Col>
          <Col md={3}>
            <Card className='p-2 rounded-3 shadow-sm'>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>₹{product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className='btn-block'
                    type='button'
                    disabled={product.countInStock === 0}
                  >
                    {userInfo ? 'Add To Cart' : 'Sign In To Buy'}
                  </Button>
                  {!userInfo && (
                    <div className="mt-2 text-center">
                      <small className="text-muted">Please sign in to add items to cart</small>
                    </div>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;