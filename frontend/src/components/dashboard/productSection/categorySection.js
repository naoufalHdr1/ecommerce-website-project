import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Stack,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { api } from '../../../utils/api';
import BaseTable from './baseTable';
import AddCategoryDialog from './addCategoryDialog';
import AddSubcategoryDialog from './addSubcategoryDialog';

const columns = [
  { field: 'name', headerName: 'Subcategory Name', flex: 1, minWidth: 150 },
  { field: 'productCount', headerName: 'Number of Products', type: 'number', flex: 1, minWidth: 150 },
];

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await api.get('/subcategories');
        setSubcategories(res.data);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
      }
    };

    fetchSubcategories();
  }, []);

  // Transform and filter subcategories to include productCount
  const rows = subcategories
    .filter((subcategory) =>
      selectedCategory ? subcategory.category_id === selectedCategory : true
    )
    .filter((subcategory) =>
      subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((subcategory) => ({
      ...subcategory,
      productCount: subcategory.products.length,
    }));

  const handleSubcategorySelect = (subcategoryId) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleSelectAllSubcategories = (event) => {
    setSelectedSubcategories(
      event.target.checked ? subcategories.map((sub) => sub._id) : []
    );
  };

  const handleCategoryAdd = () => {
    setIsAddCategoryOpen(true);
  };

  const handleAddCategorySave = async (newCategory) => {
    try {
      const res = await api.post('/categories', newCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories((prevCategories) => [...prevCategories, res.data]);
      setIsAddCategoryOpen(false);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleSubcategoryAdd = () => {
    setIsAddSubcategoryOpen(true);
  };

  const handleAddSubcategorySave = async (newSubcategory) => {
    try {
	    console.log("subcategory=", newSubcategory);
      const res = await api.post('/subcategories', newSubcategory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const createdSubcat = res.data

      await api.put(`/categories/${createdSubcat.category_id}/add-item`,
        { subcategories: createdSubcat._id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        },
      );

      setSubcategories((prevSubcategories) => [...prevSubcategories, createdSubcat]);
      setIsAddSubcategoryOpen(false);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  return (
    <Box p={0}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap">
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Categories
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<Add />} onClick={handleCategoryAdd}>
            Category
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleSubcategoryAdd}>
            Subcategory
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        {/* Search Subcategories */}
        <TextField
          label="Search Subcategories"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: '200px' }}
        />

        {/* Category Selector */}
        <FormControl size="small" sx={{ flex: 1, minWidth: '200px' }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <BaseTable
        rows={rows}
        columns={columns}
        onEdit={() => {}}
        onDelete={() => {}}
      />

      <AddCategoryDialog
        open={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSave={handleAddCategorySave}
      />

      <AddSubcategoryDialog
        open={isAddSubcategoryOpen}
        onClose={() => setIsAddSubcategoryOpen(false)}
        onSave={handleAddSubcategorySave}
        _categories={categories}
      />
    </Box>
  );
};

export default CategorySection;
