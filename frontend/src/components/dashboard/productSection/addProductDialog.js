import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, Tabs, Tab, InputAdornment, Autocomplete, Chip, IconButton, Stack } from '@mui/material';
import { AddPhotoAlternate, Close } from '@mui/icons-material';
import { api, uploadImages } from '../../../utils/api';

const COLORS = [
  { name: 'Red', value: '#f44336' },
  { name: 'Green', value: '#4caf50' },
  { name: 'Blue', value: '#2196f3' },
  { name: 'Yellow', value: '#ffeb3b' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#ffffff' },
];

const AddProductDialog = ({ open, onClose, onSave, _categories }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sizes: [],
    colors: [],
    images: [],
  });
  const [activeTab, setActiveTab] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [categories, setCategories] = useState();
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    setCategories(_categories);
  }, [_categories]);

  const handleSave = async () => {
    try {
      const uploadedImageUrls = await uploadImages(newProduct.images);

      const productData = {
        ...newProduct,
        images: uploadedImageUrls,
        subcategory_id: newProduct.subcategory?._id || null,
      };

      onSave(productData);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        sizes: [],
        colors: [],
        images: [],
      });
      setUploadedImages([]);
      onClose();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...imagePreviews]);
    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCategoryChange = async (event, selectedCategory) => {
    setNewProduct((prev) => ({ ...prev, category: selectedCategory, subcategory: null }));

    if (selectedCategory) {
      try {
        const res = await api.get(`/subcategories/findBy?category_id=${selectedCategory._id}`);
        setSubcategories(res.data);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
      }
    } else {
      setSubcategories([]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Information" />
          <Tab label="Images" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Product Name"
              variant="standard"
              size="small"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              fullWidth
            />

            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              value={newProduct.category}
              onChange={handleCategoryChange}
              renderInput={(params) => (
                <TextField {...params} label="Category" variant="standard" size="small" fullWidth />
              )}
              fullWidth
            />

            <Autocomplete
              options={subcategories}
              getOptionLabel={(option) => option.name}
              value={newProduct.subcategory}
              onChange={(e, newValue) =>
                setNewProduct((prev) => ({ ...prev, subcategory: newValue }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Subcategory" variant="standard" size="small" fullWidth />
              )}
              fullWidth
            />

            <TextField
              label="Description"
              variant="standard"
              size="small"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Price"
              variant="standard"
              size="small"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <TextField
              label="Stock"
              variant="standard"
              size="small"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: +e.target.value })}
              fullWidth
            />
            <Autocomplete
              multiple
              options={['XS', 'S', 'M', 'L', 'XL']}
              value={newProduct.sizes}
              onChange={(e, newValue) => setNewProduct({ ...newProduct, sizes: newValue })}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip key={index} label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Sizes" variant="standard" size="small" />
              )}
              fullWidth
            />
            <Autocomplete
              multiple
              options={COLORS}
              getOptionLabel={(option) => option.name}
              value={newProduct.colors}
              onChange={(e, newValue) => setNewProduct({ ...newProduct, colors: newValue })}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    label={option.name}
                    {...getTagProps({ index })}
                    avatar={
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: option.value,
                        }}
                      />
                    }
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Colors" variant="standard" size="small" />
              )}
              fullWidth
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="contained" component="label" startIcon={<AddPhotoAlternate />}>
                Upload Images
                <input type="file" hidden multiple onChange={handleImageUpload} />
              </Button>
            </Stack>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              {uploadedImages.map((src, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    width: 120,
                    height: 120,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 1,
                  }}
                >
                  <img
                    src={src}
                    alt={`Uploaded ${index}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
