import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Card, Grid, Typography, IconButton} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Sidebar from '../../components/userPage/sidebar.js';
import { api } from '../../utils/api';
import { API_BASE_URL } from '../../utils/config';

const PersonalDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/find-user");
        setUser(res.data || []);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>

  // Handle input changes
  const handleChange = (field) => (e) => {
    setUser((prev) => ({
      ...prev,
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
  const validateUser = (user) => {
    const requiredFields = [
      { field: 'fullName', message: 'Full Name is required' },
      { field: 'email', message: 'Email is required' },
    ];

    return requiredFields.reduce((errors, { field, message }) => {
      if (!user?.[field]) errors[field] = message;
      return errors;
    }, {});
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        p: 2,
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: {
            xs: 0,
            md: 3,
          }
        }}
      >
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
          {/* Profile Box */}
          <Card
            style={{
              margin: "0 auto",
              padding: "32px",
              borderRadius: "16px",
              textAlign: "center",
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* User Image */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={`${API_BASE_URL}${user.avatar}`}
                alt={user.fullName}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <IconButton
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid crimson",
                  color: "crimson",
                  padding: "4px",
                }}
              >
                <AddAPhotoIcon />
              </IconButton>
            </div>

            {/* User Info */}
            <Typography variant="h6" style={{ fontWeight: "bold", marginTop: "16px", color: "#333" }}>
              {user.fullName}
            </Typography>
            <Typography variant="body2" style={{ color: "#555" }}>
              {user.email}
            </Typography>

            {/* User Stats */}
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "24px" }}>
              <div>
                <Typography variant="h5" style={{ fontWeight: "bold", color: "crimson" }}>
                  {user.orders?.length}
                </Typography>
                <Typography variant="body2" style={{ color: "#555" }}>
                  Orders
                </Typography>
              </div>
              <div>
                <Typography variant="h5" style={{ fontWeight: "bold", color: "crimson" }}>
                  {user.reviews?.length}
                </Typography>
                <Typography variant="body2" style={{ color: "#555" }}>
                  Reviews
                </Typography>
              </div>
              <div>
                <Typography variant="h5" style={{ fontWeight: "bold", color: "crimson" }}>
                  5
                </Typography>
                <Typography variant="body2" style={{ color: "#555" }}>
                  Wishlist
                </Typography>
              </div>
            </div>
          </Card>

          {/* Personal Details Form */}
          <Card
            style={{
              margin: "24px auto",
              padding: "32px",
              borderRadius: "16px",
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >

            <Typography variant="h5" style={{ fontWeight: "bold", marginBottom: "30px", paddingBottom: "12px", color: "#333", borderBottom: "1px solid #c3c3c3" }}>
              Personal Details
            </Typography>

            {/* User data */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={user.fullName}
                  variant="standard"
                  onChange={handleChange('fullName')}
                  required
                  error={errors.fullName}
                  helperText={errors.fullName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user.email}
                  variant="standard"
                  onChange={handleChange('email')}
                  required
                  error={errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={user.phone}
                  variant="standard"
                  onChange={handleChange('phone')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={user.address}
                  variant="standard"
                  onChange={handleChange('address')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={user.city}
                  variant="standard"
                  onChange={handleChange('city')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={user.state}
                  variant="standard"
                  onChange={handleChange('state')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PostCode"
                  value={user.zip}
                  variant="standard"
                  onChange={handleChange('zip')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={user.country}
                  variant="standard"
                  onChange={handleChange('country')}
                />
              </Grid>
            </Grid>

            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "crimson",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Update
              </Button>
            </div>
          </Card>
        </div>
	    </Box>
	  </Box>
  );
};

export default PersonalDetails;
