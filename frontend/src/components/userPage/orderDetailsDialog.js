import { API_BASE_URL } from '../../utils/config';
import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Card, CardContent, IconButton, Box, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Close, Delete } from '@mui/icons-material';

const OrderDetailsDialog = ({ open, onClose, order }) => {
  if (!order) return null;

  const { shippingAddress, items, totalAmount, status, createdAt } = order;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle >Your Order Details</DialogTitle>
      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        <hr />
        <Typography sx={{ marginTop: 3 }} variant="body1" fontWeight="bold" gutterBottom>
          Order #{order._id}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Thank you for shipping with us!
        </Typography>

        {/* Order Info */}
        <Grid container spacing={2} style={{ marginTop: "16px" }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography sx={{ marginBottom: 2, borderBottom: '1px solid #c3c3c3'}} variant="subtitle1" fontWeight="bold">Order Info</Typography>
                <Grid container spacing={3}>
                  {/* First Row */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color='grey'>Order Date</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {new Date(createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color='grey'>Delivery Date</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {new Date(new Date(createdAt).setDate(new Date(createdAt).getDate() + 7)).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </Grid>
                  {/* Second Row */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color='grey'>Status</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {order.status}
                    </Typography>

                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color='grey'>Payment Status</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Paid
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Info */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography sx={{ marginBottom: 2, borderBottom: '1px solid #c3c3c3'}} variant="subtitle1" fontWeight="bold">User</Typography>
                <Grid container spacing={3}>
                  {/* First Row */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color='grey'>Name</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {order.user.fullName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color='grey'>Phone</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {order.user.phone || 'None'}
                    </Typography>
                  </Grid>
                  {/* Second Row */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color='grey'>Email</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {order.user.email}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Shipping Address */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography sx={{ marginBottom: 2, borderBottom: '1px solid #c3c3c3'}} variant="subtitle1" fontWeight="bold">Shipping Address</Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </Typography>
                <Typography variant="subtitle2">
                  {shippingAddress.address1}
                </Typography>
                <Typography variant="subtitle2">
                  {shippingAddress.city}, {shippingAddress.state}
                </Typography>
                <Typography variant="subtitle2">
                  {shippingAddress.zip}, {shippingAddress.country}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        {/* Items */}
        <Typography variant="h6" fontWeight="bold" style={{ margin: "25px 0", borderBottom: '1px solid #c3c3c3' }}>
          Products ({items?.length})
        </Typography>

        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 0, md: 1 } }}>
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
                  marginBottom: 2,
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {item.product.name}
                </Typography>
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
                    src={`${API_BASE_URL}${item.product.images && item.product.images[0]}`}
                    alt={item.product.name}
                    style={{
                      width: 80,
                      height: 100,
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
                      Price: ${item.product.price}
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
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle2" color='grey'>Quantity:</Typography>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {item.quantity || '1'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography fontWeight="bold" sx={{ marginRight: 1 }}>
                        ${item.totalPrice.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Summary */}
        <Typography variant="h6" fontWeight="bold" style={{ margin: "25px 0", borderBottom: '1px solid #c3c3c3' }}>
          Order Summary
        </Typography>
        <Card
          style={{
            marginTop: "24px",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Grid container spacing={2} >
            {/* Labels */}
            <Grid item xs={6}>
              <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                Subtotal
              </Typography>
              <Typography variant="body2" style={{ color: "#555" }}>
                Shipping Charge
              </Typography>
              <Typography variant="body2" style={{ color: "#555" }}>
                Taxes
              </Typography>
              <Typography variant="body2" style={{ color: "#555" }}>
                Discount
              </Typography>
              <Typography variant="h6" style={{ marginTop: "15px", borderTop: "1px solid #c3c3c3", fontWeight: "bold", color: "#333" }}>
                Total
              </Typography>
            </Grid>
            {/* Values */}
            <Grid item xs={6} style={{ textAlign: "right" }}>
              <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                ${totalAmount}
              </Typography>
              <Typography variant="body2" style={{ color: "#555" }}>
                +$7.00
              </Typography>
              <Typography variant="body2" style={{ color: "#555" }}>
                +$5.00
              </Typography>
              <Typography variant="body2" style={{ color: "#555" }}>
                $0.00
              </Typography>
              <Typography variant="h6" style={{ marginTop: "15px", borderTop: "1px solid #c3c3c3", fontWeight: "bold", color: "#333" }}>
                ${(totalAmount + 7.00 + 5.00).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;

