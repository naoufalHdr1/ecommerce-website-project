import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Chip,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Typography,
  ImageList,
  IconButton,
  Autocomplete,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useStateContext } from './stateContext';
import { uploadImages } from '../../../utils/api';
import { API_BASE_URL } from '../../../utils/config';

export default function CustomDialog({ type, open, onClose, onSave, item, categoryMap, subcategoryMap }) {
  const { state } = useStateContext();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    sizes: [],
    colors: [],
    category_id: '',
    subcategory_id: '',
    description: '',
    images: [],
    banners: [],
  });
  const sizesOptions = ['S', 'M', 'L', 'XL'];
  const colorsOptions = ['Red', 'Blue', 'Green', 'Yellow'];
  const [error, setError] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedBanners, setUploadedBanners] = useState([]);

  const steps = type === 'products' ? [
    { title: 'Product Information', description: 'Fill in the basic details about the product.' },
    { title: 'Detailed Description', description: 'Provide a detailed description of the product.' },
    { title: 'Upload Images', description: 'Upload images of the product.' }
  ] : type === 'subcategories' ? [
    { title: 'Subcategory Information', description: 'Fill in the details about the subcategory.' },
    { title: 'Detailed Description', description: 'Provide a detailed description of the subcategory.' },
    { title: 'Upload Images', description: 'Upload images for the subcategory.' },
  ] : [
    { title: 'Category Information', description: 'Fill in the details about the category.' },
    { title: 'Detailed Description', description: 'Provide a detailed description of the category.' },
    { title: 'Upload Images & Banners', description: 'Upload images and banners for the category.' },
  ];

  // Initialize form data with the product data
  useEffect(() => {
    if (item) {
      setFormData(item);
      if (item?.images) {
        setUploadedImages(item.images.map((image) => `${API_BASE_URL}${image}`));
      }
      if (item?.banners) {
        setUploadedBanners(item.banners.map((banner) => `${API_BASE_URL}${banner}`));
      }
    } else {
      setFormData({
        name: '',
        price: 0,
        stock: 0,
        sizes: [],
        colors: [],
        category_id: '',
        subcategory_id: '',
        description: '',
        images: [],
        banners: [],
      });
      setUploadedImages([]);
      setUploadedBanners([]);
    }
  }, [item]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === 'name' && value) {
      setError(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !formData.name) {
      setError(true);
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    if (type === 'images') {
      setUploadedImages((prev) => [...prev, ...previews]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    } else if (type === 'banners') {
      setUploadedBanners((prev) => [...prev, ...previews]);
      setFormData((prev) => ({
        ...prev,
        banners: [...prev.banners, ...files],
      }));
    }
  };

  const handleImageRemove = (index, type) => {
    if (type === 'images') {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else if (type === 'banners') {
      setUploadedBanners((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
        ...prev,
        banners: prev.banners.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSave = async () => {
    // Upload images and banners
    const uploadedImageUrls = formData.images?.length
      ? await uploadImages(formData.images)
      : [];
    const uploadedBannerUrls = formData.banners?.length
      ? await uploadImages(formData.banners)
      : [];

    // Filter data based on the type
    let itemData = {};
    if (type === 'products') {
      itemData = {
        name: formData.name,
        price: formData.price,
        stock: formData.stock,
        sizes: formData.sizes,
        colors: formData.colors,
        category_id: formData.category_id,
        subcategory_id: formData.subcategory_id,
        description: formData.description,
        images: uploadedImageUrls,
      };
    } else if (type === 'subcategories') {
      itemData = {
        name: formData.name,
        category_id: formData.category_id,
        description: formData.description,
        images: uploadedImageUrls,
      };
    } else if (type === 'categories') {
      itemData = {
        name: formData.name,
        description: formData.description,
        images: uploadedImageUrls,
        banners: uploadedBannerUrls,
      };
    }

    // Call the onSave function with the filtered data
    onSave(itemData);

    // Reset and close the dialog
    onClose();
    setActiveStep(0);
    setFormData({
      name: '',
      price: 0,
      stock: 0,
      sizes: [],
      colors: [],
      category_id: '',
      subcategory_id: '',
      description: '',
      images: [],
      banners: [],
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{item ? 'Edit' : 'Add'} {type === 'products' ? 'Product' : type === 'subcategories' ? 'Subcategory' : 'Category'}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">{steps[activeStep].title}</Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              {steps[activeStep].description}
            </Typography>

            {activeStep === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Name"
                  required
                  fullWidth
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  variant="standard"
                  error={error}
                  helperText={error ? 'Name is required to proceed.' : ''}
                />

                {(type === 'products' || type === 'subcategories') && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl variant="standard" sx={{ flex: 1 }}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={formData.category_id}
                        onChange={(e) => handleChange('category_id', e.target.value)}
                      >
                        {state.categories.length > 0 ? (
                          Object.entries(categoryMap).map(([id, value]) => ( 
                            <MenuItem key={id} value={id}>
                              {value.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No categories available</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    {type === 'products' && (
                      <FormControl variant="standard" sx={{ flex: 1 }}>
                        <InputLabel>Subcategory</InputLabel>
                        <Select
                          value={formData.subcategory_id}
                          onChange={(e) => handleChange('subcategory_id', e.target.value)}
                          disabled={!formData.category_id}
                        >
                          {formData.category_id && categoryMap[formData.category_id] ? (
                            categoryMap[formData.category_id].subcategories.map((subcategory) => (
                              <MenuItem key={subcategory} value={subcategory}>
                                {subcategoryMap[subcategory].name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No subcategories available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                )}

                  {type === 'products' && (
                  <>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        variant="standard"
                      />
                      <TextField
                        label="Stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleChange('stock', e.target.value)}
                        variant="standard"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <FormControl variant="standard" sx={{ flex: 1 }}>
                        <InputLabel>Sizes</InputLabel>
                        <Select
                          multiple
                          value={formData.sizes}
                          onChange={(e) => handleChange('sizes', e.target.value)}
                          renderValue={(selected) => selected.join(', ')}
                        >
                          {sizesOptions.map((size) => (
                            <MenuItem key={size} value={size}>
                              <Checkbox checked={formData.sizes.includes(size)} />
                              <ListItemText primary={size} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl variant="standard" sx={{ flex: 1 }}>
                        <Autocomplete
                          multiple
                          options={colorsOptions}
                          value={formData.colors}
                          getOptionLabel={(option) => option}
                          onChange={(e, newValue) => handleChange('colors', newValue)}
                          renderTags={(value, getTagProps) =>
                            value.map((color, index) => (
                              <Chip
                                key={index}
                                label={color}
                                {...getTagProps({ index })}
                                avatar={
                                  <Box
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: '50%',
                                      backgroundColor: color.toLowerCase(),
                                    }}
                                  />
                                }
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField {...params} label="Colors" variant="standard" size="small" />
                          )}
                        />
                      </FormControl>
                    </Box>
                  </>
                  )}
              </Box>
	    )}

            {activeStep === 1 && (
              <TextField
                fullWidth
                label="Long Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                sx={{ mb: 3 }}
              />
            )}

            {activeStep === 2 && (
              <Box>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ mb: 2 }}
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'images')}
                  />
                </Button>
                <ImageList cols={3} rowHeight={120} gap={8}>
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
                        onClick={() => handleImageRemove(index, 'images')}
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
                </ImageList>

                {/* Upload Banners Section */}
                {type === 'categories' && (
                  <>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ mb: 2 }}
                >
                  Upload Banners
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'banners')}
                  />
                </Button>
                <ImageList cols={3} rowHeight={120} gap={8}>
                  {uploadedBanners.map((src, index) => (
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
                        alt={`Uploaded Banner ${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleImageRemove(index, 'banners')}
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
                </ImageList>
                  </>
                )}

              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {activeStep < steps.length && (
          <>
            <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="outlined"
              onClick={activeStep === steps.length - 1 ? handleSave : handleNext}
            >
              {activeStep === steps.length - 1 ? 'Save' : 'Next'}
            </Button>
          </>
        )}
        <Button variant="outlined" onClick={() => {
          onClose();
        }} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
