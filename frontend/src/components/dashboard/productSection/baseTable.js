import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, Tooltip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Checkbox from '@mui/material/Checkbox';

const BaseTable = ({ rows, columns, onEdit, onDelete, getRowId, onBulkDelete }) => {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const enhancedColumns = [
    ...columns,
    ...(onEdit || onDelete
      ? [
          {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            headerAlign: 'right',
            renderCell: (params) => (
              <Box sx={{ display: 'flex', justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
                
                {/* Bookmark Indicator */}
                <Tooltip title={params.row.isFeatured ? "Bookmarked" : "Not Bookmarked"} sx={{ paddingRight: 0, paddingLeft: 0 }}>
                  {params.row.isFeatured ? <BookmarkIcon color="primary"/> : <BookmarkBorderIcon color="primary"/>}
                </Tooltip>

                {/* Edit Button */}
                <Tooltip title="Edit" sx={{ paddingRight: 0, paddingLeft: 0 }}>
                  <IconButton
                    color="disabled"
                    fontSize="small"
                    onClick={() => onEdit(params.row)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                {/* Delete Button */}
                <Tooltip title="Delete" sx={{ paddingRight: 0, paddingLeft: 0 }}>
                  <IconButton
                    color="disabled"
                    fontSize="small"
                    onClick={() => onDelete(params.row)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ),
          },
        ]
      : []),
  ];

  return (
    <Box>
      <Box
        sx={{
          height: 400, width: '100%'
        }}
      >
        <DataGrid
          rows={rows}
          columns={enhancedColumns}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          disableSelectionOnClick
          getRowId={getRowId || ((row) => row._id)}
          pagination
          pageSizeOptions={[10, 25, 50, { value: -1, label: 'All' }]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>

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

