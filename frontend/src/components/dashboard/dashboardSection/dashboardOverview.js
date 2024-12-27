import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import MetricCard from './metricCard';
import ChartBox from './chartBox';
import KPISection from './KPISection';
import { metrics } from './metrics';
import { salesData } from './salesData';

const DashboardOverview = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [selectedYear, setSelectedYear] = useState('2024');

  const handleMonthChange = (event) => setSelectedMonth(event.target.value);
  const handleYearChange = (event) => setSelectedYear(event.target.value);

  const filteredData = salesData[selectedYear][selectedMonth];
  const totalSales = filteredData.reduce((acc, cur) => acc + cur.Sales, 0);
  const totalOrders = filteredData.reduce((acc, cur) => acc + cur.Orders, 0);
  const totalTraffic = filteredData.reduce((acc, cur) => acc + cur.Traffic, 0);
  const repeatCustomers = 300; // Example static data for repeat customers

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 4 }}>
      <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
        Store Performance Overview
      </Typography>

      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <MetricCard metric={metric} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <KPISection
            totalSales={totalSales}
            totalOrders={totalOrders}
            totalTraffic={totalTraffic}
            repeatCustomers={repeatCustomers}
          />
        </Grid>

        <Grid item xs={12}>
          <ChartBox
            salesData={salesData}
            filteredData={filteredData}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
