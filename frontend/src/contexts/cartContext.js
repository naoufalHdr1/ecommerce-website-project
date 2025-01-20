import React, { createContext, useReducer, useEffect } from 'react';
import { api } from '../utils/api.js';

// Initial state
const initialState = {
  items: [],
  totalPrice: 0,
};

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, ...action.payload };
    case 'ADD_ITEM':
      return {
        ...state,
        items: action.payload.items,
        totalPrice: action.payload.totalPrice,
      };
    default:
      return state;
  }
}

export const CartContext = createContext();

// Context Provider Component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart data on load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api('/cart');
        dispatch({ type: 'SET_CART', payload: res.data });
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchCart();
  }, []);

  // Context value
  const value = { state, dispatch };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
