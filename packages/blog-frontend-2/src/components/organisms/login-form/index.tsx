import { useState } from 'react';
import type { FC } from 'react';
// import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAuth } from '../../../hooks/use-auth';
// import { useMounted } from '../../../hooks/use-mounted';
import { SignInData } from '../../../types/auth.type';

export const LoginForm: FC = () => {
  //   const isMounted = useMounted();
  //   const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: '',
    password: '',
    submit: null,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Must be a valid email')
      .max(255)
      .required('Email is required'),
    password: Yup.string().max(255).required('Password is required'),
  });

  const validation = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: SignInData): Promise<void> => {
    setLoading(true);
    const resp = await login(values.email, values.password);
    if (resp.success) {
    } else {
      setError('error');
    }
    setLoading(false);
  };

  const handleSubmit = validation.handleSubmit;

  /* values */
  const emailVal = validation.getValues('email');
  const passwordVal = validation.getValues('password');

  /* errors */
  const emailErr = validation.formState.errors.email;
  const passwordErr = validation.formState.errors.password;

  /* touches */
  const emailTouched = validation.formState.touchedFields.email;
  const passwordTouched = validation.formState.touchedFields.password;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormProvider {...validation}>
      <TextField
        {...validation.register('email')}
        error={Boolean(emailTouched && emailErr)}
        fullWidth
        helperText={Boolean(emailTouched && emailErr)}
        label="Email Address"
        margin="normal"
        name="email"
        type="email"
        value={emailVal}
      />

      <FormControl sx={{ width: '100%', marginTop: '10px' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          {...validation.register('password')}
          error={Boolean(passwordTouched && passwordErr)}
          fullWidth
          label="Password"
          name="password"
          value={passwordVal}
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
          onClick={() => handleSubmit(onSubmit)()}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
        >
          Login
        </LoadingButton>
      </Box>
    </FormProvider>
  );
};
