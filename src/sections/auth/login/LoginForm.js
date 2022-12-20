import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import FBLogo from '../../../components/FBLogo';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onClick = async () => {
    const authURL =
      'https://auth.freshbooks.com/oauth/authorize?client_id=3351e01979a74f2c2fbc2a1698855abbc8879a0d8e065a0b2393ced8aa1ccaab&response_type=code&redirect_uri=https%3A%2F%2Fvictorchenli.github.io%2Fone-tracking&scope=user%3Aprofile%3Aread%20user%3Ainvoices%3Aread%20user%3Ainvoices%3Awrite';
    // navigate(authURL, { replace: true });
    window.location.replace(authURL);
  };

  return (
    <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} onClick={onClick}>
      <Stack spacing={4} direction="row" alignItems="center" justifyContent="center">
        <FBLogo sx={{ marginRight: 1 }} />
        Login with FreshBooks
      </Stack>
    </LoadingButton>
  );
}
