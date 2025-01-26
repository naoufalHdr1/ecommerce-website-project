import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/system";
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import dayjs from "dayjs";
import { api } from '../utils/api';
import { API_BASE_URL } from '../utils/config';

dayjs().format()


// Sidebar items data
const sidebarMenu = [
  { text: "View orders", icon: <InventoryOutlinedIcon />},
  { text: "Personal details", icon: <PersonOutlineOutlinedIcon /> },
  { text: "Change password", icon: <LockOpenOutlinedIcon /> },
  { text: "Payment methods", icon: <CreditCardOutlinedIcon /> },
  { text: "Manage addresses", icon: <HomeOutlinedIcon /> },
  { text: "Log out", icon: <LogoutOutlinedIcon /> },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return { color: "green" };
    case "Processing":
      return { color: "blue" };
    case "Shipped":
      return { color: "orange" };
    case "Delivered":
      return { color: "#9e9e9e" }; // Grey
    case "Cancelled":
      return { color: "red" };
    default:
      return { color: "black" };
  }
};

const UserPage = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  const calculateDeliveryDuration = (createdAt) => {
    const deliveryDate = dayjs(createdAt).add(7, "day");
    const deliveredOn = dayjs().format("ddd, D MMM");
    return deliveryDate.isBefore(dayjs())
      ? `Delivered on ${deliveredOn}`
      : `Expected on ${deliveryDate.format("ddd, D MMM")}`;
  };

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const calculateDeliveryDate = (createdAt) => {
    return dayjs(createdAt).add(7, "day").format("ddd D, MMM");
  };

  const calculateCreationDate = (createdAt) => {
    return dayjs(createdAt).format("ddd D, MMM");
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
      <Box
        sx={{
          width: { xs: "100%", md: "25%" },
          borderRadius: 2,
          padding: 1,
        }}
      >
        <List>
          {sidebarMenu.map((item, index) => (
            <ListItem
              button
              key={index}
              selected={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
              sx={{
                backgroundColor: selectedIndex === index ? "#E8F0FE" : "transparent",
                borderRadius: "8px",
                color: selectedIndex === index ? "#1A73E8" : "inherit",
                marginBottom: 1,
                cursor: 'pointer',
                "&:hover": {
                  backgroundColor: "#D6E4FC",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: selectedIndex === index ? "#1A73E8" : "inherit",
                }}
              >
                {React.cloneElement(item.icon, {
                  sx: { marginRight: 1, color: selectedIndex === index ? "#1A73E8" : "inherit" },
                })}
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: selectedIndex === index ? "bold" : "normal",
                        color: selectedIndex === index ? "#1A73E8" : "inherit",
                      }}
                    >
                      {item.text}
                    </Typography>
                  }
                />
              </Box>
              {item.badge && selectedIndex === 0 && (
                <Typography
                  variant="body2"
                  sx={{ color: "#1A73E8", fontWeight: "bold" }}
                >
                  {item.badge}
                </Typography>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

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
        <div className="mb-5">
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Order history
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {orders?.length} orders
          </Typography>
        </div>

        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div className="container px-md-4 mb-5" style={{ backgroundColor: '#F4F6F8', boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)" }}>
              {/* First Line Title Grid */}
              <Grid container spacing={2} className="">
                <Grid item xs={12}>
                  <div className="d-flex align-items-center gap-2">
                    {/* Status Indicator Circle */}
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: getStatusStyle(order.status).color,
                        borderRadius: "50%",
                      }}
                    ></div>

                    {/* Status Text */}
                    <p
                      className="fw-normal m-0"
                      style={{
                        ...getStatusStyle(order.status),
                      }}
                    >
                      {order.status}
                    </p>

                    {/* Created Date or Delivery Date */}
                    <p
                      className="fw-light m-0"
                      style={{
                        color: "#636363",
                        marginLeft: "auto",
                        fontSize: "0.8rem",
                      }}
                    >
                      {order.status === 'Delivered'
                        ? `Delivered at: ${calculateDeliveryDate(order.createdAt)}`
                        : order.status === 'Shipped'
                        ? `Est. Delivery: ${calculateDeliveryDate(order.createdAt)}`
                        : `Created at: ${calculateCreationDate(order.createdAt)}`}
                    </p>
                  </div>
                </Grid>
              </Grid>


              {/* Two Grids (a and b) */}
              <Grid container spacing={2} className="mt-0">

                {/* Grid a (60% for large screens, 100% for small) */}
                <Grid item xs={12} md={7} sx={{ marginBottom: 3 }}>
                  <div style={{ backgroundColor: '#fff', boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)", padding: '18px', marginBottom: 11 }}>

                    <Box>
                      {order.items?.slice(0, 2).map((item, index) => (
                        <React.Fragment key={index} sx={{marginBottom: 3}}>
                          <Grid container spacing={2} key={index} alignItems="center">
                            {/* Product Image */}
                            <Grid item xs={4} sm={3}>
                              <img src={`${API_BASE_URL}${item.product?.images[0]}`} alt={item.product?.name} style={{ width: '70%', borderRadius: '8px' }} />
                            </Grid>

                            {/* Product Details */}
                            <Grid item xs={8} sm={9}>

                              <Box sx={{ display: "flex", justifyContent: 'space-between', marginBottom: 1 }}>
                                <Typography variant="body1" fontWeight="bold">
                                  <Link
                                    to={`/shop/products/${item.product._id}`}
                                    style={{
                                      textDecoration: "underline",
                                      color: "inherit",
                                    }}
                                  >
                                    {item.product.name}
                                  </Link>
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  x{item.quantity}
                                </Typography>
                              </Box>

                              <Typography variant="body2" color="textSecondary">
                                Price: ${item.product.price}
                              </Typography>

                              <Typography variant="body2" color="textSecondary">
                                Size: {item.size} |{' '}
                                Color:{' '} 
                                <span
                                  style={{
                                    display: 'inline-block',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: item.color,
                                  }}
                                ></span>
                              </Typography>

                            </Grid>
                          </Grid>
                            {index < order.items.slice(0, 2).length - 1 && (
                              <hr sx={{ padding: 0, margin: '10px 0' }} />
                            )}
                        </React.Fragment>

                      ))}

                    </Box>
                  </div>
                  {/* Show number of remaining items if more than 2 */}
                  {order.items.length > 2 && (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'right'}}>
                      +{order.items.length - 2} more items
                    </Typography>
                  )}
                </Grid>

                {/* Grid b (40% for large screens, 100% for small) */}
                <Grid item xs={12} md={5}>
                  <div style={{ backgroundColor: '#e0e0e0', padding: '20px' }}>
                    {/* Buttons inside Grid b */}
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Button variant="contained" fullWidth>
                          Button 1
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Button variant="contained" fullWidth>
                          Button 2
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button variant="contained" fullWidth>
                          Button 3
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button variant="contained" fullWidth>
                          Button 4
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}


	  {/*
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          padding: 2,
          backgroundColor: "#F4F6F8",
          borderRadius: 2,
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
          marginBottom: 2,
          marginTop: 3,
        }}
      >

        {/* Status Indicator }
        <Box
          sx={{
            width: "2px",
            backgroundColor: isDelivered ? "#e0e0e0" : "#1a73e8",
            borderRadius: "2px",
          }}
        ></Box>

        <Box sx={{ flex: 1, marginLeft: 2 }}>
          {/* Order Status }
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="small"
              sx={{ color: isDelivered ? "#9e9e9e" : "green", padding: 0, r: 4 }}
            >
              <FiberManualRecordIcon/>
            </IconButton>
            <Typography
              variant="subtitle1"
              sx={{ color: isDelivered ? "#9e9e9e" : "#1a73e8", fontWeight: 500 }}
            >
              {isDelivered
                ? calculateDeliveryDuration(order.createdAt)
                : order.status}
            </Typography>
          </Box>

          {/* Items }
          <Box>
            {order.items.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginY: 1,
                }}
              >
                <LocalShippingIcon sx={{ marginRight: 1, color: "#757575" }} />
                <Typography variant="body2">
                  Product Name (Replace with actual name)
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Action Buttons }
        {!isDelivered && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button variant="contained" color="success" size="small">
              Track order
            </Button>
            <Button variant="outlined" size="small">
              View order details
            </Button>
            <Button variant="text" size="small">
              Get invoice
            </Button>
            <Button variant="text" size="small">
              Edit order
            </Button>
          </Box>
        )}
      </Box>
	  */}
      </Box>
    </Box>

  );
};

export default UserPage;
