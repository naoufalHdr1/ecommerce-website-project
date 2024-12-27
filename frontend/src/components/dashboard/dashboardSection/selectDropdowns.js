import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

const SelectDropdowns = ({ salesData, selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
      <FormControl sx={{ marginRight: 2 }}>
        <InputLabel>Month</InputLabel>
        <Select
          value={selectedMonth}
          onChange={onMonthChange}
          label="Month"
          IconComponent={KeyboardArrowDown}
        >
          {Object.keys(salesData[selectedYear]).map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Year</InputLabel>
        <Select
          value={selectedYear}
          onChange={onYearChange}
          label="Year"
          IconComponent={KeyboardArrowDown}
        >
          {Object.keys(salesData).map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectDropdowns;
