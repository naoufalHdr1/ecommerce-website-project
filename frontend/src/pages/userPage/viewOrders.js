import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import { api } from '../../utils/api';
import { API_BASE_URL } from '../../utils/config';
import OrderDetailsDialog from '../../components/userPage/orderDetailsDialog';
import Sidebar from '../../components/userPage/sidebar.js';

dayjs().format()

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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const calculateDeliveryDate = (createdAt) => {
    return dayjs(createdAt).add(7, "day").format("ddd D, MMM");
  };

  const calculateCreationDate = (createdAt) => {
    return dayjs(createdAt).format("ddd D, MMM");
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseDialog = () => {
    setModalOpen(false);
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
                <Grid item xs={12} md={7} sx={{ marginBottom: { xs: 0, md: 3 } }}>
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
                  <div style={{ padding: '20px' }}>
                    {/* Buttons inside Grid b */}
                    <Grid container spacing={2}>
                      {!["Shipped", "Delivered", "Cancelled"].includes(order.status) && (
                        <Grid item xs={12}>
                          <Button variant="contained" color="success" fullWidth>
                            Track order
                          </Button>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          onClick={() => handleViewDetails(order)}
                        >
                          View order details
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button color="secondary" fullWidth>
                          Get invoice
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          color="secondary"
                          fullWidth
                          disabled={["Shipped", "Delivered", "Cancelled"].includes(order.status)}
                        >
                          Edit order
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>

              </Grid>
            </div>
          ))
        ) : (
          <p className="text-secondary fst-italic d-flex justify-content-center">
            <div className="border rounded-5 p-2">
              <i class="bi bi-info-circle me-1"></i> No Orders found
            </div>
          </p>
        )}
      </Box>

      {/* Order Details Dialog */}
      {modalOpen && (
        <OrderDetailsDialog
          open={modalOpen}
          onClose={handleCloseDialog}
          order={selectedOrder}
        />
      )}

    </Box>

  );
};

export default UserPage;

