import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { KeyboardArrowDown } from '@mui/icons-material';


const metrics = [
  {
    title: "Total Sales",
    value: "$50,000",
    icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#4caf50" }} />,
    bgColor: "#e8f5e9",
  },
  {
    title: "Orders",
    value: "1,200",
    icon: <ShoppingCartIcon sx={{ fontSize: 40, color: "#ff9800" }} />,
    bgColor: "#fff3e0",
  },
  {
    title: "Traffic",
    value: "30k Visitors",
    icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#2196f3" }} />,
    bgColor: "#e3f2fd",
  },
];

const salesData = {
  '2024': {
    Jan: [
      { day: 0, Sales: 4000, Orders: 2400, Traffic: 4000 },
      { day: 5, Sales: 3000, Orders: 2200, Traffic: 3500 },
      { day: 10, Sales: 5000, Orders: 3300, Traffic: 4500 },
      { day: 15, Sales: 7000, Orders: 4100, Traffic: 6000 },
      { day: 20, Sales: 6000, Orders: 3200, Traffic: 5000 },
      { day: 25, Sales: 8000, Orders: 5000, Traffic: 6500 },
      { day: 30, Sales: 8500, Orders: 5600, Traffic: 7000 },
    ],
    Feb: [
      { day: 0, Sales: 2000, Orders: 1500, Traffic: 2000 },
      { day: 5, Sales: 2500, Orders: 1700, Traffic: 2500 },
      { day: 10, Sales: 3500, Orders: 2000, Traffic: 3000 },
      { day: 15, Sales: 4000, Orders: 2500, Traffic: 3500 },
      { day: 20, Sales: 5000, Orders: 3000, Traffic: 4500 },
      { day: 25, Sales: 5500, Orders: 3300, Traffic: 5000 },
      { day: 30, Sales: 6000, Orders: 3600, Traffic: 6000 },
    ],
  },
};

const DashboardOverview = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [selectedYear, setSelectedYear] = useState('2024');

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const filteredData = salesData[selectedYear][selectedMonth];

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 4 }}>
      <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
        Store Performance Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Sales Card */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h4" color="primary">
                $85,000
              </Typography>
            </Box>
            <AttachMoneyIcon sx={{ fontSize: 40, color: 'green' }} />
          </Paper>
        </Grid>

        {/* Orders Card */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4" color="primary">
                1,250
              </Typography>
            </Box>
            <ShoppingCartIcon sx={{ fontSize: 40, color: '#1976d2' }} />
          </Paper>
        </Grid>

        {/* Traffic Card */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6">Traffic</Typography>
              <Typography variant="h4" color="primary">
                34,500
              </Typography>
            </Box>
            <TrendingUpIcon sx={{ fontSize: 40, color: '#ffa726' }} />
          </Paper>
        </Grid>

        {/* Line Chart with Month and Year Selectors Inside the Box */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              position: 'relative',  // To position the select dropdown inside the chart box
              overflowX: 'auto',     // Makes the chart scrollable on small screens
              maxWidth: '100%',
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Monthly Sales
            </Typography>

            {/* Month and Year Select Dropdowns */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
              <FormControl sx={{ marginRight: 2 }}>
                <InputLabel>Month</InputLabel>
                <Select value={selectedMonth} onChange={handleMonthChange} label="Month" IconComponent={KeyboardArrowDown}>
                  {Object.keys(salesData[selectedYear]).map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Year</InputLabel>
                <Select value={selectedYear} onChange={handleYearChange} label="Year" IconComponent={KeyboardArrowDown}>
                  {Object.keys(salesData).map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Line Chart */}
            <LineChart
              width={600}
              height={300}
              data={filteredData} // Displaying data for the selected month and year
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="Sales" stroke="#8884d8" />
              <Line type="monotone" dataKey="Orders" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Traffic" stroke="#ff7300" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="day" interval="preserveStartEnd" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
