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

    // Fetching Data to State
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_SUBCATEGORIES":
      return { ...state, subcategories: action.payload };

    // Adding Data to State
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.payload],
        subcategories: state.subcategories.map((sub) =>
          sub.id === action.payload.subcategory_id
            ? { 
                ...sub,
                products: [...sub.products, action.paylod._id]
            }
            : sub
        ),
      };
    case "ADD_SUBCATEGORY":
      return {
        ...state,
        subcategories: [...state.subcategories, action.payload],
        categories: state.categories.map((cat) =>
          cat.id === action.payload.category_id
          ? {
            ...cat,
            subcategories: [...cat.subcategories, action.payload._id]
          }
          : cat
        ),
      };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };

    // Updating Data to state
    case "EDIT_PRODUCT":
      return {
        ...state,
        subcategories: state.subcategories.map((subcategory) => {
          const productToUpdate = state.products.find(
            (product) => product._id === action.payload._id
          );

          // Check if the product's subcategory_id has changed
          if (productToUpdate && productToUpdate.subcategory_id !== action.payload.subcategory_id) {
            // Remove the product from the previous subcategory
            if (subcategory._id === productToUpdate.subcategory_id) {
              return {
                ...subcategory,
                products: subcategory.products.filter(
                  (productId) => productId !== action.payload._id
                ),
              };
            }

            // Add the product to the new subcategory
            if (subcategory._id === action.payload.subcategory_id) {
              return {
                ...subcategory,
                products: [...subcategory.products, action.payload._id],
              };
            }
          }

          return subcategory;
        }),
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
      };
    case "EDIT_SUBCATEGORY":
      return {
        ...state,
        categories: state.categories.map((category) => {
          const subcategoryToUpdate = state.subcategories.find(
            (subcategory) => subcategory._id === action.payload._id
          );

          // Check if the subcategory's category_id has changed
          if (subcategoryToUpdate && subcategoryToUpdate.category_id !== action.payload.category_id) {
            // Remove the subcategory from the previous category
            if (category._id === subcategoryToUpdate.category_id) {
              return {
                ...category,
                subcategories: category.subcategories.filter(
                  (subcategoryId) => subcategoryId !== action.payload._id
                ),
              };
            }

            // Add the subcategory to the new category
            if (category._id === action.payload.category_id) {
              return {
                ...category,
                subcategories: [...category.subcategories, action.payload._id],
              };
            }
          }

          // Return unchanged categories
          return category;
        }),
        subcategories: state.subcategories.map((subcategory) =>
          subcategory._id === action.payload._id ? action.payload : subcategory
        ),
      };
    case "EDIT_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };

    // Delete data from state
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((product) => product._id !== action.payload._id),
        subcategories: state.subcategories.map((sub) =>
          sub._id === action.payload.subcategory_id
          ? {
              ...sub,
              products: sub.products.filter((productId) => productId !== action.payload._id),
            }
          : sub
        ),
      };
    case "DELETE_SUBCATEGORY":
      return {
        ...state,
        subcategories: state.subcategories.filter((sub) => sub._id !== action.payload._id),
        categories: state.categories.map((cat) =>
          cat._id === action.payload.category_id
          ? {
              ...cat,
              subcategories: cat.subcategories.filter((subId) => subId !== action.payload._id),
            }
          : cat
        ),
      }
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload.id),
      };

    // Default
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
