import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { FaWater } from 'react-icons/fa';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded product-card'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' className='product-image' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div' className='my-2'>
          <div className='d-flex align-items-center'>
            <FaWater className='text-primary me-1' />
            <span>{product.type} Water</span>
          </div>
        </Card.Text>

        <Card.Text as='div' className='my-2'>
          <div className='d-flex align-items-center'>
            <span>{product.volume} Liters</span>
          </div>
        </Card.Text>

        <Card.Text as='h3'>₹{product.price}</Card.Text>

        <Link to={`/product/${product._id}`}>
          <Button variant='primary' className='w-100'>
            View Details
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Product;