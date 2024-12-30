import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BaseTable = ({ rows, columns, onEdit, onDelete, getRowId }) => {
  // Extend columns to include actions if `onEdit` or `onDelete` are provided
  const enhancedColumns = [
    ...columns,
    ...(onEdit || onDelete
      ? [
          {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                {onEdit && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => onEdit(params.row)}
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(params.row.id)}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            ),
          },
        ]
      : []),
  ];

  return (
    <Box
      sx={{
        marginBottom: '25px',
        width: '100%',
        overflowX: { xs: 'auto', sm: 'hidden' },
      }}
    >
      <DataGrid
        rows={rows}
        columns={enhancedColumns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
        autoHeight
        getRowId={getRowId || ((row) => row._id)}
        sx={{
          '& .MuiDataGrid-root': {
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
            fontSize: '0.9rem',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#f5f5f5',
          },
        }}
      />
    </Box>
  );
};

export default BaseTable;
