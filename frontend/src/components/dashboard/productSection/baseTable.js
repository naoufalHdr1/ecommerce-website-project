import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BaseTable = ({ rows, columns, onEdit, onDelete, getRowId, onBulkDelete }) => {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

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
                    onClick={() => onEdit(params.row._id)}
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
                    onClick={() => onDelete(params.row)}
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
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
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
      {rowSelectionModel.length > 0 && (
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="error"
            onClick={() => onBulkDelete(rowSelectionModel)}
          >
            Delete Selected ({rowSelectionModel.length})
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BaseTable;
