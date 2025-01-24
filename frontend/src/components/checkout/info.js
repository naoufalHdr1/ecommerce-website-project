import React, { useEffect } from 'react';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

function Info({ items, totalAmount }) {

  return (
    <React.Fragment>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
        ${totalAmount}
      </Typography>
      <List disablePadding>
        {items.map((item) => (
          <Badge
            badgeContent={`x${item.quantity}`}
            color="primary"
            key={item.product.name}
            sx={{
              '& .MuiBadge-badge': {
                right: -3,
                top: item.size || item.color ? 13 : 2,
                border: (theme) => `2px solid ${theme.palette.background.paper}`,
                padding: '0 4px',
              },
            }}
          >
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText
                sx={{ mr: 2 }}
                primary={item.product.name}
                secondary={`${item.size ? `Size: ${item.size}` : ''}${item.size && item.color ? ' | ' : ''}${item.color ? `Color: ${item.color}` : ''}`}
              />
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                ${item.totalPrice}
              </Typography>
            </ListItem>
          </Badge>
        ))}
      </List>
    </React.Fragment>
  );
}

export default Info;
