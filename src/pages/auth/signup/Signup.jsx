import React, { useContext, useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Box,
  Typography,
  Container,
  Divider,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import { Link as LinkTo, useNavigate } from "react-router-dom";
import { checkValidEmail } from "../../../utils/functions";
// import apiInstance from "../../../api/axiosInstance";
import apiRoutes from "../../../api/apiRoutes";
import { UserContext } from "../../../context/UserContext.jsx";
import { AxiosError } from "axios";
import {
  handleApiError,
  handleNetworkError,
} from "../../../utils/handleError.js";
import useApiInstance from "../../../customHooks/useApiInstance.js";

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
    margin: "50px 0 16px",
  },
};

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const initialErrorState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const Signup = () => {
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

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
      valid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }

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
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return null;

    try {
      const name =
        formData.firstName.charAt(0).toUpperCase() +
        formData.firstName.substring(1) +
        " " +
        formData.lastName;
      setIsLoading(true);
      const signupResponse = await apiInstance.post(apiRoutes.signup, {
        name,
        email: formData.email,
        password: formData.password,
      });
      // console.log("signup response : ", signupResponse);
      if (signupResponse.data.is_success) {
        setUserToLocalStorage(signupResponse.data.data);
        // console.log("user logged in successfully : ", signupResponse);
        setIsLoading(false);
        navigate("/");
      }

      // console.log("form validation success : ", formData);
    } catch (error) {
      if (error instanceof AxiosError && error.code === "ERR_BAD_REQUEST") {
        const data = error && error.response?.data;
        if (data.error_code === "USER_ALREADY_EXIST") {
          setErrors({
            ...errors,
            email:
              "This email is already registered, try again with different one.",
          });
        }
      } else if (error instanceof AxiosError && error.status === 500) {
        handleApiError(error.response.data.error_code);
      } else if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
        handleNetworkError();
      } else {
        // console.log("unexpected error : ", error);
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
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={styles.form}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="firstName"
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="lastName"
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="password"
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            {/* <Grid>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I agree"
              />
            </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.submit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="center">
            <Grid>
              <LinkTo to="/sign-in" variant="body2">
                Already have an account? Sign in
              </LinkTo>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Divider sx={{ marginTop: 5 }} />
      {/* <Box mt={5} justifyItems={"center"}>
        this is Manoj bhatt
      </Box> */}
    </Container>
  );
};

export default Signup;
