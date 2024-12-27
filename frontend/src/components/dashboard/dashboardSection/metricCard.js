import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const MetricCard = ({ metric }) => {
  const { title, value, icon, bgColor } = metric;

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: bgColor,
      }}
    >
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" color="primary">
          {value}
        </Typography>
      </Box>
      {icon}
    </Paper>
  );
};

export default MetricCard;
