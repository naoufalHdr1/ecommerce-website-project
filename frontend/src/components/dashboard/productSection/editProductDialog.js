import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const EditProductDialog = ({ open, product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = React.useState(product || {});

  React.useEffect(() => {
    setEditedProduct(product || {});
  }, [product]);

  const handleSave = () => {
    onSave(editedProduct);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Product Name"
          fullWidth
          value={editedProduct.name || ''}
          onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Category"
          fullWidth
          value={editedProduct.category || ''}
          onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Inventory"
          type="number"
          fullWidth
          value={editedProduct.inventory || ''}
          onChange={(e) => setEditedProduct({ ...editedProduct, inventory: +e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;

