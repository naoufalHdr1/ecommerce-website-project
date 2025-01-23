import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  TextField,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Close, Delete } from '@mui/icons-material';
import { API_BASE_URL } from '../../utils/config';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import { useCart } from '../../contexts/cartContext';
import { api } from '../../utils/api';

const CartDrawer = ({ open, onClose }) => {
  const { state, dispatch } = useCart();
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setItems(state.items);
    setTotalAmount(state.totalAmount);
  }, [state]);

  useEffect(() => {
    setTotalAmount(totalPrice);
    setHasChanges(JSON.stringify(items) !== JSON.stringify(state.items))
  }, [items])

  const handleRemove = (id) => {
    setItems(items.filter((item) => item._id !== id));
    setHasChanges(true);
  };

  const handleQuantityChange = (id, type) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: type === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
              totalPrice: (
                parseFloat(
                  type === 'increase'
                  ? (item.totalPrice + item.product.price).toFixed(2)
                  : (item.totalPrice - item.product.price).toFixed(2)
                )
              ),
            }
          : item
      )
    );
    if (items === state.items) setHasChanges(false);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      const res = await api.put('/cart', { items, totalAmount });
      if (res.data)
        dispatch({ type: 'ADD_CART', payload: { items: res.data.items, totalAmount: res.data.totalAmount } });
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving cart changes:', err);
    }
  }

  const handleUndoChanges = () => {
    setItems(state.items);
    setTotalAmount(state.totalAmount);
    setHasChanges(false);
  }

  const totalPrice = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleClose = () => {
    console.log('cart drawer closer')
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 400,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#f9f9f9',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#333',
              fontWeight: '600',
            }}
          >
            <i
              key="bag"
              className="bi bi-bag me-2"
              style={{
                fontSize: '1.5rem',
                marginRight: '8px',
              }}
            />
            Your Cart ({items.length})
          </Typography>
          <IconButton
            onClick={handleClose}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
          {items.map((item) => (
            <Box sx={{
                padding: 1,
                boxShadow: '1px 2px 4px rgba(0, 0, 0, 0.2)',
                marginBottom: 2,
                borderRadius: 2,
              }}
            >
              {/* Name and Remove */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #e0e0e0',
                  marginBottom: 1,
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {item.product.name}
                </Typography>
                <IconButton
                  onClick={() => handleRemove(item._id)}
                  sx={{ color: '#dc143c' }}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>

              <Box
                key={item._id}
                sx={{
                  display: 'flex',
                }}
              >
                {/* Image */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={`${API_BASE_URL}${item.product.images && item.product.images[0]}`}
                    alt={item.product.name}
                    style={{
                      width: 80,
                      height: 90,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                </Box>

                {/* Item Details */}
                <Box sx={{ flex: 1 }}>
                  {/* Price */}
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#dc143c", marginBottom: 1 }}>
                      Price: ${item.product.price}
                    </Typography>
                  </Box>

                  {/* Size and Color */}
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                    Size: <Box component="span" sx={{ border: '1px solid #e0e0e0', padding: '2px 8px', borderRadius: 4 }}>{item.size}</Box> | 
                    Color: <Box component="span" sx={{ display: 'inline-block', width: 15, height: 15, border: "1px solid #ddd", borderRadius: '50%', backgroundColor: item.color }}></Box>
                  </Typography>

                  {/* Quantity and Total Price */}
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item._id, 'decrease')}
                          disabled={(item.quantity || 1) === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          value={item.quantity || 1}
                          variant="standard"
                          size="small"
                          sx={{ width: 30, textAlign: "center" }}
                          inputProps={{ style: { textAlign: "center" } }}
                        />
                        <IconButton size="small"
                            onClick={() => handleQuantityChange(item._id, 'increase')}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography fontWeight="bold" sx={{ marginRight: 1 }}>
                        ${item.totalPrice.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            borderTop: '1px solid #e0e0e0',
            padding: 2,
            bgcolor: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Total: <span>${totalAmount.toFixed(2)}</span>
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius: 0,
              backgroundColor: '#000',
              color: '#fff',
              marginTop: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#333',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
            }}
            startIcon={<PaymentOutlinedIcon />}
          >
            Proceed to Checkout
          </Button>
  
          {/* Save and Undo Buttons (Conditionally Rendered) */}
          {hasChanges && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 1,
                marginTop: 2,
              }}
            >
              {/* Save Button */}
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{
                  backgroundColor: '#28a745',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#218838',
                  },
                }}
                onClick={handleSaveChanges}
                fullWidth
              >
                Save Changes
              </Button>

              {/* Undo Button */}
              <Button
                variant="outlined"
                startIcon={<UndoIcon />}
                sx={{
                  color: '#dc143c',
                  borderColor: '#dc143c',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#dc143c',
                    color: '#fff',
                  },
                }}
                onClick={handleUndoChanges}
                fullWidth
              >
                Undo Changes
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
