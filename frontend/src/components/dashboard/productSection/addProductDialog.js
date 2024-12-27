import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const AddProductDialog = ({ open, onClose, onSave }) => {
  const [newProduct, setNewProduct] = useState({ name: '', category: '', inventory: 0 });

  const handleSave = () => {
    onSave(newProduct);
    setNewProduct({ name: '', category: '', inventory: 0 });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Product Name"
          fullWidth
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Category"
          fullWidth
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Inventory"
          type="number"
          fullWidth
          value={newProduct.inventory}
          onChange={(e) => setNewProduct({ ...newProduct, inventory: +e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
