import React, { useState } from 'react';
import { Box, Button, Typography, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BaseTable from './baseTable';
import useDataManagement from './test';

const GeneralSection = ({
  title,
  columns,
  fetchEndpoints,
  transformData,
  dialogComponents: { EditDialog, AddDialog },
  actions: { addAction, editAction, deleteAction, bulkDeleteAction },
}) => {
  const { data, categories, subcategories, setData } = useDataManagement({
    fetchEndpoints,
    transformData,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEdit = (id) => {
    const item = data.find((item) => item._id === id);
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const filteredData = data.filter((item) => {
    const matchesSearchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInventory =
      inventoryFilter === 'low'
        ? item.stock < 10
        : inventoryFilter === 'in-stock'
        ? item.stock > 0
        : inventoryFilter === 'out-of-stock'
        ? item.stock === 0
        : true;

    return matchesSearchQuery && matchesInventory;
  });

  return (
    <Box p={0}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap">
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddOpen(true)}>
          Add Item
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Search Items"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: '200px' }}
        />
        <FormControl size="small" sx={{ flex: 1, minWidth: '200px' }}>
          <InputLabel>Inventory Status</InputLabel>
          <Select
            value={inventoryFilter}
            onChange={(e) => setInventoryFilter(e.target.value)}
            label="Inventory Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="low">Low Stock</MenuItem>
            <MenuItem value="in-stock">In Stock</MenuItem>
            <MenuItem value="out-of-stock">Out of Stock</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <BaseTable
        rows={filteredData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={deleteAction}
        onBulkDelete={bulkDeleteAction}
      />

      {EditDialog && (
        <EditDialog
          open={isEditOpen}
          item={selectedItem}
          onClose={() => setIsEditOpen(false)}
          onSave={(editedItem) => {
            editAction(editedItem, setData);
            setIsEditOpen(false);
          }}
          categories={categories}
        />
      )}

      {AddDialog && (
        <AddDialog
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSave={(newItem) => {
            addAction(newItem, setData);
            setIsAddOpen(false);
          }}
          categories={categories}
        />
      )}
    </Box>
  );
};

export default GeneralSection;
