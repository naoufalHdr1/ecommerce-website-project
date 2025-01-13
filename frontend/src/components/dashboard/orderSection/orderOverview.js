import ModelSection from '../modelSection';
import OrderDialog from './orderDialog';

export default function OrderOverview() {
  const orderConfig = {
    modelName: 'Order',
    apiEndpoint: '/orders',
    columns: [
      { field: 'orderId', headerName: 'Order ID', width: 200 },
      { field: 'status', headerName: 'Status', width: 150 },
      { field: 'total', headerName: 'Total', width: 150 },
    ],
    dialogComponent: OrderDialog,
  }
  return (
    <ModelSection modelConfig={orderConfig} />
  );
}
