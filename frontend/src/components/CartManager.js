import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CART_CLEAR_ITEMS } from '../constants/cartConstants';

// This component manages user-specific cart data
const CartManager = () => {
  const dispatch = useDispatch();
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Load user-specific cart when user logs in
  useEffect(() => {
    if (userInfo) {
      const userCartItems = localStorage.getItem(`cartItems_${userInfo._id}`);
      if (userCartItems) {
        dispatch({
          type: CART_CLEAR_ITEMS,
        });
        
        const parsedItems = JSON.parse(userCartItems);
        parsedItems.forEach(item => {
          dispatch({
            type: 'CART_ADD_ITEM',
            payload: item,
          });
        });
      }
    }
  }, [userInfo, dispatch]);

  // Save cart items when they change
  useEffect(() => {
    if (userInfo && cartItems.length >= 0) {
      localStorage.setItem(`cartItems_${userInfo._id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, userInfo]);

  return null; // This is a functional component with no UI
};

export default CartManager;