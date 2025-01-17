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
  FormControl,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import UserSearchBar from './userSearchBar';
import ProductSearchBar from './productSearchBar';
import { API_BASE_URL } from '../../../utils/config';
import deepEqual from 'fast-deep-equal';

const steps = ['User Information', 'Order Information', 'Shipping Address'];
const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderDialogStepper({ open, onClose, onSave, item }) {
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("Pending");
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    console.log("item=", item);
    if (item) {
      if (item.user) {
        setUser(item.user);
        setIsDisabled(true);
      }
      setProducts(item.items);
      setShippingAddress(item.shippingAddress);
      setStatus(item.status);
      setTotalAmount(item.totalAmount);
    } else {
      console.log("add")
      setUser(null);
      setIsDisabled(false);
      setProducts([]);
      setShippingAddress({});
      setStatus("Pending");
      setTotalAmount(0);
    }
  }, [item])

  // Update totalAmount whenever items change
  useEffect(() => {
    const newTotal = products.reduce((acc, item) => acc + item.totalPrice, 0);
    setTotalAmount(parseFloat(newTotal.toFixed(2)));
  }, [products]);

  const handleUserSelect = (user, state) => {
    user ? setUser(user) : setUser(null) ;
    setIsDisabled(state);
  };

  const handleNext = () => {
    // Validation before going to the next step
    let formValid = true;
    const newErrors = {};

    if (activeStep === 0) { 
      if (!user?.fullName) newErrors.fullName = 'Full Name is required';
      if (!user?.email) newErrors.email = 'Email is required';
    }

    if (activeStep === 1 && products.length === 0)
        newErrors.products = 'Products List empty';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      formValid = false;
    }

    if (formValid) {
      setErrors({});
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  const handleRemove = (item) => {
    setProducts(products.filter((product) => product !== item));
  };

  // Handle input changes
  const handleChange = (field) => (e) => {
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      [field]: e.target.value,
    }));
    if (errors && errors[field]) {
      setErrors((prevErrors) => {
        const { [field]: _, ...remainingErrors } = prevErrors;
        return remainingErrors;
      });
    }
  };

  // Performs validation for required fields.
  const validateShippingAddress = (shippingAddress) => {
    const requiredFields = [
      { field: 'firstName', message: 'First Name is required' },
      { field: 'lastName', message: 'Last Name is required' },
      { field: 'addressLine1', message: 'Address is required' },
      { field: 'city', message: 'City is required' },
      { field: 'state', message: 'State is required' },
      { field: 'zip', message: 'Zip code is required' },
      { field: 'country', message: 'Country is required' },
    ];

    return requiredFields.reduce((errors, { field, message }) => {
      if (!shippingAddress?.[field]) errors[field] = message;
      return errors;
    }, {});
  };

  const handleSave = () => {
    const newErrors = validateShippingAddress(shippingAddress);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Compare Data when editing order
    if (
      item &&
      deepEqual(item.user, user) &&
      deepEqual(item.items, products) &&
      item.totalAmount === totalAmount &&
      deepEqual(item.shippingAddress, shippingAddress) &&
      item.status === status
    ) {
      console.log("Nothing Changed");
      onClose();
      setTimeout(() => {
        setActiveStep(0);
      }, 1000);
      return;
    }

    // Transform the data
    const transformedItems = products.map(item => ({
      product: item.product._id,
      size: item.size,
      color: item.color,
      quantity: item.quantity || 1,
      totalPrice: item.totalPrice,
    }));

    const orderData = {
      user,
      items: [...transformedItems],
      totalAmount,
      shippingAddress: { ...shippingAddress },
      status,
    };

    console.log("orderData=", orderData)
    onSave(orderData);
    onClose();
    setTimeout(() => {
      setActiveStep(0);
    }, 1000);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setActiveStep(0);
    }, 1000);
  }

  const handleReset = () => {
    setUser(null);
    setIsDisabled(false);
    setProducts([]);
    setShippingAddress({});
    setStatus("Pending");
    setTotalAmount(0);
    setActiveStep(0);
  }

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

          {/* User Information Stepper */}
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
                    disabled={isDisabled}
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
                    disabled={isDisabled}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    variant="standard"
                    value={user ? user.phone : ''}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    disabled={isDisabled}
                  />
                </Box>
              </Box>
              {user?._id && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    User selected ID: {user._id}
                  </Typography>
                  <Button variant="outlined" size="small" onClick={() => {
                    setUser(null);
                    setIsDisabled(false);
                  }}>
                    Reset User
                  </Button>
                </Box>
              )}

            </Box>
          )}

          {/* Order Information Stepper */}
          {activeStep === 1 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Order Information</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Search for products and add them to the order with quantities.
              </Typography>

              {/* Display Alert if there are errors */}
              {errors.products && (
                <Alert
                  severity="error"
                  onClose={() => setErrors({})}
                  sx={{ marginBottom: 2 }}
                >
                  {errors.products}
                </Alert>
              )}

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
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
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
                    {`Your Items(${products.length}):`}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ marginRight: 2 }}>Order Status:</Typography>
                    <FormControl variant="standard">
                      <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        label="Age"
                      >
  
                        {statusOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>

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
                              {item.product.name}
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
                            onClick={() => handleRemove(item)}
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

              <Divider variant="inset" component="p" sx={{ marginTop: 2 }} />

              {/* Total Price */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total: ${totalAmount.toFixed(2)}
                </Typography>
              </Box>

            </Box>
          )}

          {/* Shipping Information Stepper */}
          {activeStep === 2 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Shipping Address</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Enter the shipping address details for the order.
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First name"
                    variant="standard"
                    value={shippingAddress.firstName || ''}
                    onChange={handleChange('firstName')}
                    required
                    error={errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last name"
                    variant="standard"
                    value={shippingAddress.lastName || ''}
                    onChange={handleChange('lastName')}
                    required
                    error={errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Address line 1"
                variant="standard"
                value={shippingAddress.addressLine1 || ''}
                onChange={handleChange('addressLine1')}
                required
                sx={{ mb: 2 }}
                error={errors.addressLine1}
                helperText={errors.addressLine1}
              />
              <TextField
                fullWidth
                label="Address line 2"
                variant="standard"
                value={shippingAddress.addressLine2 || ''}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    variant="standard"
                    value={shippingAddress.city || ''}
                    onChange={handleChange('city')}
                    required
                    error={errors.city}
                    helperText={errors.city}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State"
                    variant="standard"
                    value={shippingAddress.state || ''}
                    onChange={handleChange('state')}
                    required
                    error={errors.state}
                    helperText={errors.state}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Zip / Postal code"
                    variant="standard"
                    value={shippingAddress.zip || ''}
                    onChange={handleChange('zip')}
                    required
                    error={errors.zip}
                    helperText={errors.zip}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    variant="standard"
                    value={shippingAddress.country || ''}
                    onChange={handleChange('country')}
                    required
                    error={errors.country}
                    helperText={errors.country}
                  />
                </Grid>
              </Grid>
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
        <Button onClick={handleReset} color="secondary">
          Reset
        </Button>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

