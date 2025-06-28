import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest } from '../../features/auth/authSlice';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const roles = ['employee', 'director'];

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, approvalPending } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    employeeId: '',
    password: '',
    role: 'employee',
  });

  useEffect(() => {
    if (approvalPending) {
      alert('Your registration is pending HR approval.');
      navigate('/');
    }
  }, [approvalPending, navigate]);

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'hr':
          navigate('/hr/dashboard');
          break;
        case 'employee':
          navigate('/submit-claim');
          break;
        case 'director':
          navigate('/director/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

 const payload = { ...formData };
if (formData.role !== 'employee') {
  delete payload.employeeId;
}
dispatch(registerRequest(payload));
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={3} align="center">
        Register
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {approvalPending && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Registration submitted. Awaiting HR approval before login.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          required
          value={formData.username}
          onChange={handleChange}
          helperText="Enter your Name as it appears on your employee ID"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          required
          value={formData.email}
          onChange={handleChange}
        />
        {formData.role === 'employee' && (
          <TextField
            label="Employee ID"
            name="employeeId"
            fullWidth
            margin="normal"
            required
            value={formData.employeeId}
            onChange={handleChange}
            helperText="Enter your unique employee ID (e.g., EMP123)"
          />
        )}
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          SelectProps={{ native: true }}
          fullWidth
          margin="normal"
          required
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>
      </form>

      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link
          component="button"
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          Back to Login
        </Link>
      </Typography>
    </Box>
  );
}
