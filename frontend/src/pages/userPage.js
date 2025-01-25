import React from "react";
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
} from "@mui/material";
import { useTheme } from "@mui/system";

const UserPage = () => {
  const theme = useTheme();

  const orders = [
    {
      status: "Dispatched",
      items: [
        { title: "Arrives tomorrow", time: "7am - 7pm", quantity: 2 },
        { title: "Expected on Mon, 2 July", time: "7am - 7pm", quantity: 1 },
      ],
    },
    {
      status: "Delivered on 23 June",
      items: [
        { title: "Huawei P20 Pro 128GB Smartphone", quantity: 1 },
        { title: "Microsoft Keyboard Cover for Surface Go", quantity: 1 },
      ],
    },
    {
      status: "Delivered on 15 December, 2016",
      items: [
        { title: "Bosch Serie 2 Electric Single Oven", quantity: 1 },
      ],
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        p: 3,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", md: "25%" },
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
          p: 2,
        }}
      >
        <List>
          <ListItem button selected>
            <ListItemText primary="View orders" secondary="3" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Personal details" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Change password" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Payment methods" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Manage addresses" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Social accounts" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Log out" />
          </ListItem>
        </List>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Order history
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {orders.length} orders
        </Typography>

        {orders.map((order, index) => (
          <Card
            key={index}
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: 1,
              backgroundColor: "#f9f9f9",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ color: order.status.includes("Dispatched") ? "green" : "#333" }}
              >
                {order.status}
              </Typography>
              <Divider sx={{ my: 2 }} />

              {order.items.map((item, itemIndex) => (
                <Box
                  key={itemIndex}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography>
                    {item.title} {item.time && <span>({item.time})</span>}
                  </Typography>
                  <Typography color="text.secondary">+{item.quantity}</Typography>
                </Box>
              ))}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#76c043",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#5a8f34" },
                  }}
                >
                  Track order
                </Button>
                <Button variant="outlined">View order details</Button>
                <Button variant="outlined">Get invoice</Button>
                <Button variant="outlined">Edit order</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default UserPage;
