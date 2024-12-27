import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';

const KPIIndicator = ({ kpi }) => {
  const { title, value, description, progress, color } = kpi;

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4" color={color} sx={{ marginY: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
        {description}
      </Typography>
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={color}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>
    </Paper>
  );
};

export default KPIIndicator;
