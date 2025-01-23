import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function AddressForm({ formData, handleChange, errors }) {

  return (
    <Grid container spacing={3}>
      <FormGrid size={{ xs: 12 }}>
      	<Typography variant="h6">Shipping Address</Typography>
      	<Typography variant="body2" color="textSecondary" gutterBottom>
          Enter the shipping address details for the order.
        </Typography>
      </FormGrid>

      <FormGrid size={{ xs: 12, md: 6 }}>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          variant="standard"
          required
          fullWidth
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          variant="standard"
          required
          fullWidth
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <TextField
          label="Address Line 1"
          name="address1"
          value={formData.address1}
          onChange={handleChange('address1')}
          variant="standard"
          required
          fullWidth
          error={!!errors.address1}
          helperText={errors.address1}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <TextField
          label="Address Line 2"
          name="address2"
          value={formData.address2}
          onChange={handleChange('address2')}
          variant="standard"
          fullWidth
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <TextField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange('city')}
          variant="standard"
          required
          fullWidth
          error={!!errors.city}
          helperText={errors.city}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <TextField
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange('state')}
          variant="standard"
          required
          fullWidth
          error={!!errors.state}
          helperText={errors.state}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <TextField
          label="Zip / Postal Code"
          name="zip"
          value={formData.zip}
          onChange={handleChange('zip')}
          variant="standard"
          required
          fullWidth
          error={!!errors.zip}
          helperText={errors.zip}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <TextField
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange('country')}
          variant="standard"
          required
          fullWidth
          error={!!errors.country}
          helperText={errors.country}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <FormControlLabel
          control={<Checkbox name="saveAddress" value="yes" />}
          label="Use this address for payment details"
        />
      </FormGrid>
    </Grid>
  );
}
