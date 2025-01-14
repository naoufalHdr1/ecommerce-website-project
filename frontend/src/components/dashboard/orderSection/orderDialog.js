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
  Avatar,
} from '@mui/material';
import { api } from '../../../utils/api';
import UserSearchBar from './userSearchBar';
import { API_BASE_URL } from '../../../utils/config';

const steps = ['User Information', 'Product Information', 'Shipping Address'];

export default function OrderDialogStepper({ open, onClose, onSave, item }) {
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState(null);
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
  const [errors, setErrors] = useState({ fullName: '', email: '' });

  const token = localStorage.getItem('token');

  const handleUserSelect = (user) => {
    console.log('Selected User:', user);
    user ? setUser(user) : setUser(null) ;
  };

   const handleNext = () => {
    // Validation before going to the next step
    const newErrors = { fullName: '', email: '' };
    let formValid = true;

    if (!user?.fullName) {
      newErrors.fullName = 'Full Name is required';
      formValid = false;
    }
    if (!user?.email) {
      newErrors.email = 'Email is required';
      formValid = false;
    }

    setErrors(newErrors);

    if (formValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
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

              <Divider sx={{ my: 2 }}>OR</Divider>
              
              <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                {user?._id && (
                  <Box
                    sx={{
                      width: '40%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      pr: 2,
                    }}
                  >
                    <Avatar
                      src={`${API_BASE_URL}${user.avatar}`}
                      alt={user.fullName}
                      sx={{
                        width: '160px',
                        height: '160px',
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ width: user && user._id ? '60%' : '100%' }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="standard"
                    value={user ? user.fullName : ''}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                    sx={{ mb: 2 }}
                    required
                    error={errors.fullName}
                    helperText={errors.fullName}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    variant="standard"
                    value={user ? user.email : ''}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    sx={{ mb: 2 }}
                    required
                    error={errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    variant="standard"
                    value={user ? user.phone : ''}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  />
                </Box>
              </Box>
              {user?._id && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  User selected ID: {user._id}
                </Typography>
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

