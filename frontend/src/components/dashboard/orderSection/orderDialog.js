import React, { useState } from 'react';
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
  InputAdornment,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import { Search as SearchIcon, AccountCircle } from '@mui/icons-material';
import { api, uploadImages } from '../../../utils/api';
import { API_BASE_URL } from '../../../utils/config';

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
  const [searchUser, setSearchUser] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userResults, setUserResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const token = localStorage.getItem('token');

  // Search User
  const handleSearch = async () => {
    if (!searchUser) return;

    setLoading(true);
    try {
      const res = await api(`/users?fullName=${searchUser}`);
      console.log("res=", res.data)
      setUserResults(res.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

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
              {/* User Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <TextField
                  fullWidth
                  id="input-with-icon-textfield"
                  label="Search User"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  sx={{ mb: 2, mt: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </div>
              
              {/* Loading Indicator */}
              {loading && <CircularProgress />}

              {/* User Results */}
              <List
                sx={{
                  maxHeight: 180,
                  overflowY: 'auto',
                  border: userResults.length ? '1px solid #ccc' : 'none',
                  borderRadius: 2,
                  p: 0,
                  mt: 1,
                }}
              >
                {userResults.map((user) => (
                  <ListItem
                    key={user._id}
                    button
                    onClick={() => handleUserSelect(user._id)}
                    sx={{
                      backgroundColor: selectedUserId === user._id ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={`${API_BASE_URL}${user.avatar}`} alt={user.fullName} />
                    </ListItemAvatar>
                    <ListItemText primary={user.fullName} />
                    <ListItemText primary={user.email} />
                    <Checkbox
                      checked={selectedUserId === user._id}
                      onChange={() => handleUserSelect(user._id)}
                      sx={{ color: selectedUserId === user._id ? 'primary.main' : undefined }}
                    />
                  </ListItem>
                ))}
              </List>

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

