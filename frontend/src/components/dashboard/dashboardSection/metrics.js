import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export const metrics = [
  {
    title: 'Total Sales',
    value: '$50,000',
    icon: <AttachMoneyIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
    bgColor: '#e8f5e9',
  },
  {
    title: 'Orders',
    value: '1,200',
    icon: <ShoppingCartIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
    bgColor: '#fff3e0',
  },
  {
    title: 'Traffic',
    value: '30k Visitors',
    icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
    bgColor: '#e3f2fd',
  },
];

