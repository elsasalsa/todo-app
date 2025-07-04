'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleSubmit = () => {
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    toast('This feature is not available yet. Please contact admin.', {
      icon: 'ℹ️',
    });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f4f4f4"
      px={2}
    >
      <Card sx={{ width: '100%', maxWidth: 400, borderRadius: 3, p: 3 }}>
        <CardContent>
          <Box textAlign="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              Forgot Password
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Enter your email and we will send you a link to reset your password.
            </Typography>
          </Box>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 2, textTransform: 'none' }}
          >
            Send Reset Link
          </Button>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              Remember your password?{' '}
              <a href="/auth/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                Back to Login
              </a>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
