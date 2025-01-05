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
  ImageListItem,
  IconButton,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useStateContext } from './stateContext';

const steps = [
  { title: 'Product Information', description: 'Fill in the basic details about the product, including its name, category, price, and stock.' },
  { title: 'Detailed Description', description: 'Provide a detailed description of the product, highlighting its features and benefits.' },
  { title: 'Upload Images', description: 'Upload images of the product to showcase it visually.' },
];

export default function AddDialog({ open, onClose, onSave }) {
  const { state } = useStateContext();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    sizes: [],
    colors: [],
    category: '',
    subcategory_id: '',
    description: '',
    images: [],
  });
  const sizesOptions = ['S', 'M', 'L', 'XL'];
  const colorsOptions = ['Red', 'Blue', 'Green', 'Yellow'];
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});

  useEffect(() => {
    const categoryNames = state.categories.map((category) => category.name);

    // Map subcategories by category name
    const subcategoryMap = {};
    state.categories.forEach((category) => {
      const subcats = state.subcategories
        .filter((subcat) => subcat.category_id === category._id)
        .map((subcat) => ({ id: subcat._id, name: subcat.name }));
      subcategoryMap[category.name] = subcats;
    });

    setCategories(categoryNames);
    setSubcategories(subcategoryMap);
  }, [state.categories, state.subcategories]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'category' && { subcategory: '' }),
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

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files.map((file) => URL.createObjectURL(file))],
    }));
  };

  const handleImageRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const { category, ...dataToSend } = formData;
    onSave(dataToSend);
    setFormData({
      name: '',
      price: 0,
      stock: 0,
      sizes: [],
      colors: [],
      category: '',
      subcategory_id: '',
      description: '',
      images: [],
    });
    onClose();
    setActiveStep(0);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Item</DialogTitle>
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

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl variant="standard" sx={{ flex: 1 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl variant="standard" sx={{ flex: 1 }}>
                    <InputLabel>Subcategory</InputLabel>
                    <Select
                      value={formData.subcategory_id}
                      onChange={(e) => handleChange('subcategory_id', e.target.value)}
                      disabled={!formData.category}
                    >
                      {formData.category &&
                        subcategories[formData.category].map((subcategory) => (
                          <MenuItem key={subcategory} value={subcategory.id}>
                            {subcategory.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>

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
                    onChange={handleImageUpload}
                  />
                </Button>
                <ImageList cols={3} rowHeight={120} gap={8}>
                  {formData.images.map((img, index) => (
                    <ImageListItem key={index} sx={{ position: 'relative' }}>
                      <img src={img} alt={`Uploaded ${index}`} loading="lazy" style={{ objectFit: 'cover', height: '100%', width: '100%' }} />
                      <IconButton
                        size="small"
                        onClick={() => handleImageRemove(index)}
                        sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </ImageListItem>
                  ))}
                </ImageList>
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
