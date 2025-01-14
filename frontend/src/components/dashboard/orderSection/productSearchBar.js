import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Divider,
  List,
  ListItem,
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Search as SearchIcon, AccountCircle, Close as CloseIcon } from '@mui/icons-material';
import { api } from '../../../utils/api';
import { API_BASE_URL } from '../../../utils/config';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ProductSearchBar = () => {
  const [searchProduct, setSearchProduct] = useState('');
  const [productResults, setProductResults] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleQuantityChangee = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  // Fetch products based on search query
  const handleSearch = async () => {
    setHasSearched(true);
    if (!searchProduct) return;

    setLoading(true);
    try {
      const res = await api(`/products/findBy?name=${searchProduct}`);
      setProductResults(res.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setHasSearched(false);
    setProductResults([]);
    setSearchProduct('');
  };


  const handleProductSelect = (product) => {
    if (!selectedProducts.find((item) => item._id === product._id)) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, Number(quantity)) }
          : item
      )
    );
  };

  const calculateTotalPrice = () => {
    return selectedProducts.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Box>
      {/* Search Input */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <TextField
          fullWidth
          id="input-with-icon-textfield"
          label="Search Product"
          placeholder="Search for products..."
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          sx={{ mb: 2, mt: 3 }}
          variant="standard"
        />
        {productResults.length ? (
          <IconButton type="button" sx={{ p: '10px' }} aria-label="clear" onClick={resetSearch}>
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && <CircularProgress />}

      {/* Product Results */}
      <Box
        sx={{
          maxWidth: 600,
          margin: "auto",
          padding: 1,
          overflowY: "auto",
          maxHeight: 300,
        }}
      >
        {hasSearched && productResults.length === 0 ? (
          <Typography variant="body2" color="textSecondary" textAlign="center">
            No products found
          </Typography>
        ) : (
          productResults.map((product) => (
            <Card
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 2,
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              {/* Product Image */}
              <CardMedia
                component="img"
                image={`${API_BASE_URL}${product.images[0]}`}
                alt={product.name}
                sx={{
                  width: "35%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: 1,
                }}
              />

              {/* Product Details */}
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Subcategory Name */}
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  {product.subcategory_id}
                </Typography>

                {/* Product Name */}
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {product.name}
                </Typography>

                {/* Product Price */}
                <Typography variant="body1" color="primary" sx={{ fontWeight: "bold" }}>
                  ${(product.price * quantity).toFixed(2)}
                </Typography>

                {/* Product variant */}
                {/* Sizes */}
                <Box sx={{ marginTop: 1, display: "flex" }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1, alignContent: "center" }}>
                    Sizes:
                  </Typography>
                  {product.sizes && product.sizes.length > 0 ? (
                    <RadioGroup
                      row
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      sx={{ gap: 1 }}
                    >
                      {product.sizes.map((size) => (
                        <FormControlLabel
                          key={size}
                          value={size}
                          control={<Radio size="small" />}
                          label={size}
                        />
                      ))}
                    </RadioGroup>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No sizes
                    </Typography>
                  )}
                </Box>

                {/* Colors */}
                <Box sx={{ display: "flex", marginTop: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold", marginRight: 1, alignContent: "center" }}>
                    Colors:
                  </Typography>
                  {product.colors && product.colors.length > 0 ? (
                    <Box sx={{ display: "inline-flex", gap: 1, marginTop: 1 }}>
                      {product.colors.map((color) => (
                        <Box
                          key={color}
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: color,
                            borderRadius: "50%",
                            border:
                              selectedColor === color
                                ? "2px solid #000"
                                : "1px solid #ccc",
                            cursor: "pointer",
                          }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No colors
                    </Typography>
                  )}
                </Box>

                {/* Quantity and Add Product */}
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ marginTop: 1 }}
                >
                  {/* Quantity Controls */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ marginRight: 1 }}>
                      Quantity:
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChangee(-1)}
                      disabled={quantity === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      value={quantity}
                      variant="standard"
                      size="small"
                      sx={{ width: 40, textAlign: "center" }}
                      inputProps={{ readOnly: true, style: { textAlign: "center" } }}
                    />
                    <IconButton size="small" onClick={() => handleQuantityChangee(1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>

                  {/* Add Product Button */}
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => console.log("test")}
                  >
                    Add Product
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          ))
	)}
      </Box>

      {/* Selected Products */}
      <List sx={{ mt: 2 }}>
        {selectedProducts.map((product) => (
          <ListItem key={product._id} sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={`${API_BASE_URL}${product.images[0]}`} alt={product.name} sx={{ mr: 2 }} />
            <Typography sx={{ flex: 1 }}>{product.name}</Typography>
            <TextField
              type="number"
              value={product.quantity}
              onChange={(e) => handleQuantityChange(product._id, e.target.value)}
              sx={{ width: '50px', mr: 2 }}
              inputProps={{ min: 1 }}
            />
            <Typography>${(product.price * product.quantity).toFixed(2)}</Typography>
          </ListItem>
        ))}
      </List>

      {/* Divider */}
      <Divider sx={{ my: 2 }} />

      {/* Total Price */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Total: ${calculateTotalPrice().toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductSearchBar;
