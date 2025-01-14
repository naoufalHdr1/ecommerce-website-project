import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';
import { api } from '../../../utils/api';
import UserSearchBar from './userSearchBar';

const steps = ['User Information', 'Product Information', 'Shipping Address'];

export default function OrderDialogStepper({ open, onClose, onSave, item }) {
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState({ fullName: '', email: '', phone: '' });
  const [products, setProducts] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [searchProduct, setSearchProduct] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const token = localStorage.getItem('token');

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    console.log('Selected User ID:', userId);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const addProduct = (product) => {
    setProducts((prev) => {
      const updatedProducts = [...prev, product];
      const newTotal = updatedProducts.reduce(
        (sum, p) => sum + p.quantity * p.price,
        0
      );
      setTotalAmount(newTotal);
      return updatedProducts;
    });
  };

  const handleSave = () => {
    const orderData = { user, products, shippingAddress, totalAmount };
    onSave(orderData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">User Information</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Enter the user details manually or search for an existing user.
              </Typography>

              <UserSearchBar onSelectUser={handleUserSelect} />

              {selectedUserId ? (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  User selected ID: {selectedUserId}
                </Typography>
              ) : (
                <>
                <Divider sx={{ my: 2 }}>OR</Divider>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="standard"
                  value={user.fullName}
                  onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="standard"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="standard"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
                </>
              )}
            </Box>
          )}
          {activeStep === 1 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Product Information</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Search for products and add them to the order with quantities.
              </Typography>
              <TextField
                fullWidth
                label="Search Product"
                variant="standard"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                onClick={() =>
                  addProduct({ name: 'Sample Product', quantity: 1, price: 100 })
                }
              >
                Add Product
              </Button>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Total Amount: ${totalAmount}
              </Typography>
            </Box>
          )}
          {activeStep === 2 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Shipping Address</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Enter the shipping address details for the order.
              </Typography>
              <TextField
                fullWidth
                label="Street"
                variant="standard"
                value={shippingAddress.street}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, street: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="City"
                variant="standard"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="State"
                variant="standard"
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, state: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Zip Code"
                variant="standard"
                value={shippingAddress.zip}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, zip: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Country"
                variant="standard"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, country: e.target.value })
                }
              />
            </Box>
          )}
          {activeStep === steps.length && (
            <Typography sx={{ mt: 3 }}>
              All steps completed - review and save your order.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        {activeStep < steps.length - 1 && (
          <Button onClick={handleNext}>Next</Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        )}
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

