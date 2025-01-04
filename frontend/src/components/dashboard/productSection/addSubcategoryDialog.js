import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AddPhotoAlternate, Close } from '@mui/icons-material';
import { api, uploadImages } from '../../../utils/api';

const AddSubcategoryDialog = ({ open, onClose, onSave, _categories }) => {
  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    description: '',
    images: null,
    category_id: '',
  });
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleSave = async () => {
    try {
      const uploadedImageUrl = await uploadImages(newSubcategory.images);

      const subcategoryData = {
        ...newSubcategory,
        images: uploadedImageUrl,
      };

      onSave(subcategoryData);
      setNewSubcategory({
        name: '',
        description: '',
        images: null,
        category_id: '',
      });
      setUploadedImage(null);
      onClose();
    } catch (err) {
      console.error('Error saving subcategory:', err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUploadedImage(previewUrl);
      setNewSubcategory((prev) => ({ ...prev, images: file }));
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setNewSubcategory((prev) => ({ ...prev, images: null }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Subcategory</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Subcategory Name"
            variant="outlined"
            size="small"
            value={newSubcategory.name}
            onChange={(e) =>
              setNewSubcategory({ ...newSubcategory, name: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Description"
            variant="outlined"
            size="small"
            value={newSubcategory.description}
            onChange={(e) =>
              setNewSubcategory({
                ...newSubcategory,
                description: e.target.value,
              })
            }
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={newSubcategory.category_id}
              onChange={(e) =>
                setNewSubcategory({
                  ...newSubcategory,
                  category_id: e.target.value,
                })
              }
              label="Category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {_categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                component="label"
                startIcon={<AddPhotoAlternate />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
            </Stack>
            {uploadedImage && (
              <Box
                sx={{
                  position: 'relative',
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                  overflow: 'hidden',
                  mt: 2,
                }}
              >
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
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
            )}
          </Box>
        </Box>
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

export default AddSubcategoryDialog;
