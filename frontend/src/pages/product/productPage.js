import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { api } from '../../utils/api';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrackingIcon from '@mui/icons-material/MyLocation';
import PublicIcon from '@mui/icons-material/Public';
import ShieldIcon from '@mui/icons-material/Shield';
import { Facebook, Twitter, Pinterest } from '@mui/icons-material';
import { useCart } from '../../contexts/cartContext';
import { useAuth } from '../../contexts/authContext';
import ProductImage from './productImage';
import { useNavigate } from "react-router-dom";

const SingleProductPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product by ID
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching the product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddToCart = async () => {
    try {
      const totalPrice = parseFloat((selectedQuantity * product.price).toFixed(2));
      const item = {
        items: {
          product: product._id,
          size: selectedSize,
          color: selectedColor,
          quantity: selectedQuantity,
          totalPrice,
        },
        totalAmount: parseFloat(((product?.totalAmount || 0) + totalPrice).toFixed(2)),
      };
      const res = await api.post('/cart', item);
      if (res.data)
        dispatch({ type: `ADD_ITEM`, payload: { items: res.data.items, totalAmount: res.data.totalAmount  } });
    } catch (err) {
      console.error('Failed to add item to cart', err);
    }
  };

  const handleBuyNow = () => {
    const totalPrice = parseFloat((selectedQuantity * product.price).toFixed(2));
    const items = [
      {
        product: product,
        size: selectedSize,
        color: selectedColor,
        quantity: selectedQuantity,
        totalPrice,
      },
    ]
    const totalAmount = parseFloat(((product?.totalAmount || 0) + totalPrice).toFixed(2));

    navigate('/checkout', { state: { items, totalAmount } });
  }

  // Ensure the product is loaded before rendering
  if (!product) {
    return;
  }

  return (
    <Container
      sx={{
        padding: 2,
        backgroundColor: '#f9f9f9',
        marginTop: 4,
      }}
    >
      <Grid container spacing={4}>

        {/* Product Image and Thumbnails */}
        <ProductImage images={product.images} name={product.name}/>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          <hr />
          <Box display="flex" alignItems="center" mb={3}>
            {[...Array(5)].map((_, i) =>
              i < 3 ? (
                <StarIcon key={i} color="black" />
              ) : (
                <StarBorderIcon key={i} color="disabled" />
              )
            )}
            <Typography variant="body2" color="textSecondary" ml={1}>
              (3 Reviews)
            </Typography>
          </Box>
          <Typography
            sx={{
              color: '#dc143c',
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            ${product.price.toFixed(2)}
          </Typography>

          {/* Color and Size Selectors */}
          <Grid container spacing={2} sx={{ marginBottom: 4 }}>

            {/* Size Selector */}
            <Grid item xs={12} sx={{ marginTop: 1 }} display='flex'>
              <Typography
                variant="body2"
                sx={{
                  marginBottom: 1,
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  color: 'grey.700',
                  alignContent: 'center',
                  marginRight: '15px',
                }}
              >
                Size:
              </Typography>
              <Box display="flex" gap={2}>
                {product.sizes.map((size, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: '5px 12px',
                      border: '1px solid #000',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: selectedSize === size ? '#fff' : '#000',
                      backgroundColor: selectedSize === size ? '#000' : '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: selectedSize === size ? '#000' : '#f0f0f0',
                      },
                    }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Color Selector */}
            <Grid item xs={12} sx={{ marginTop: 1 }} display='flex'>
              <Typography
                variant="body2"
                sx={{
                  marginBottom: 1,
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  color: 'grey.700',
                  marginRight: '15px',
                  alignContent: 'center',
                }}
              >
                Color:
              </Typography>
              <Box display="flex" gap={2}>
                {product.colors.map((color, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 30, 
                      height: 30,
                      border: selectedColor === color ? '2px solid #000' : '2px solid #afafaf',
                      borderRadius: '50%',
                      backgroundColor: color,
                      opacity: selectedColor === color ? 1 : 0.6,
                      cursor: 'pointer',
                      transition: 'all 0.5s ease',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Quantity Controls */}
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
            <Typography
              variant="body2"
              sx={{
                marginBottom: 1,
                textTransform: 'uppercase',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                color: 'grey.700',
                alignContent: 'center',
                marginRight: '15px',
              }}
            >
              quantity:
            </Typography>
            <IconButton
              size="small"
              onClick={() => setSelectedQuantity((prev) => prev - 1)}
              disabled={(selectedQuantity || 1) === 1}
            >
              <RemoveIcon />
            </IconButton>
            <TextField
              value={selectedQuantity || 1}
              variant="standard"
              size="small"
              sx={{ width: 40, textAlign: "center" }}
              inputProps={{ style: { textAlign: "center" } }}
            />
            <IconButton
              size="small"
              onClick={() => setSelectedQuantity((prev) => prev + 1)}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Buttons Section */}
          <hr />
          <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 4 }}>
            {/* Buy Now Button */}
            <Grid item xs={12} md={5}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  color: '#dc143c', 
                  borderColor: '#dc143c',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#ffe6e6',
                    borderColor: '#dc143c',
                  },
                }}
                startIcon={<MonetizationOnOutlinedIcon sx={{ color: '#dc143c' }} />}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </Grid>

            {/* Add to Cart Button */}
            <Grid item xs={10} md={5}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#000',
                  color: '#fff',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                }}
                startIcon={<AddShoppingCartIcon />}
                disabled={product.stock === 0}
	  	          onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </Grid>

            {/* Wishlist Button */}
            <Grid item xs={2}>
              <Button
                variant={isWishlist ? 'contained' : 'outlined'}
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  padding: 0,
                  minWidth: 0,
                  color: isWishlist ? '#fff' : '#dc143c',
                  backgroundColor: isWishlist ? '#dc143c' : 'transparent',
                  borderColor: '#dc143c',
                  '&:hover': {
                    backgroundColor: isWishlist ? '#b3002d' : '#ffe6e6',
                    borderColor: '#dc143c',
                  },
                }}
                onClick={() => setIsWishlist(!isWishlist)}
              >
                <FavoriteBorderIcon sx={{ color: isWishlist ? '#fff' : '#dc143c' }} />
              </Button>
            </Grid>
          </Grid>
          <hr />

          {/* Share Buttons */}
          <Box display="flex" justifyContent="flex-end" alignItems="center" mt={4}>
            <Typography variant="body2" color="textSecondary" sx={{ marginRight: 2, fontWeight: 'bold' }}>
              Share this:
            </Typography>
            <Box display="flex" gap={1.5}>
              {/* Facebook */}
              <Button
                sx={{
                  minWidth: 'auto',
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: '#3b5998',
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'transform 0.3s ease, background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#2d4373',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Facebook fontSize="small" />
              </Button>
              {/* Twitter */}
              <Button
                sx={{
                  minWidth: 'auto',
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: '#1da1f2',
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'transform 0.3s ease, background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#148cc7',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Twitter fontSize="small" />
              </Button>
              {/* Pinterest */}
              <Button
                sx={{
                  minWidth: 'auto',
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: '#bd081c',
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'transform 0.3s ease, background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#8c0617',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Pinterest fontSize="small" />
              </Button>
            </Box>
          </Box>

          {/* */}
          <Box sx={{ marginTop: 4 }}>
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#dc143c',
                },
                '& .MuiTab-root': {
                  color: '#444',
                  fontWeight: 'bold',
                  '&.Mui-selected': {
                    color: '#dc143c',
                  },
                },
              }}
              aria-label="product tabs"
              fontWeight='bold'
            >
              <Tab label="Description" fontWeight="bold"/>
              <Tab label="Additional Info" fontWeight="bold"/>
              <Tab label="Shipping" fontWeight="bold"/>
            </Tabs>

            {/* Tab Panels */}
            <Box
              sx={{
                padding: 3,
                background: 'linear-gradient(145deg, #f9f9f9, #ffffff)',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                marginTop: 3,
              }}
            >
              {activeTab === 0 && (
                <Typography variant="body1">{product.description || 'No description available.'}</Typography>
              )}
              {activeTab === 1 && (
                <Typography variant="body1" color="textSecondary">
                  Additional information will be added here.
                </Typography>
              )}
              {activeTab === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <LocalShippingIcon sx={{ color: '#dc143c', fontSize: 30 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Free Shipping
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6e6e6e' }}>
                        Enjoy free standard shipping on orders over $50 (3-5 business days).
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <AccessTimeIcon sx={{ color: '#dc143c', fontSize: 30 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Expedited Shipping
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6e6e6e' }}>
                        Available for faster delivery (1-2 business days) with additional charges.
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <TrackingIcon sx={{ color: '#dc143c', fontSize: 30 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Order Tracking
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6e6e6e' }}>
                        Receive tracking details as soon as your order ships.
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <PublicIcon sx={{ color: '#dc143c', fontSize: 30 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                        International Shipping
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6e6e6e' }}>
                        Delivery times and costs vary by destination.
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <ShieldIcon sx={{ color: '#dc143c', fontSize: 30 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Reliability
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6e6e6e' }}>
                        We partner with trusted couriers to ensure safe and timely delivery.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SingleProductPage;
