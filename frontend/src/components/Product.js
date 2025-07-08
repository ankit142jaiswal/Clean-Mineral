import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { FaWater, FaEye } from 'react-icons/fa';

const Product = ({ product }) => {
  return (
    <Card className='h-100 shadow-sm border-0' style={{ 
      transition: 'all 0.3s ease', 
      borderRadius: '15px',
      overflow: 'hidden'
    }}>
      <div className='position-relative' style={{ height: '250px', overflow: 'hidden' }}>
        <Link to={`/product/${product._id}`}>
          <Card.Img 
            src={product.image}
            onError={(e) => {
              e.target.src = '/images/sample.png';
            }}
            alt={product.name}
          />
        </Link>
        <div className='position-absolute top-0 end-0 m-2'>
          <span className='badge bg-info'>{product.volume} Units</span>
        </div>
      </div>

      <Card.Body className='d-flex flex-column p-4'>
        <Link to={`/product/${product._id}`} className='text-decoration-none'>
          <Card.Title className='h5 mb-3 text-dark fw-bold'>
            {product.name}
          </Card.Title>
        </Link>

        <div className='d-flex align-items-center mb-3'>
          <FaWater className='text-primary me-2' size={16} />
          <span className='text-muted small'>{product.type} Water</span>
        </div>

        <div className='mt-auto'>
          <h4 className='text-primary mb-3 fw-bold'>₹{product.price}</h4>
          <Link to={`/product/${product._id}`} className='text-decoration-none'>
            <Button 
              variant='primary' 
              className='w-100 py-2 fw-semibold'
              style={{ 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                border: 'none' 
              }}
            >
              <FaEye className='me-2' />
              View Details
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;