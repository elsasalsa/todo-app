'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { register } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    about: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      toast('You are logged in!', { icon: 'ℹ️' });

      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.role === 'ADMIN') {
          router.replace('/todo/admin');
        } else {
          router.replace('/todo/user');
        }
      } catch (err) {
        console.error('Invalid token');
        router.replace('/auth/login');
      }
    }
  }, [router]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, password, confirmPassword, about } = form;
    if (!firstName || !lastName || !email || !password || !confirmPassword || !about) {
      toast.error('Please fill in all the fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const fullName = `${firstName} ${lastName}`.trim();
    const emailToSend = email.includes('@') ? email : `${email}@gmail.com`;
    try {
      await register(fullName, emailToSend, password);
      toast.success('Register success!');
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const apiError = err.response?.data;
        if (apiError?.errors?.length > 0) {
          toast.error(apiError.errors[0]);
        } else {
          toast.error(apiError?.message || 'Registration failed');
        }
      } else {
        toast.error('Registration failed');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          width="100%"
          maxWidth={480}
          p={4}
          boxShadow={3}
          borderRadius={4}
          bgcolor="#fff"
        >
          <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
            Register
          </Typography>
          <Typography variant="body2" align="center" mb={3} color="text.secondary">
            Let’s sign up first to get started with Todolistify. Uh She Up!
          </Typography>

          <Box component="form" display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={2}>
              <TextField
                size="small"
                label="First Name"
                name="firstName"
                fullWidth
                value={form.firstName}
                onChange={handleChange}
              />
              <TextField
                size="small"
                label="Last Name"
                name="lastName"
                fullWidth
                value={form.lastName}
                onChange={handleChange}
              />
            </Box>

            <TextField
              size="small"
              label="Mail Address"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">@gmail.com</InputAdornment>
                ),
              }}
            />

            <Box display="flex" gap={2}>
              <TextField
                size="small"
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={form.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                size="small"
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                value={form.confirmPassword}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <TextField
              label="Tell us about yourself"
              name="about"
              placeholder="Hello my name..."
              fullWidth
              multiline
              rows={3}
              value={form.about}
              onChange={handleChange}
            />

            <Box display="flex" gap={2}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                component={Link}
                href="/auth/login"
              >
                Login
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}