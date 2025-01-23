import { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  IconButton,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { API_BASE_URL } from '../../utils/config';

const ProductImage = ({ images, name }) => {
  const [currentImage, setCurrentImage] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const thumbnailsToShow = 5;

  useEffect(() => {
    if (images.length > 0) setCurrentImage(images[0]);
  }, [images, currentImage]);

  const handleThumbnailClick = (image) => {
    setCurrentImage(image);
  };

  const handleNext = () => {
    if (startIndex + thumbnailsToShow < images.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <Grid item xs={12} md={6}>
      {/* Main Image */}
      <img
        src={`${API_BASE_URL}${currentImage}`}
        alt={name}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: 8,
        }}
      />

      {/* Thumbnails with Arrows */}
      <Box
        display="flex"
        alignItems="center"
        mt={2}
        sx={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left Arrow */}
        {startIndex > 0 && (
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 0,
              zIndex: 2,
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}

        {/* Thumbnails */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            overflow: 'hidden',
            width: '100%',
            margin: '0 32px', // Space for arrows
          }}
        >
          {images
            .slice(startIndex, startIndex + thumbnailsToShow)
            .map((img, index) => (
              <img
                key={index}
                src={`${API_BASE_URL}${img}`}
                alt={`Thumbnail ${index}`}
                style={{
                  cursor: 'pointer',
                  margin: '8px',
                  border: currentImage === img ? '2px solid #dc143c' : '2px solid transparent',
                  borderRadius: 8,
                  height: '60px',
                }}
                onClick={() => handleThumbnailClick(img)}
              />
            ))}
        </Box>

        {/* Right Arrow */}
        {startIndex + thumbnailsToShow < images.length && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 0,
              zIndex: 2,
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}
      </Box>
    </Grid>
  );
}

export default ProductImage;
