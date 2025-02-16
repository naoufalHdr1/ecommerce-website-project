import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { api } from '../utils/api.js';

// Initial state
const initialState = {
  items: [],
  totalAmount: 0,
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
        totalAmount: action.payload.totalAmount,
      };

    default:
      return state;
  }
}

const CartContext = createContext();

// Context Provider Component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart data on load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/cart');
        if (res.data) 
          dispatch({ type: 'SET_CART', payload: { items: res.data.items, totalAmount: res.data.totalAmount } });
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

// Custom Hook for using Auth Context
export const useCart = () => useContext(CartContext);
