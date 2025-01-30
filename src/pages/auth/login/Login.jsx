import React, { useContext, useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Divider,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import { Link as LinkTo, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext.jsx";
import useApiInstance from "../../../customHooks/useApiInstance.js";
import { checkValidEmail } from "../../../utils/functions.js";
import apiRoutes from "../../../api/apiRoutes.js";
import {
  handleApiError,
  handleNetworkError,
} from "../../../utils/handleError.js";
import { AxiosError } from "axios";

const styles = {
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: 1,
    backgroundColor: "secondary.main",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: 3,
  },
  submit: {
    margin: "24px 0 16px",
  },
};

const initialFormState = {
  email: "",
  password: "",
};

const initialErrorState = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { setUserToLocalStorage } = useContext(UserContext);
  const apiInstance = useApiInstance();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...initialErrorState };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!checkValidEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password can't be less then 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return null;

    try {
      setIsLoading(true);
      const signinResponse = await apiInstance.post(apiRoutes.signin, {
        email: formData.email,
        password: formData.password,
      });
      console.log("signup response : ", signinResponse);
      if (signinResponse.data.is_success) {
        setUserToLocalStorage(signinResponse.data.data);
        console.log("user logged in successfully : ", signinResponse);
        setIsLoading(false);
        navigate("/");
      }

      console.log("form validation success : ", formData);
    } catch (error) {
      if (
        error instanceof AxiosError &&
        (error.status === 500 || error.status === 404 || error.status === 401)
      ) {
        if (error.response.data.error_code === "USER_NOT_FOUND") {
          alert(error.response.data.error_message);
        } else if (error.response.data.error_code === "INCORRECT_PASSWORD") {
          console.log("INCORRECT_PASSWORD");
          window.alert(error.response.data.error_message);
        }
        handleApiError(error.response.data.error_code);
      } else if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
        handleNetworkError();
      } else {
        console.log("unexpected error : ", error);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={styles.paper}>
        <Avatar sx={styles.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={styles.form}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.submit}
          >
            Sign in
          </Button>
          <Grid container justifyContent="center">
            <Grid>
              <LinkTo to="/sign-up" variant="body2">
                Don't have an account? Sign up
              </LinkTo>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Divider sx={{ marginTop: 5 }} />
    </Container>
  );
};

export default Login;
