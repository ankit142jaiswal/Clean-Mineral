import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();

  if (!shippingAddress) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 currentStep={2} />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <div className='p-5 rounded-3 shadow-sm' style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <Form.Group>
            <Form.Label as='legend'>Select Method</Form.Label>
            <Col>
            <div className='p-3 mb-3 rounded-3 border' style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <Form.Check
                type='radio'
                label='PayPal or Credit Card'
                id='PayPal'
                name='paymentMethod'
                value='PayPal'
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </div>
            <div className='p-3 mb-3 rounded-3 border' style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <Form.Check
                type='radio'
                label='UPI Payment'
                id='UPI'
                name='paymentMethod'
                value='UPI'
                checked={paymentMethod === 'UPI'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </div>
            <div className='p-3 mb-3 rounded-3 border' style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <Form.Check
                type='radio'
                label='Cash On Delivery'
                id='COD'
                name='paymentMethod'
                value='Cash On Delivery'
                checked={paymentMethod === 'Cash On Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </div>
            </Col>
          </Form.Group>
        </div>

        <Button type='submit' variant='primary' className='mt-3'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;