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
  IconButton,
  Stack,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { api } from '../../../utils/api';
import UserSearchBar from './userSearchBar';
import ProductSearchBar from './productSearchBar';
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

  // Update totalAmount whenever items change
  useEffect(() => {
    const newTotal = products.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0);
    console.log("new total=", newTotal);
    setTotalAmount(newTotal);
  }, [products]);

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

  const handleAddProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  const handleRemove = (id) => {
    setProducts(products.filter((item) => item._id !== id));
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

              <ProductSearchBar onAddProduct={handleAddProduct} />
              <Divider sx={{ my: 2 }}></Divider>

              {/* Producs List */}
              <Box
                sx={{
                  maxWidth: 600,
                  margin: "auto",
                  padding: 2,
                  maxHeight: 500,
                  overflowY: "auto",
                  borderRadius: 3,
                  backgroundColor: "#f5f5f5",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "left",
                    marginTop: 3,
                    marginBottom: 3,
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Your Items:
                </Typography>

                <Stack spacing={3}>
                  {products.map((item) => (
                    <Card
                      key={item._id}
                      sx={{
                        padding: 2,
                        paddingBottom: 0,
                        borderRadius: 3,
                        backgroundColor: "#ffffff",
                        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <Grid container alignItems="center" spacing={2}>
                        {/* Item Details */}
                        <Grid item xs={9}>
                          <CardContent
                            sx={{
                              padding: 0,
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "#333" }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "gray", fontSize: "0.9rem" }}
                            >
                              Size: {item.size} | Color:{" "}
                              <Box
                                component="span"
                                sx={{
                                  display: "inline-block",
                                  width: 12,
                                  height: 12,
                                  backgroundColor: item.color,
                                  borderRadius: "50%",
                                  marginLeft: 1,
                                  border: "1px solid #ddd",
                                }}
                              />
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.9rem", color: "#555" }}
                            >
                              Quantity: {item.quantity}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ color: "#007aff", fontWeight: "bold" }}
                            >
                              Total: ${item.totalPrice}
                            </Typography>
                          </CardContent>
                        </Grid>

                        {/* Close Button */}
                        <Grid item xs={3} sx={{ textAlign: "right" }}>
                          <IconButton
                            onClick={() => handleRemove(item._id)}
                            sx={{
                              color: "#ff4d4d",
                              backgroundColor: "#fff",
                              border: "1px solid #ddd",
                              "&:hover": {
                                backgroundColor: "#ffe6e6",
                              },
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              </Box>

      {/* Total Price */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Total: ${totalAmount.toFixed(2)}
        </Typography>
      </Box>

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

