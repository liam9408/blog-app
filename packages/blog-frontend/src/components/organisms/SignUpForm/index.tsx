import { useState } from 'react';
import type { FC } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import {
  Box,
  FormHelperText,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAuth } from 'src/hooks/use-auth';
import { RegistrationData } from 'src/types/auth.type';

export const SignUpForm: FC = () => {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .default('')
      .max(255)
      .required('First name is required'),
    lastName: Yup.string()
      .default('')
      .max(255)
      .required('Last name is required'),
    email: Yup.string()
      .default('')
      .email('Must be a valid email')
      .max(255)
      .required('Email is required'),
    password: Yup.string()
      .default('')
      .max(255)
      .required('Password is required'),
  });

  const form = useForm({
    defaultValues: validationSchema.getDefault(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<any>(validationSchema),
  });

  const { register, handleSubmit, formState } = form;

  const { errors } = formState;

  const onSubmit = async (values: RegistrationData): Promise<void> => {
    try {
      setLoading(true);
      await registerUser(
        values.email,
        values.password,
        values.firstName,
        values.lastName
      );
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('firstName')}
        error={!!errors.firstName}
        fullWidth
        helperText={errors.firstName?.message}
        label="First Name"
        margin="normal"
        name="firstName"
        type="text"
      />

      <TextField
        {...register('lastName')}
        error={!!errors.lastName}
        fullWidth
        helperText={errors.lastName?.message}
        label="Last Name"
        margin="normal"
        name="lastName"
        type="text"
      />

      <TextField
        {...register('email')}
        error={!!errors.email}
        fullWidth
        helperText={errors.email?.message}
        label="Email Address"
        margin="normal"
        name="email"
        type="email"
      />

      <FormControl sx={{ width: '100%', marginTop: '10px' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          {...register('password')}
          error={!!errors.password}
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      {error && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>{error}</FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
        >
          Sign Up
        </LoadingButton>
      </Box>
    </form>
  );
};
