import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";

// Sidebar items data
const sidebarMenu = [
  { text: "View orders", icon: <InventoryOutlinedIcon />, url: "/user/view-orders" },
  { text: "Personal details", icon: <PersonOutlineOutlinedIcon />, url: "/user/personal-details" },
  { text: "Change password", icon: <LockOpenOutlinedIcon />, url: "/user/change-password" },
  { text: "Payment methods", icon: <CreditCardOutlinedIcon />, url: "/user/payment-methods" },
  { text: "Manage addresses", icon: <HomeOutlinedIcon />, url: "/user/manage-addresses" },
  { text: "Log out", icon: <LogoutOutlinedIcon />, url: "/user/logout" },
];

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: { xs: "100%", md: "25%" },
        borderRadius: 2,
        padding: 1,
      }}
    >
      <List>
        {sidebarMenu.map((item, index) => (
          <NavLink
            to={item.url}
            key={index}
            style={({ isActive }) => ({
              textDecoration: "none",
              display: "block",
              marginBottom: "8px",
              borderRadius: "8px",
              backgroundColor: isActive ? "#E8F0FE" : "transparent",
              color: isActive ? "#1A73E8" : "inherit",
            })}
          >
            <ListItem
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#D6E4FC",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "inherit",
                }}
              >
                {React.cloneElement(item.icon, {
                  sx: { marginRight: 1 },
                })}
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "inherit",
                      }}
                    >
                      {item.text}
                    </Typography>
                  }
                />
              </Box>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
