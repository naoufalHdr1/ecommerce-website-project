import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Grid,
  TextField,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Close, Delete, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { API_BASE_URL } from '../../utils/config';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';

const CartDrawer = ({ cartItems, open, onClose }) => {
  const [items, setItems] = useState(cartItems);

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, type) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: type === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
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
            onClick={onClose}
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
                  {item.name}
                </Typography>
                <IconButton
                  onClick={() => handleRemove(item.id)}
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
                    src={`${API_BASE_URL}${item.image}`}
                    alt={item.name}
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
                      Price: ${item.price}
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
                          onClick={() => handleQuantityChange(item.id, 'decrease')}
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
                            onClick={() => handleQuantityChange(item.id, 'increase')}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography fontWeight="bold" sx={{ marginRight: 1 }}>
                        ${item.price * item.quantity}
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
              Total: <span>${totalPrice.toFixed(2)}</span>
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

          <Button
            fullWidth
            variant="outlined"
            sx={{
              color: '#dc143c',
              borderColor: '#dc143c',
              marginTop: 1,
              '&:hover': {
                backgroundColor: '#dc143c',
                color: '#fff',
              },
            }}
            startIcon={<ShoppingCartCheckoutOutlinedIcon color='#dc143c'/>}
          >
            View Cart
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
