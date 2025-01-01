import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BaseTable from './baseTable';
import EditProductDialog from './editProductDialog';
import AddProductDialog from './addProductDialog';
import { api } from '../../../utils/api';

const columns = [
  { field: 'name', headerName: 'Product Name', flex: 1, minWidth: 150 },
  { field: 'category', headerName: 'Category', flex: 1, minWidth: 150 },
  { field: 'subcategory', headerName: 'Subcategory', flex: 1, minWidth: 150 },
  { field: 'stock', headerName: 'Inventory', type: 'number', flex: 1, minWidth: 100 },
];

const ProductSection = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/subcategories'),
          api.get('/products'),
        ]);
        setCategories(categoriesRes.data);
        setSubcategories(subcategoriesRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // Create lookup maps for categories and subcategories
  const categoryMap = Object.fromEntries(categories.map((cat) => [cat._id, cat.name]));
  const subcategoryMap = Object.fromEntries(
    subcategories.map((subcat) => [
      subcat._id,
      { name: subcat.name, category_id: subcat.category_id },
    ])
  );

  // Transform products to include category and subcategory names
  const transformedProducts = products.map((product) => {
    const subcategory = subcategoryMap[product.subcategory_id];
    const categoryName = subcategory ? categoryMap[subcategory.category_id] : '';
    const subcategoryName = subcategory ? subcategory.name : '';

    return {
      ...product,
      category_id: subcategory ? subcategory.category_id : null,
      category: categoryName,
      subcategory: subcategoryName,
    };
  });

  const handleEdit = (id) => {
    const product = filteredProducts.find((product) => product._id === id)
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const token = localStorage.getItem("token");

  const handleEditSave = async (editedProduct) => {
    try {
      const { _id, ...updatedProduct } = editedProduct;
      const res = await api.put(`/products/${_id}/add`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === _id ? res.data : product
        )
      );
      setIsEditOpen(false);
    } catch (err) {
      console.error('Error updating the product:', err);
    }
  };

  const handleDelete = async (deleteProduct) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (confirm) {
      try {
        await api.delete(`/products/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: deleteProduct,
        });

        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== deleteProduct._id));
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleAdd = () => {
    setIsAddOpen(true);
  };

  const handleAddSave = async (newProduct) => {
    try {
      // Create a product
      const res = await api.post('/products', newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const createdProduct = res.data

      // Update the products field in the subcategory
      await api.put(`/subcategories/${createdProduct.subcategory_id}/add-item`,
        { operation: 'push',
          data : { products: createdProduct._id }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      // Update local state
      setProducts((prevProducts) => [...prevProducts, createdProduct]);
      setIsAddOpen(false);
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const filteredProducts = transformedProducts.filter((product) => {
    const matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesInventory =
      inventoryFilter === 'low'
        ? product.stock < 10
        : inventoryFilter === 'in-stock'
        ? product.stock > 0
        : inventoryFilter === 'out-of-stock'
        ? product.stock === 0
        : true;

    return matchesSearchQuery && matchesInventory;
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
        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: '200px' }}
        />

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

      <BaseTable
        rows={filteredProducts}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditProductDialog
        open={isEditOpen}
        product={selectedProduct}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditSave}
        _categories={categories}
      />

      <AddProductDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddSave}
        _categories={categories}
      />
    </Box>
  );
};

export default ProductSection;
