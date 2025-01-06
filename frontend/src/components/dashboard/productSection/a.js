import React, { useState } from 'react';
import {
  Box,
  Button,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CustomDialog from './dialog';
import { api } from '../../../utils/api';
import { useStateContext } from "./stateContext";
import BaseTable from './baseTablee';

const columns = [
  { field: 'name', headerName: 'Product Name', width: 200 },
  { field: 'category', headerName: 'Category', width: 150 },
  { field: 'subcategory', headerName: 'Subcategory', width: 150 },
  { field: 'price', headerName: 'Price', type: 'number', width: 100 },
  { field: 'stock', headerName: 'Inventory', type: 'number', width: 100 },
];

export default function AAA({ type }) {
  const { state, dispatch } = useStateContext();

  const token = localStorage.getItem("token");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  /* ADDING AN ITEM */
  const handleAddDialog = () => {
    setIsAddOpen(true);
  };

  const handleAddSave = async (newItem) => {
    try {
      const res = await api.post('/products', newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      dispatch({ type: `ADD_${type.toUpperCase()}`, payload: res.data });
      setTimeout(() => {
      }, 0);
      setIsAddOpen(false);
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  /* EDITING AN ITEM */
  const handleEditDialog = (item) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleEditSave = async (item) => {
    try {
      const res = await api.put(`/products/${item._id}`, item, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({ type: `EDIT_${type.toUpperCase()}`, payload: res.data });
      setIsEditOpen(false);
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  /* DELETING AN ITEM */
  const handleDeleteDialog = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleDelete = async (confirm = false) => {
    if (!confirm) {
      setIsDeleteOpen(false);
      return;
    }

    try {
      await api.delete(`/products/${selectedItem._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: selectedItem,
      });

      dispatch({ type: `DELETE_${type.toUpperCase()}`, payload: selectedItem });
      setIsDeleteOpen(false);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleBulkDelete = () => {
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
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddDialog}>
            Add Product
          </Button>
        </Tooltip>
      </Box>

      <BaseTable
        rows={processedProducts}
        columns={columns}
        onEdit={handleEditDialog}
        onDelete={handleDeleteDialog}
        onBulkDelete={handleBulkDelete}
      />

      {/* Add Product Dialog */}
      <CustomDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddSave}
      />

      {/* Edit Product Dialog */}
      <CustomDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditSave}
        item={selectedItem}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected item(s)? This action cannot be undone.
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
