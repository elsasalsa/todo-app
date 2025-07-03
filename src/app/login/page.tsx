'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { login } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      toast('You are logged in!', { icon: 'ℹ️' });
      router.replace('/todo');
    }
  }, [router]);

  useEffect(() => {
    setIsClient(true);
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRemember = localStorage.getItem('rememberMe');
    if (savedRemember === 'true' && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  if (!isClient) return null;

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      const token = res.token;
      if (!token) {
        toast.error('Login failed: no token returned');
        return;
      }
      localStorage.setItem('token', token);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMe');
      }
      toast.success('Login successful!');
      const role = res.user.role?.toLowerCase();

      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = '/admin-page';
        } else {
          window.location.href = '/todo';
        }
      }, 1000);

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Login failed');
      }
    }
  };

  return (
    <Container maxWidth="sm" >
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          width="100%"
          maxWidth={480}
          p={5}
          boxShadow={3}
          borderRadius={4}
          bgcolor="#fff"
        >
          <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body2" align="center" mb={1.5} color="text.secondary">
            Just sign in if you have an account here. Enjoy our website.
          </Typography>

          <TextField
            label="Your Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Enter Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Link href="/forgot-password" underline="hover" variant="body2">
              Forgot password?
            </Link>
          </Box>

          <Button fullWidth variant="contained" onClick={handleLogin} sx={{ fontWeight: 600 }}>
            Login
          </Button>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              Don’t have an account?{' '}
              <Link href="/register" underline="hover">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
