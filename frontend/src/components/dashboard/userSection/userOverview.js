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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CustomDialog from './dialog';
import BaseTable from '../productSection/baseTable';
import { api } from '../../../utils/api';

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
      const res = await api.post('/users', newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
