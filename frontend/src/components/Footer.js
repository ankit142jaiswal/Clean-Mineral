import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className='text-dark mt-auto py-4' style={{ 
      position: 'relative',
      width: '100%'
    }}>
      <Container>
        <Row>
          <Col className='text-center'>
            <p className='mb-1'>Clean &copy; {new Date().getFullYear()}</p>
            <small className='text-muted'>Pure Water, Delivered to Your Doorstep</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;