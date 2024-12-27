import React from 'react';
import { Box, Grid, Paper, Typography, LinearProgress } from '@mui/material';
import KPIIndicator from './KPIIndicator';

const KPISection = ({ totalSales, totalOrders, totalTraffic, repeatCustomers }) => {
  const conversionRate = ((totalOrders / totalTraffic) * 100).toFixed(2);
  const averageOrderValue = (totalSales / totalOrders).toFixed(2);
  const customerRetentionRate = ((repeatCustomers / totalOrders) * 100).toFixed(2);

  const kpis = [
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      description: 'Orders to Traffic Ratio',
      progress: conversionRate,
      color: 'primary',
    },
    {
      title: 'Average Order Value (AOV)',
      value: `$${averageOrderValue}`,
      description: 'Total Sales ÷ Orders',
      progress: (averageOrderValue / 100) * 100, // Assuming $100 is the target AOV
      color: 'success',
    },
    {
      title: 'Customer Retention Rate',
      value: `${customerRetentionRate}%`,
      description: 'Percentage of Repeat Customers',
      progress: customerRetentionRate,
      color: 'secondary',
    },
  ];

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Key Performance Indicators (KPIs)
      </Typography>
      <Grid container spacing={3}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <KPIIndicator kpi={kpi} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KPISection;

