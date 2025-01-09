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
import BaseTable from './baseTable';

export default function ItemList({ type }) {
  const { state, dispatch } = useStateContext();

  const token = localStorage.getItem("token");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // dynamically updating the columns based on the selected type
  const getColumns = (type) => {
    if (type === 'products') {
      return [
        { field: 'name', headerName: 'Product Name', width: 200 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'subcategory', headerName: 'Subcategory', width: 150 },
        { field: 'price', headerName: 'Price', type: 'number', width: 100 },
        { field: 'stock', headerName: 'Inventory', type: 'number', width: 100 },
      ];
    }

    if (type === 'subcategories') {
      return [
        { field: 'name', headerName: 'Subcategory Name', width: 200 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'productCount', headerName: 'Number of Products', type: 'number', width: 150 },
      ];
    }

    if (type === 'categories') {
      return [
        { field: 'name', headerName: 'Category Name', width: 200 },
        { field: 'subcategoryCount', headerName: 'Number of Subcategories', type: 'number', width: 150 },
      ];
    }

    return [];
  };

  const createCategoryAndSubcategoryMaps = (categories, subcategories) => {
    // Create category map: category_id -> category name, array of subcategories
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat._id] = {
        name: cat.name,
        subcategories: cat.subcategories,
      }
    });

    // Create subcategory map: subcat_id -> subcat name, cattegory_id
    const subcategoryMap = {};
    subcategories.forEach((subcat) => {
      subcategoryMap[subcat._id] = {
        name: subcat.name,
        category_id: subcat.category_id,
      };
    });

    return { categoryMap, subcategoryMap };
  };

  const { categoryMap, subcategoryMap } = createCategoryAndSubcategoryMaps(
    state.categories,
    state.subcategories
  );

  const preprocessProducts = (products) => {
    return products.map((product) => {
      const subcategory = subcategoryMap[product.subcategory_id];
      const category_id = product.subcategory_id && subcategoryMap[product.subcategory_id]
        ? subcategoryMap[product.subcategory_id].category_id
        : null;
      const category = category_id && categoryMap[category_id] ? categoryMap[category_id].name : null;

      return {
        ...product,
        subcategory: subcategory ? subcategory.name : '',
        category: category || '',
        category_id: category_id || '',
      };
    });
  };

  const preprocessSubcategories = (subcategories) => {
    return subcategories.map((subcategory) => {
      return {
        ...subcategory,
        category: subcategory.category_id ? categoryMap[subcategory.category_id]?.name : '',
        productCount: subcategory.products.length,
      };
    });
  };

  const preprocessCategories = (categories) => {
    return categories.map((category) => {
      return {
        ...category,
        subcategoryCount: category.subcategories.length,
      };
    });
  };

  // dynamically updating the rows based on the selected type
  const getRows = (type) => {
    if (type === 'products') {
      return preprocessProducts(state.products);
    }

    if (type === 'subcategories') {
      return preprocessSubcategories(state.subcategories);
    }

    if (type === 'categories') {
      return preprocessCategories(state.categories);
    }

    return [];
  };

  /* ADDING AN ITEM */
  const handleAddDialog = () => {
    setIsAddOpen(true);
  };

  const handleAddSave = async (newItem) => {
    try {
      const res = await api.post(`/${type}`, newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      dispatch({ type: `ADD_${type.toUpperCase()}`, payload: res.data });
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

  const handleEditClose = () => {
    setSelectedItem(null);
    setIsEditOpen(false);
  }

  const handleEditSave = async (item) => {
    try {
      const res = await api.put(`/${type}/${selectedItem._id}`, item, {
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
      setSelectedItem(null);
      setIsDeleteOpen(false);
      return;
    }

    try {
      await api.delete(`/${type}/${selectedItem._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: selectedItem,
      });

      dispatch({ type: `DELETE_${type.toUpperCase()}`, payload: selectedItem });
      setSelectedItem(null);
      setIsDeleteOpen(false);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleBulkDelete = () => {
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
          {type} List
        </Typography>
        <Tooltip title="Add Item">
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddDialog}>
            Add {type.toUpperCase()}
          </Button>
        </Tooltip>
      </Box>

      <BaseTable
        mb={2}
        rows={getRows(type)}
        columns={getColumns(type)}
        onEdit={handleEditDialog}
        onDelete={handleDeleteDialog}
        onBulkDelete={handleBulkDelete}
        sx={{
          marginBottom: 15,
        }}
      />
      
      {/* Dynamic Product Dialog */}
      <CustomDialog
        type={type}
        open={isAddOpen || isEditOpen}
        onClose={() => {
          if (isAddOpen) setIsAddOpen(false);
          //if (isEditOpen) setIsEditOpen(false);
          if (isEditOpen) handleEditClose();
        }}
        onSave={isAddOpen ? handleAddSave : handleEditSave}
        item={isEditOpen ? selectedItem : undefined}
        categoryMap={categoryMap}
        subcategoryMap={subcategoryMap}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={isDeleteOpen}
        onClose={() => {
          setSelectedItem(null);
          setIsDeleteOpen(false);
        }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected item? This action cannot be undone.
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
