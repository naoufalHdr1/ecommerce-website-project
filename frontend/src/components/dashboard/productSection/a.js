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
  { field: 'price', headerName: 'Price', type: 'number', width: 100 },
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

  const subcategoryMap = {};
  state.subcategories.forEach((subcat) => {
    subcategoryMap[subcat._id] = {
      name: subcat.name,
      category_id: subcat.category_id,
    };
  });

  const categoryMap = {};
  state.categories.forEach((cat) => {
    categoryMap[cat._id] = cat.name;
  });

  const preprocessProducts = (products) => {
    return products.map((product) => {
      const subcategory = subcategoryMap[product.subcategory_id];
      const category = subcategory ? categoryMap[subcategory.category_id] : null;

      return {
        ...product,
        subcategory: subcategory ? subcategory.name : '',
        category: category || '',
      };
    });
  };

  // Preprocess the products
  const processedProducts = preprocessProducts(state.products);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };


  const handleAddSave = async (newItem) => {
    try {
      // Create a Item
      const res = await api.post('/products', newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      dispatch({ type: `ADD_${type.toUpperCase()}`, payload: res.data });
      setTimeout(() => {
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
        rows={processedProducts}
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
