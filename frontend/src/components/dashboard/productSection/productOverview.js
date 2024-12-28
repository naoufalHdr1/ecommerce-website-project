import React, { useState } from 'react';
import { Box, Button, Typography, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('');

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

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesInventory =
      inventoryFilter === 'low'
        ? product.inventory < 10
        : inventoryFilter === 'in-stock'
        ? product.inventory > 0
        : inventoryFilter === 'out-of-stock'
        ? product.inventory === 0
        : true;

    return matchesSearchQuery && matchesCategory && matchesInventory;
  });

  return (
    <Box p={0}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap">
        <Typography variant="h5" fontWeight="bold">
          Product Listings
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Product
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        {/* Search Products Input */}
        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: '200px' }} // Adjust width
        />

        {/* Category Filter */}
        <FormControl size="small" sx={{ flex: 1, minWidth: '200px' }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Footwear">Footwear</MenuItem>
            <MenuItem value="Accessories">Accessories</MenuItem>
          </Select>
        </FormControl>

        {/* Inventory Status Filter */}
        <FormControl size="small" sx={{ flex: 1, minWidth: '200px' }}>
          <InputLabel>Inventory Status</InputLabel>
          <Select
            value={inventoryFilter}
            onChange={(e) => setInventoryFilter(e.target.value)}
            label="Inventory Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="low">Low Stock</MenuItem>
            <MenuItem value="in-stock">In Stock</MenuItem>
            <MenuItem value="out-of-stock">Out of Stock</MenuItem>
          </Select>
        </FormControl>
      </Box>


      <ProductTable
        products={filteredProducts}
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

