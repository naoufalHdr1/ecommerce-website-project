import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CustomDialog from './dialog';
import BaseTable from '../productSection/baseTable';
import { api, uploadImages } from '../../../utils/api';
import { API_BASE_URL } from '../../../utils/config';

const getRandomColor = () => {
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  return randomColor;
};

export default function UserSection() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [token]);

  const getColumns = () => [
    {
      field: "avatar",
      headerName: "Avatar",
      width: 100,
      renderCell: (params) => {
        // Construct the full avatar URL
        const avatarUrl = params.value ? `${API_BASE_URL}${params.value}` : null;
        const nameInitial = params.row.name ? params.row.name.charAt(0).toUpperCase() : "?";

        return avatarUrl ? (
          <Avatar src={avatarUrl} alt={params.row.fullName} />
        ) : (
          <Avatar>{nameInitial}</Avatar>
        );
      },
    },
    { field: 'fullName', headerName: 'Full Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 100 },
    { field: 'createdAt', headerName: 'Created At', width: 150 },
  ];

  const getRows = () => users;

  // Handle adding a user
  const handleAddDialog = () => setIsAddOpen(true);

  const handleAddSave = async (newUser) => {
    try {
      console.log("newUser=", newUser);
      const uploadedImageUrl = newUser.avatar
        ? await uploadImages(newUser.avatar)
        : null;
      console.log("uploaded Image Url=", uploadedImageUrl[0]);

      newUser.avatar = uploadedImageUrl[0]

      console.log('newUser after add image=', newUser);
      const res = await api.post('/users', newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("res=", res.data)
      setUsers((prev) => [...prev, res.data]);
      setIsAddOpen(false);
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  // Handle editing a user
  const handleEditDialog = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleEditSave = async (updatedUser) => {
    try {
      const res = await api.put(`/users/${selectedUser._id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prev) =>
        prev.map((user) => (user._id === selectedUser._id ? res.data : user))
      );
      setIsEditOpen(false);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  // Handle deleting a user
  const handleDeleteDialog = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleDelete = async (confirm) => {
    if (!confirm) {
      setSelectedUser(null);
      setIsDeleteOpen(false);
      return;
    }

    try {
      await api.delete(`/users/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
      setIsDeleteOpen(false);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div style={{ marginBottom: 15 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          User List
        </Typography>
        <Tooltip title="Add User">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddDialog}
          >
            Add User
          </Button>
        </Tooltip>
      </Box>

      <BaseTable
        mb={2}
        rows={getRows()}
        columns={getColumns()}
        onEdit={handleEditDialog}
        onDelete={handleDeleteDialog}
        sx={{ marginBottom: 15 }}
      />

      {/* Add/Edit Dialog */}
      <CustomDialog
        open={isAddOpen || isEditOpen}
        onClose={() => {
          setIsAddOpen(false);
          setIsEditOpen(false);
          setSelectedUser(null);
        }}
        onSave={isAddOpen ? handleAddSave : handleEditSave}
        user={isEditOpen ? selectedUser : undefined}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUser(null);
        }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected user? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDelete(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(true)}
            color="error"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
