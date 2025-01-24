import * as React from 'react';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const payments = [
  { name: 'Card type:', detail: 'Visa' },
  { name: 'Card holder:', detail: 'Mr. John Smith' },
  { name: 'Card number:', detail: 'xxxx-xxxx-xxxx-1234' },
  { name: 'Expiry date:', detail: '04/2024' },
];

export default function Review({ shippingAddress, items, totalAmount }) {
  //const { firstName, lastName, address1, address2, city, state, zip, country } = shippingAddress;
  const { firstName, lastName, ...addresses } = shippingAddress;
  const taxes = 9.99;

  const formatAddress = (address) => {
    const {
      address1,
      address2,
      city,
      state,
      zip,
      country,
    } = address;

    return `${address1}${address2 ? `, ${address2}` : ""}, ${city}, ${state}, ${zip}, ${country}`;
  };

  return (
    <Stack spacing={2}>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Products" secondary={`${items.length} selected`} />
          <Typography variant="body2">${totalAmount}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" secondary="Plus taxes" />
          <Typography variant="body2">+ ${taxes}</Typography>
        </ListItem>
        <hr />
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            ${parseFloat((totalAmount + taxes).toFixed(2))}
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="body2" fontWeight='bold' sx={{ pb: 1 }}>
            Shipment details:
          </Typography>
          <Typography gutterBottom>{`${firstName} ${lastName}`}</Typography>
          <Typography gutterBottom sx={{ color: 'text.secondary' }}>
            {formatAddress(addresses)}
          </Typography>
        </div>
        <div>
          <Typography variant="body2" fontWeight='bold' sx={{ pb: 1 }}>
            Payment details:
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: '100%', mb: 1 }}
                >
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {payment.name}
                  </Typography>
                  <Typography variant="body2">{payment.detail}</Typography>
                </Stack>
              </React.Fragment>
            ))}
          </Grid>
        </div>
      </Stack>
    </Stack>
  );
}
