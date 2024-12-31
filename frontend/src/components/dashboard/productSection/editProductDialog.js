import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Stack,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { AddPhotoAlternate, Close } from '@mui/icons-material';
import { api, uploadImages } from '../../../utils/api';
import { API_BASE_URL } from '../../../utils/config';

const EditProductDialog = ({ open, product, onClose, onSave, _categories }) => {
  const [editedProduct, setEditedProduct] = useState(product || {});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    setCategories(_categories);
  }, [_categories]);

  useEffect(() => {
    setEditedProduct(product || {});
    setUploadedImages(
      (product?.images || []).map((image) =>
        image.startsWith('/uploads/')
          ? `${API_BASE_URL}${image}`
          : image
      )
    );
    if (product?.category_id) {
      fetchSubcategories(product.category_id);
    }
  }, [product]);

  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await api.get(`/subcategories/findBy?category_id=${categoryId}`);
      setSubcategories(res.data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;

    setEditedProduct((prev) => ({
      ...prev,
      category_id: selectedCategoryId || null,
      category: selectedCategoryId ? categories.find((cat) => cat._id === selectedCategoryId) : null,
      subcategory_id: null,
      subcategory: null,
    }));

    if (selectedCategoryId) {
      fetchSubcategories(selectedCategoryId);
    } else {
      setSubcategories([]);
    }
  };

  const handleSubcategoryChange = (event) => {
    const selectedSubcategoryId = event.target.value;

    setEditedProduct((prev) => ({
      ...prev,
      subcategory_id: selectedSubcategoryId || null,
      subcategory: selectedSubcategoryId
        ? subcategories.find((sub) => sub._id === selectedSubcategoryId)
        : null,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...imagePreviews]);
    setEditedProduct((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index)); 
    setEditedProduct((prev) => {
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      return {
        ...prev,
        images: updatedImages,
      };
    });
  };

  const handleSave = async () => {
    try {
      // Allowed fields to be sent
      const allowedFields = [
        '_id',
        'name',
        'description',
        'price',
        'stock',
        'images',
        'sizes',
        'colors',
        'subcategory_id',
      ];

      // Always include `_id`
      const modifiedFields = {
        _id: editedProduct._id,
      };

      // Add only modified fields
      Object.keys(editedProduct).forEach((key) => {
        if (
    allowedFields.includes(key) &&
    key !== '_id' &&
    editedProduct[key] !== product[key]
        ) {
    modifiedFields[key] = editedProduct[key];
        }
      });

      // Handle images
      const newImages = editedProduct.images || [];

      // Separate new and existing images
      const imagesToUpload = newImages.filter((img) => img instanceof File);
      const imagesToKeep = newImages.filter((img) => typeof img === 'string');

      // Upload new images and add to `imagesToKeep`
      const uploadedImageUrls = await uploadImages(imagesToUpload);
      modifiedFields.images = [...imagesToKeep, ...uploadedImageUrls];

      onSave(modifiedFields);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Product Name"
            fullWidth
            value={editedProduct.name || ''}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={editedProduct.description || ''}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, description: e.target.value })
            }
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={editedProduct.price || ''}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) || 0 })
            }
          />
          <TextField
            label="Stock"
            type="number"
            fullWidth
            value={editedProduct.stock || ''}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, stock: parseInt(e.target.value, 10) || 0 })
            }
          />
          {/* Category Select */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={editedProduct.category_id || ''}
              onChange={handleCategoryChange}
            >
              <MenuItem value="">None</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Subcategory Select */}
          <FormControl fullWidth>
            <InputLabel>Subcategory</InputLabel>
            <Select
              value={editedProduct.subcategory_id || ''}
              onChange={handleSubcategoryChange}
              disabled={!editedProduct.category_id}
            >
              {subcategories.map((sub) => (
                <MenuItem key={sub._id} value={sub._id}>
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Images */}
          <Box>
            <Button
              variant="contained"
              component="label"
              startIcon={<AddPhotoAlternate />}
            >
              Upload Images
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </Button>
            <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
              {uploadedImages.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={image}
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
            </Stack>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
