import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <p>Clean &copy; {new Date().getFullYear()}</p>
            <p>
              <small>Pure Water, Delivered to Your Doorstep</small>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;