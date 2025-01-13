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
import BaseTable from './baseTable';
import { api, uploadImages } from '../../../utils/api';
import { API_BASE_URL } from '../../../utils/config';

export default function ModelSection({ modelConfig }) {
  const {
    modelName,
    apiEndpoint,
    columns,
    dialogComponent: DialogComponent,
    rowKey = '_id',
    title = `${modelName} List`,
  } = modelConfig;

  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error(`Error fetching ${modelName}:`, err);
      }
    };

    fetchData();
  }, [apiEndpoint, modelName, token]);

  // Handle Adding An Item
  const handleAddDialog = () => setIsAddOpen(true);

  const handleAddSave = async (newItem) => {
    try {
      const res = await api.post(apiEndpoint, newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prev) => [...prev, res.data]);
      setIsAddOpen(false);
    } catch (err) {
      console.error(`Error adding ${modelName}:`, err);
    }
  };

  // Handle Editing An Item
  const handleEditDialog = (item) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleEditSave = async (updatedItem) => {
    try {
      const res = await api.put(`${apiEndpoint}/${selectedItem[rowKey]}`, updatedItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prev) =>
        prev.map((item) => (item[rowKey] === selectedItem[rowKey] ? res.data : item))
      );
      setIsEditOpen(false);
    } catch (err) {
      console.error(`Error updating ${modelName}:`, err);
    }
  };

  // Handle Deleting An Item
  const handleDeleteDialog = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleDelete = async (confirm) => {
    if (!confirm) {
      setSelectedItem(null);
      setIsDeleteOpen(false);
      return;
    }

    try {
      await api.delete(`${apiEndpoint}/${selectedItem[rowKey]}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prev) => prev.filter((item) => item[rowKey] !== selectedItem[rowKey]));
      setIsDeleteOpen(false);
    } catch (err) {
      console.error(`Error deleting ${modelName}:`, err);
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
          {title}
        </Typography>
        <Tooltip title={`Add ${modelName}`}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddDialog}
          >
            Add {modelName}
          </Button>
        </Tooltip>
      </Box>

      <BaseTable
        mb={2}
        rows={data}
        columns={columns}
        onEdit={handleEditDialog}
        onDelete={handleDeleteDialog}
        sx={{ marginBottom: 15 }}
      />

      {/* Add/Edit Dialog */}
      {DialogComponent && (
        <DialogComponent
          open={isAddOpen || isEditOpen}
          onClose={() => {
            setIsAddOpen(false);
            setIsEditOpen(false);
            setSelectedItem(null);
          }}
          onSave={isAddOpen ? handleAddSave : handleEditSave}
          item={isEditOpen ? selectedItem : undefined}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedItem(null);
        }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected {modelName}? This action
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
