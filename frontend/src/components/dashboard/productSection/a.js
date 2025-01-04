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
import { useStateContext } from "./stateContext";

const columns = [
  { field: 'name', headerName: 'Product Name', width: 200 },
  { field: 'category', headerName: 'Category', width: 150 },
  { field: 'subcategory', headerName: 'Subcategory', width: 150 },
  { field: 'stock', headerName: 'Inventory', type: 'number', width: 100 },
];

export default function AAA({ type }) {
  const { state, dispatch } = useStateContext();
  const items = state[type];

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

  console.log('items=', items);

  const handleAddSave = async (newItem) => {
    try {
      // Create a Item
      console.log('New Item=', newItem)
      const res = await api.post('/products', newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      console.log("type=", type);
      console.log(`ADD_${type.toUpperCase()}`)
      dispatch({ type: `ADD_${type.toUpperCase()}`, payload: res.data });
      setTimeout(() => {
        console.log('Products after addition:', state.products);
      }, 0);
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
        rows={items}
        getRowId={(row) => row._id}
        columns={columns}
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
        onClose={() => setDialogOpen(false)}
        onSave={handleAddSave}
      />
    </div>
  );
}
