import ModelSection from '../modelSection';
import OrderDialog from './orderDialog';

export default function OrderOverview() {
  const orderConfig = {
    modelName: 'Order',
    apiEndpoint: '/orders',
    columns: [
      { field: '_id', headerName: 'Order ID', width: 200 },
      { field: 'fullName', headerName: 'Customer', width: 150,
        renderCell: (params) => (params.row.user?.fullName || 'no name')
       },
      { field: 'totalAmount', headerName: 'Total', width: 100 },
      { field: 'products', headerName: 'Products', width: 100,
        renderCell: (params) => (params.row.items?.length || 0)
       },
      { field: 'status', headerName: 'Status', width: 150 },
    ],
    dialogComponent: OrderDialog,
  }
  return (
    <ModelSection modelConfig={orderConfig} />
  );
}
