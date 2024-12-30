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
} from '@mui/material';
import { AddPhotoAlternate, Close } from '@mui/icons-material';
import { api, uploadImages } from '../../../utils/api';

const AddCategoryDialog = ({ open, onClose, onSave }) => {
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: null,
    banner: null,
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedBanner, setUploadedBanner] = useState(null);

  const handleSave = async () => {
    try {
      const uploadedImageUrl = await uploadImages(newCategory.image);
      const uploadedBannerUrl = await uploadImages(newCategory.banner);

      const categoryData = {
        ...newCategory,
        image: uploadedImageUrl,
        banner: uploadedBannerUrl,
      };

      onSave(categoryData);
      setNewCategory({ name: '', description: '', image: null, banner: null });
      setUploadedImage(null);
      setUploadedBanner(null);
      onClose();
    } catch (err) {
      console.error('Error saving category:', err);
    }
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'image') {
        setUploadedImage(previewUrl);
        setNewCategory((prev) => ({ ...prev, image: file }));
      } else {
        setUploadedBanner(previewUrl);
        setNewCategory((prev) => ({ ...prev, banner: file }));
      }
    }
  };

  const handleRemoveImage = (type) => {
    if (type === 'image') {
      setUploadedImage(null);
      setNewCategory((prev) => ({ ...prev, image: null }));
    } else {
      setUploadedBanner(null);
      setNewCategory((prev) => ({ ...prev, banner: null }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Category Name"
            variant="outlined"
            size="small"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Description"
            variant="outlined"
            size="small"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
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
                  onChange={(e) => handleImageUpload(e, 'image')}
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
                  onClick={() => handleRemoveImage('image')}
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
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                component="label"
                startIcon={<AddPhotoAlternate />}
              >
                Upload Banner Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'banner')}
                />
              </Button>
            </Stack>
            {uploadedBanner && (
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
                  src={uploadedBanner}
                  alt="Uploaded Banner"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage('banner')}
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

export default AddCategoryDialog;
