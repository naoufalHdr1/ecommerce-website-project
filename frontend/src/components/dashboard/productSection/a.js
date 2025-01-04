import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import AddDialog from './dialog';
import { api } from '../../../utils/api';

const dummyData = {
  rows: [
    { id: 1, name: 'John Doe', age: 25, country: 'USA', isAdmin: true },
    { id: 2, name: 'Jane Smith', age: 30, country: 'Canada', isAdmin: false },
    { id: 3, name: 'Alice Johnson', age: 28, country: 'UK', isAdmin: true },
    { id: 4, name: 'Bob Brown', age: 35, country: 'Australia', isAdmin: false },
  ],
  columns: [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'age', headerName: 'Age', width: 100 },
    { field: 'country', headerName: 'Country', width: 150 },
    { field: 'isAdmin', headerName: 'Admin', width: 100, type: 'boolean' },
  ],
};

export default function AAA() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleAddSave = async (newItem) => {
    try {
      // Create a Item
      console.log('New Item=', newItem)
      const res = await api.post('/products/create', newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setItems((prevItems) => [...prevItems, res.data]);
      setDialogOpen(false);
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Product List
        </Typography>
        <Tooltip title="Add Item">
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleDialogOpen}>
            Add Product
          </Button>
        </Tooltip>
      </Box>

      <DataGrid
        loading={loading}
        rows={dummyData.rows}
        columns={dummyData.columns}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />

      {/* Product Dialog */}
      <AddDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)} />
        onSave={handleAddSave} />
    </div>
  );
}
