import React, { useEffect, useState } from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProducts } from '../actions/productActions';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Row className='mb-4 align-items-center'>
        <Col md={6}>
          <h1>Latest Products</h1>
        </Col>
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type='text'
              placeholder='Search products...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='form-control'
            />
          </InputGroup>
        </Col>
      </Row>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row className='g-4'>
          {filteredProducts && filteredProducts.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='mb-4'>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;