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
      router.replace('/todo');
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
    const emailToSend = email.includes('@') ? email : `${email}@squareteam.com`;
    try {
      await register(fullName, emailToSend, password);
      toast.success('Register success!');
      setTimeout(() => {
        window.location.href = '/login';
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
      <Box mt={8} p={4} boxShadow={3} borderRadius={4} bgcolor="#fff">
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
          Register
        </Typography>
        <Typography variant="body2" align="center" mb={3} color="text.secondary">
          Let’s Sign up first for enter into Square Website. Uh She Up!
        </Typography>

        <Box component="form" display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={2}>
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              value={form.firstName}
              onChange={handleChange}
            />
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              value={form.lastName}
              onChange={handleChange}
            />
          </Box>

          <TextField
            label="Mail Address"
            name="email"
            fullWidth
            value={form.email}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">@squareteam.com</InputAdornment>
              ),
            }}
          />

          <Box display="flex" gap={2}>
            <TextField
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
              href="/login"
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
    </Container>
  );
}