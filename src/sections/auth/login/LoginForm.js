import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Link, Stack, IconButton, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../components/Iconify";
import {
  FormProvider,
  RHFTextField,
  RHFCheckbox,
} from "../../../components/hook-form";
import FBLogo from "../../../components/FBLogo";
import { envVariable } from "src/utils/constant";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "",
    password: "",
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
    const authURL = envVariable.auth_page;
    // navigate(authURL, { replace: true });
    window.location.replace(authURL);
  };

  return (
    <LoadingButton
      fullWidth
      size="large"
      type="submit"
      variant="contained"
      loading={isSubmitting}
      onClick={onClick}
    >
      <Stack
        spacing={4}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <FBLogo sx={{ marginRight: 1 }} />
        Login with FreshBooks
      </Stack>
    </LoadingButton>
  );
}
