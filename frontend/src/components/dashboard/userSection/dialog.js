import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Switch,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 16,
    padding: theme.spacing(2),
    width: "100%",
    maxWidth: 600,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  marginBottom: theme.spacing(2),
  cursor: "pointer",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const CreateUserDialog = ({ open, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "",
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedAvatar, setUploadedAvatar] = useState(null);

  // Initialize form data with the user data
  useEffect(() => {
    if (user) {
      setFormData({ ...user, password: "" });
    } else {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        role: "",
        avatar: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log(formData)
      onSave(formData);
      onClose();
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <DialogTitle>Create User</DialogTitle>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <DialogContent>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Tooltip title="Upload Avatar">
            <label htmlFor="avatar-upload">
              <StyledAvatar
                src={formData.avatar || "https://via.placeholder.com/100"}
                alt="User Avatar"
              />
            </label>
          </Tooltip>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarUpload}
          />
        </Box>
        <form autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                variant="standard"
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="standard"
                type="tel"
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="standard"
                type="email"
                error={!!errors.email}
                helperText={errors.email}
                required
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                variant="standard"
                type={showPassword ? "text" : "password"}
                error={!!errors.password}
                helperText={errors.password}
                required
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                variant="standard"
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography>Admin</Typography>
                <Switch
                  name="isAdmin"
                  checked={formData.role === "admin"}
                  onChange={(e) => {
                    const isAdmin = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      role: isAdmin ? "admin" : "customer",
                    }));
                  }}
                  color="primary"
                />
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          startIcon={<UploadFileIcon />}
        >
          Save
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default CreateUserDialog;
