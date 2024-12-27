import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import SelectDropdowns from './selectDropdowns';

const ChartBox = ({ salesData, filteredData, selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        position: 'relative',
        overflowX: 'auto',
        maxWidth: '100%',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Monthly Sales
      </Typography>

      <SelectDropdowns
        salesData={salesData}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
      />

      <LineChart
        width={600}
        height={300}
        data={filteredData}
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
  );
};

export default ChartBox;
