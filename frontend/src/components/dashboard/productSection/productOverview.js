import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProductTable from './productTable';
import EditProductDialog from './editProductDialog';
import AddProductDialog from './addProductDialog';

const ProductOverview = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'T-Shirt', category: 'Clothing', inventory: 50 },
    { id: 2, name: 'Sneakers', category: 'Footwear', inventory: 30 },
    { id: 3, name: 'Backpack', category: 'Accessories', inventory: 20 },
  ]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const handleEditSave = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setIsEditOpen(false);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (confirm) {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    }
  };

  const handleAdd = () => {
    setIsAddOpen(true);
  };

  const handleAddSave = (newProduct) => {
    const newId = products.length ? products[products.length - 1].id + 1 : 1;
    setProducts((prevProducts) => [...prevProducts, { id: newId, ...newProduct }]);
    setIsAddOpen(false);
  };

  return (
    <Box p={0}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
      >
        <Typography variant="h5" fontWeight="bold">
          Product Listings
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Product
        </Button>
      </Box>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditProductDialog
        open={isEditOpen}
        product={selectedProduct}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditSave}
      />

      <AddProductDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddSave}
      />
    </Box>
  );
};

export default ProductOverview;
