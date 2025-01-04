import React, { createContext, useContext, useReducer, useEffect } from "react";
import { api } from '../../../utils/api';

const initialState = {
  products: [],
  categories: [],
  subcategories: [],
};

// Reducer function to handle actions
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.payload],
        subcategories: state.subcategories.map((sub) =>
          sub.id === action.payload.subcategoryId
            ? { ...sub, productCount: sub.productCount + 1 }
            : sub
        ),
      };
    case "EDIT_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? { ...product, ...action.payload } : product
        ),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload.id),
        subcategories: state.subcategories.map((sub) =>
          sub.id === action.payload.subcategoryId
            ? { ...sub, productCount: sub.productCount - 1 }
            : sub
        ),
      };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };
    case "EDIT_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? { ...cat, ...action.payload } : cat
        ),
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload.id),
      };
    default:
      return state;
  }
};

const StateContext = createContext();

// Provider component
export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, subcategoriesRes, productsRes ] = await Promise.all([
          api.get('/categories'),
          api.get('/subcategories'),
          api.get('/products'),
        ]);

        dispatch({type:"SET_CATEGORIES", payload: categoriesRes.data });
        dispatch({type:"SET_SUBCATEGORIES", payload: subcategoriesRes.data });
        dispatch({type:"SET_PRODUCTS", payload: productsRes.data });

      } catch (err) {
        console.error(`Error fetching data ${err}`);
      }
    };

    fetchData();
  }, []);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
