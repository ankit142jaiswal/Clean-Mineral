import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user || !user.name) {
        dispatch(getUserDetails('profile'));
      } else {
        setName(user.name);
        setEmail(user.email);
        setAddress(user.address?.street || '');
        setCity(user.address?.city || '');
        setPostalCode(user.address?.postalCode || '');
        setCountry(user.address?.country || '');
        setPhone(user.phone || '');
      }
    }
  }, [dispatch, navigate, userInfo, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateUserProfile({ 
        id: user._id, 
        name, 
        email, 
        password,
        address,
        city,
        postalCode,
        country
      }));
    }
  };

  return (
    <Row>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {success && <Message variant='success'>Profile Updated</Message>}
      {loading && <Loader />}
      
      <Form onSubmit={submitHandler}>
        <Row>
          {/* Left Half - Personal Information */}
          <Col md={6}>
            <h2>Personal Information</h2>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            
            <Form.Group controlId='phone' className='mt-2'>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter phone number'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>

          {/* Right Half - Address Information */}
          <Col md={6}>
            <h2>Address Information</h2>
            <Form.Group controlId='address'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='city' className='mt-2'>
              <Form.Label>City</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter city'
                value={city}
                onChange={(e) => setCity(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='postalCode' className='mt-2'>
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter postal code'
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='country' className='mt-2'>
              <Form.Label>Country</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
        
        <Row className="mt-3">
          <Col>
            <Button type='submit' variant='primary'>
              Update Profile
            </Button>
          </Col>
        </Row>
      </Form>
    </Row>
  );
};

export default ProfileScreen;